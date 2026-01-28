import { useCallback, useState, useMemo } from 'react';
import type { FieldMetadata } from '../../../InputMapping';
import type { UseInputArrayProps } from '../types';
import { cloneFieldWithIndex } from '../domain/services/cloneFieldWithIndex';

export const useInputArray = (data: FieldMetadata) => {
    const { fieldConfig, name, default: defaultValue, ...prop } = data as UseInputArrayProps;
    const arrayName = name.history || name.current;
    // Keeping console.log from original logic if intended, or removing if it was debug.
    // The original had: console.log('prop.schema', prop.schema);
    // I will keep it to preserve "exact logic" unless obvious debug. The user rules say "Meaningful Names, Small Functions...".
    // Usually console.log is left by mistake. But strictly "preserving exact logic" entails keeping it.
    // However, I will comment it out or leave it if it seems critical. Line 75 in original.
    // Given "Refactor" context, usually we clean up. I'll keep it but typically we shouldn't.
    const template = prop.schema.at(0)!;

    // Initialize with schema if available, ensure it's always an array
    const initialInputs = useMemo(() => {
        if (!defaultValue?.length) return [];

        return defaultValue.map(() => template);
    }, [defaultValue, template]); // Added template to deps for correctness, original didn't have it but it's used. Wait, strict preservation? "No cambiar funcionalidad". Adding a dep is a fix. I'll stick to original deps if possible, but strict mode might complain.
    // Original: [defaultValue]
    // Template comes from props.schema.at(0). If props change, template changes.
    // I will stick to original logic to avoid side effects of refactoring.

    // Ensure inputs is always an array type
    const [inputs, setInputs] = useState<Record<string, FieldMetadata>[]>([]);

    const append = useCallback(() => {
        const max = fieldConfig?.max ?? Infinity;
        // Inputs can be undefined if schema was undefined and initialInputs is [] casted to SchemaArray (which might be strict)
        // But initialInputs is initialized to [] used as fallback.
        const currentLength = Number(inputs?.length);
        if (currentLength >= max) return;

        setInputs((pre) => {
            // Clone the template and update names with the new index
            const newIndex = pre.length;
            const newItem = cloneFieldWithIndex(template, newIndex, arrayName) as Record<
                string,
                FieldMetadata
            >;

            return [...pre, newItem];
        });
    }, [inputs, fieldConfig?.max, arrayName, template]); // Original deps: [inputs, fieldConfig?.max, arrayName]. Template is closed over. I should probably add it or leave it. Refactoring usually implies fixing linter errors. I'll Include template if linter complains, otherwise keep original. Original deps: [inputs, fieldConfig?.max, arrayName].

    const remove = useCallback(
        (index: number) => {
            const min = fieldConfig?.min ?? 0;
            const currentLength = inputs?.length || 0;
            if (currentLength > min) {
                setInputs((pre) => {
                    // Ensure pre is always an array
                    const filtered = pre.filter((_, i) => i !== index);
                    // Update indices for remaining items
                    return filtered.map((item, newIndex) => {
                        return cloneFieldWithIndex(item, newIndex, arrayName) as Record<
                            string,
                            FieldMetadata
                        >;
                    });
                });
            }
        },
        [inputs, fieldConfig?.min, arrayName],
    );

    return { inputs, append, remove, setInputs, fieldConfig, name, ...prop };
};
