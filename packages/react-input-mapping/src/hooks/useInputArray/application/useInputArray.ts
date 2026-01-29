import { useCallback, useState } from 'react';
import type { FieldMetadata } from '../../../InputMapping';
import type { UseInputArrayProps } from '../types';
import { cloneFieldWithIndex } from '../domain/services/cloneFieldWithIndex';

export const useInputArray = (data: FieldMetadata) => {
    const { fieldConfig, name, ...prop } = data as UseInputArrayProps;
    const arrayName = name.history || name.current;
    const template = prop.schema.at(0)!;

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
