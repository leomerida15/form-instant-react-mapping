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
  key: string;
  type: string;
  required: boolean;
  default?: any;
  fieldConfig?: FieldConfig<AdditionalRenderable, FieldTypes>;

  // Field-specific
  options?: [string, string][]; // [value, label] for enums
  schema?: ParsedField<AdditionalRenderable, FieldTypes>[]; // For objects and arrays
}

export type FieldConfig<AdditionalRenderable = object, FieldTypes = string> = {
  fieldType?: FieldTypes;
} & AdditionalRenderable;
