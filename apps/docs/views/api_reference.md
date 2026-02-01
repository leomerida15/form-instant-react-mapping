## API reference (minimal)

| Concept                                                        | Package                          | Description                                                           |
| -------------------------------------------------------------- | -------------------------------- | --------------------------------------------------------------------- |
| `InputMapping` / `InputMappingStore`                       | react-input-mapping              | Maps fieldType → React component.                                    |
| `createFormInstantContainer`                                 | react-input-mapping              | Creates `FormInstantInputsProvider` and `useInputMapping`.        |
| `ParsedField`, `FieldConfig`                               | react-input-mapping              | Props types for mapping components.                                   |
| `ElementMapping`                                             | react-input-mapping              | Renders a single field from `formProps` (fieldType, name, etc.).    |
| `useInputArray`                                              | react-input-mapping              | For arrays:`inputs`, `append`, `remove`, `fieldConfig`.       |
| `FormInstantProvider`, `FormInstantElement`, `useFields` | react-resolver-zod               | Schema provider, element per path, hook for a field.                  |
| `useSchema`                                                  | react-resolver-zod               | Reactive schema (e.g. for `discriminatedUnion`) and initial values. |
| `.fieldConfig(...)`                                          | react-resolver-zod (extends Zod) | Associate `fieldType` and props with a schema field.                |
