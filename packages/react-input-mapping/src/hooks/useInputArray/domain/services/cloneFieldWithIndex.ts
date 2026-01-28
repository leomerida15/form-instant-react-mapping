import type { FieldMetadata, ParsedField } from '../../../../InputMapping';
import { isParsedField } from '../guards/isParsedField';

/**
 * Helper function to deep clone a ParsedField and update names with new index
 * @param field - The field to clone
 * @param newIndex - The new index to apply
 * @param arrayName - The name of the array
 * @returns The cloned field or record of fields with updated index
 */
export function cloneFieldWithIndex(
    field:
        | ParsedField<any, string>
        | Record<string, ParsedField<any, string>>
        | FieldMetadata
        | Record<string, FieldMetadata>,
    newIndex: number,
    arrayName: string,
): ParsedField<any, string> | Record<string, ParsedField<any, string>> {
    // Handle Record<string, ParsedField>
    if (!isParsedField(field)) {
        const newStructure: Record<string, ParsedField<any, string>> = {};
        for (const key in field) {
            const val = (field as any)[key];
            if (!val) continue;
            // Recursive call - result is ParsedField because val is ParsedField
            // (assuming structure is Record<string, ParsedField>)
            newStructure[key] = cloneFieldWithIndex(val, newIndex, arrayName) as ParsedField<
                any,
                string
            >;
        }
        return newStructure;
    }

    // Handle ParsedField
    // Extract the field name from the current history (e.g., "items.0.name" -> "name")
    const fieldName = field.name.current;
    const newHistory = `${arrayName}.${newIndex}.${fieldName}`;

    const cloned = {
        ...field,
        name: {
            current: fieldName,
            history: newHistory,
        },
    } as ParsedField<any, string>;

    if (field.schema && Array.isArray(field.schema)) {
        cloned.schema = field.schema.map((subField) =>
            cloneFieldWithIndex(subField as ParsedField<any, string>, newIndex, arrayName),
        );
    }

    return cloned;
}
