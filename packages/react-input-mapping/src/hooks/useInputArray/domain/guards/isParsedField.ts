import type { ParsedField } from '../../../../InputMapping';

/**
 * Type guard to check if a value is a ParsedField
 * @param item - The item to check
 * @returns True if item is a ParsedField
 */
export function isParsedField(item: any): item is ParsedField<any, string> {
    return item && typeof item === 'object' && 'name' in item && 'fieldType' in item;
}
