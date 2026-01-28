import type { FieldMetadata } from '../../../InputMapping';

/**
 * Props for the useInputArray hook
 */
export interface UseInputArrayProps extends FieldMetadata {
    schema: Record<string, FieldMetadata>[];
    default?: any[];
}
