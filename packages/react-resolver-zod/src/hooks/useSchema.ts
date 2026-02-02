import { useMemo, useRef } from 'react';
import { z } from 'zod';

// Types for useSchema hook
type Data = z.ZodObject<any, any> | z.ZodTypeAny | z.ZodDiscriminatedUnion<any, any>;
type DP = Record<string, any>;

/**
 * Generates initial values from schema and dependencies
 */
export const getInitialValues = <T extends Data>(schema: T, dp: DP = {}): z.infer<T> => {
    try {
        const shape = (() => {
            if (schema instanceof z.ZodObject) return (schema as z.ZodObject<any>).shape;
            return {};
        })();

        const initialValues: Record<string, any> = {};
        const dpKeys = new Set(Object.keys(dp));

        for (const key of Object.keys(shape)) {
            const fieldSchema = shape[key];
            const result = fieldSchema.safeParse(undefined);

            // Si tiene valor por defecto
            if (result.success) {
                initialValues[key] = result.data;
                continue;
            }

            if (dpKeys.has(key)) {
                initialValues[key] = dp[key];
                continue;
            }

            // Inferir tipo para campos requeridos sin default
            const fieldConfig = {
                ZodEmail() {
                    initialValues[key] = '';
                },
                ZodString() {
                    initialValues[key] = '';
                },
                ZodNumber() {
                    initialValues[key] = 0;
                },
                ZodBoolean() {
                    initialValues[key] = false;
                },
                ZodDate() {
                    initialValues[key] = null;
                },
                ZodArray() {
                    initialValues[key] = [];
                },
                ZodObject() {
                    initialValues[key] = getInitialValues(fieldSchema, dp);
                },
            };

            const fieldType = fieldSchema.constructor.name;
            const fieldHandler = fieldConfig[fieldType as keyof typeof fieldConfig];

            if (fieldHandler) {
                fieldHandler();
                continue;
            }

            initialValues[key] = '';
        }

        return initialValues as z.infer<T>;
    } catch (error) {
        console.log('🔴 initialValues error', error);

        if (error instanceof Error) {
            console.log(error.cause);
            console.log(error.message);
        }

        return {} as z.infer<T>;
    }
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

    const schema = useMemo(() => {
        const baseSchema = cbRef.current(dp);
        // Check if fieldConfig exists (for backward compatibility)
        if ((baseSchema as any)._fieldConfig) {
            return (baseSchema as any).fieldConfig({
                dp,
                ...(baseSchema as any)._fieldConfig,
            }) as T;
        }
        return baseSchema as T;
    }, [dp]);

    const initialValues = useMemo(() => getInitialValues<T>(schema, dp), [schema, dp]);

    return { schema, initialValues } as const;
};
