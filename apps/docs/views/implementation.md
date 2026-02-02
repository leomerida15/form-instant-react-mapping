## Implementation in your project

### 2.1 Creating the Mapping

The **Mapping** is a dictionary that associates each `fieldType` (string) with a React component. You can use `InputMapping` or **`InputMappingStore`** (recommended: better support for granular re-renders).

- **Default keys** (`INPUT_COMPONENTS_KEYS`): `'checkbox' | 'date' | 'select' | 'radio' | 'switch' | 'textarea' | 'number' | 'file' | 'text' | 'fallback'`.
- **Extra keys:** you can extend with your own types (e.g. `email`, `password`, `customSelect`).
- Each component receives **ParsedField**: `name` (`current`, `history`), `fieldType`, `required`, `default`, `fieldConfig`, and for selects/enums `options` as `[value, label][]`.

Minimal example (in a file like `providers/input-mapping.tsx`):

```tsx
import {
  InputMappingStore,
  createFormInstantContainer,
  type ParsedField,
  type FieldConfig,
} from '@form-instant/react-input-mapping';
import type { FC } from 'react';

export type MyInputs = {
  text: FieldConfig<{ placeholder?: string; label?: string }>;
  number: FieldConfig<{ placeholder?: string; label?: string; min?: number; max?: number }>;
  textarea: FieldConfig<{ placeholder?: string; label?: string }>;
  date: FieldConfig;
  email: FieldConfig<{ placeholder?: string; label?: string }>;
  password: FieldConfig<{ placeholder?: string; label?: string }>;
  checkbox: FieldConfig;
  select: FieldConfig;
  fallback: FieldConfig;
};

const TextInput: FC<ParsedField<MyInputs['text']>> = ({ name, fieldConfig, required, ...props }) => (
  <div>
    <label htmlFor={name.current}>{(fieldConfig as any)?.label ?? name.current}{required && ' *'}</label>
    <input id={name.current} name={name.history} type="text" required={required} {...props} />
  </div>
);

// Define the rest: NumberInput, TextareaInput, DateInput, EmailInput, PasswordInput,
// CheckboxInput, SelectInput (uses props.options as [value, label][]), FallbackInput...

export const inputMapping = new InputMappingStore<MyInputs>({
  text: TextInput,
  number: NumberInput,
  textarea: TextareaInput,
  date: DateInput,
  email: EmailInput,
  password: PasswordInput,
  checkbox: CheckboxInput,
  select: SelectInput,
  fallback: FallbackInput,
});

export const { FormInstantInputsProvider, useInputMapping } =
  createFormInstantContainer<MyInputs>(inputMapping);
```

- **Select:** the component receives `options?: [string, string][]`; you can populate them from an API (data fetch) and keep using the same mapping.

### 2.2 Setting up providers

- `createFormInstantContainer<MyInputs>(inputMapping)` returns:
  - **`FormInstantInputsProvider`**: provider that should wrap your app (or at least the area where forms are used).
  - **`useInputMapping`**: hook to access the mapping (e.g. for custom components that use `ElementMapping`).

Place it at the root (e.g. `App.tsx` or `layout.tsx`):

```tsx
import { FormInstantInputsProvider } from './providers/input-mapping';

function App() {
  return (
    <FormInstantInputsProvider>
      {/* routes, forms, etc. */}
    </FormInstantInputsProvider>
  );
}
```

### 2.3 Zod schema and `fieldConfig`

- Define the schema with **Zod**. With **@form-instant/react-resolver-zod** the package already extends Zod with `.fieldConfig()` on the types used by the parser.
- **`.fieldConfig(...)`** is used to specify `fieldType` and extra props (placeholder, label, min, max, etc.) that reach the component via `fieldConfig`.

Example:

```ts
import { z } from 'zod';
// If you use @form-instant/react-resolver-zod, you don't need to call extendZodWithFieldConfig:
// the module applies the extension on import.

const formSchema = z.object({
  name: z.string().min(2).fieldConfig({ fieldType: 'text', placeholder: 'Name', label: 'Name' }),
  email: z.email().fieldConfig({ fieldType: 'email', placeholder: 'email@example.com' }),
  age: z.number().min(18).max(100).fieldConfig({ fieldType: 'number', min: 18, max: 100 }),
  bio: z.string().min(10).fieldConfig({ fieldType: 'textarea' }),
  role: z.enum(['admin', 'user']).fieldConfig({ fieldType: 'select' }),
});

export type FormSchemaType = z.infer<typeof formSchema>;
```

- If you omit `fieldConfig`, the resolver infers `fieldType` from the Zod type (string → text, number → number, etc.).

### 2.4 Rendering forms

- Wrap the form in **`FormInstantProvider`** with the schema. Pass a stable schema reference (e.g. defined outside the component or memoized with `useMemo`) so the provider does not re-parse the schema on every parent re-render.
- Use **`FormInstantElement<FormSchemaType> name="..."`** for each **path** in the schema you want to render:
  - **Primitive field:** `name="name"` → a single input.
  - **Nested object:** `name="personalData"` → all fields of `personalData` are rendered (the provider parses the schema and exposes `field.schema`; `FormInstantElement` iterates and uses `ElementMapping` for each child).

Minimal example:

```tsx
import { FormInstantProvider, FormInstantElement } from '@form-instant/react-resolver-zod';
import { formSchema, type FormSchemaType } from './schema';

export function MyForm() {
  return (
    <form onSubmit={...}>
      <FormInstantProvider schema={formSchema}>
        <FormInstantElement<FormSchemaType> name="name" />
        <FormInstantElement<FormSchemaType> name="email" />
        <FormInstantElement<FormSchemaType> name="age" />
        <FormInstantElement<FormSchemaType> name="bio" />
        <FormInstantElement<FormSchemaType> name="role" />
      </FormInstantProvider>
    </form>
  );
}
```

For **nested objects**, one `FormInstantElement` per object:

```tsx
<FormInstantProvider schema={objectFormSchema}>
  <FormInstantElement<ObjectFormType> name="personalData" />
  <FormInstantElement<ObjectFormType> name="address" />
</FormInstantProvider>
```
