import { useMemo, useRef } from 'react';
import { z } from 'zod';

// Types for useSchema hook
type Data = z.ZodObject<any, any> | z.ZodTypeAny | z.ZodDiscriminatedUnion<any, any>;
type DP = Record<string, any>;

type FieldHandlerContext = {
    initialValues: Record<string, any>;
    key: string;
    fieldSchema: z.ZodTypeAny;
    dp: DP;
};

const isDev =
    typeof process !== 'undefined' && process.env?.NODE_ENV === 'development';

/**
 * Generates initial values from schema and dependencies
 */
export const getInitialValues = <T extends Data>(schema: T, dp: DP = {}): z.infer<T> => {
    try {
        const shape =
            schema instanceof z.ZodObject
                ? (schema as z.ZodObject<any>).shape
                : {};

        const keys = Object.keys(shape);
        if (keys.length === 0) return {} as z.infer<T>;

        const initialValues: Record<string, any> = {};
        const dpKeys = new Set(Object.keys(dp));
        const ctx: FieldHandlerContext = {
            initialValues,
            key: '',
            fieldSchema: null as unknown as z.ZodTypeAny,
            dp,
        };

        for (const key of keys) {
            const fieldSchema = shape[key];
            const result = fieldSchema.safeParse(undefined);

            if (result.success) {
                initialValues[key] = result.data;
                continue;
            }

            if (dpKeys.has(key)) {
                initialValues[key] = dp[key];
                continue;
            }

            const fieldType = fieldSchema.constructor.name;
            const fieldHandler = FIELD_HANDLERS[fieldType];

            if (fieldHandler) {
                ctx.key = key;
                ctx.fieldSchema = fieldSchema;
                fieldHandler(ctx);
                continue;
            }

            initialValues[key] = '';
        }

        return initialValues as z.infer<T>;
    } catch (error) {
        if (isDev) {
            console.warn('getInitialValues error', error);
        }
        return {} as z.infer<T>;
    }
};

const FIELD_HANDLERS: Record<string, (ctx: FieldHandlerContext) => void> = {
    ZodEmail(ctx) {
        ctx.initialValues[ctx.key] = '';
    },
    ZodString(ctx) {
        ctx.initialValues[ctx.key] = '';
    },
    ZodNumber(ctx) {
        ctx.initialValues[ctx.key] = 0;
    },
    ZodBoolean(ctx) {
        ctx.initialValues[ctx.key] = false;
    },
    ZodDate(ctx) {
        ctx.initialValues[ctx.key] = null;
    },
    ZodArray(ctx) {
        ctx.initialValues[ctx.key] = [];
    },
    ZodObject(ctx) {
        ctx.initialValues[ctx.key] = getInitialValues(ctx.fieldSchema, ctx.dp);
    },
};

/**
 * Hook that provides reactive schema and initial values.
 * The schema is recalculated when `dp` changes (by reference).
 * To avoid unnecessary recalculations when the parent re-renders, pass a stable
 * `dp` (e.g. memoized with useMemo or from state). The callback `cbP` may be
 * inline; for maximum clarity it can also be stable (e.g. useCallback).
 *
 * @param cbP - Callback that returns the schema given dependencies (and optional preData).
 * @param dp - Dependencies object; schema and initialValues recompute when this reference changes.
 * @returns { schema, initialValues }
 */
export const useSchema = <T extends Data>(cbP: (dp: DP, preData?: Data) => T, dp: DP) => {
    const cbRef = useRef(cbP);
    cbRef.current = cbP;

    return useMemo(() => {
        const baseSchema = cbRef.current(dp);
        const schema = (baseSchema as any)._fieldConfig
            ? ((baseSchema as any).fieldConfig({
                  dp,
                  ...(baseSchema as any)._fieldConfig,
              }) as T)
            : (baseSchema as T);
        const initialValues = getInitialValues<T>(schema, dp);
        return { schema, initialValues } as const;
    }, [dp]);
};
