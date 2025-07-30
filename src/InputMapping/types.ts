export type INPUT_COMPONENTS_KEYS =
  | 'checkbox'
  | 'date'
  | 'select'
  | 'radio'
  | 'switch'
  | 'textarea'
  | 'number'
  | 'file'
  | 'text'
  | 'fallback';

export interface ParsedField<AdditionalRenderable, FieldTypes = string> {
  name: { current: string; history: string };
  fieldType: string;
  required: boolean;
  default?: unknown;
  fieldConfig?: FieldConfig<AdditionalRenderable>;

  // Field-specific
  options?: [string, string][]; // [value, label] for enums
  schema?: ParsedField<AdditionalRenderable, FieldTypes>[]; // For objects and arrays
}

export type FieldConfig<AdditionalRenderable = object> = {
  type?: string;
  min?: number;
  max?: number;
} & AdditionalRenderable;

export type ObBase = INPUT_COMPONENTS_KEYS;
