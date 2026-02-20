<!-- Documentación empaquetada para consumo por IA. Generado desde README.md + views/*.md -->

## Quick start guide

### 1. Installation and dependency order

Install in this order (or all at once in a monorepo):

1. **React** (peer)

   ```bash
   bun add react react-dom
   # or: npm i react react-dom
   ```
2. **Zod** (for defining schemas)

   ```bash
   bun add zod
   # or: npm i zod
   ```
3. **@form-instant/react-input-mapping** (field → component mapping)

   ```bash
   bun add @form-instant/react-input-mapping
   # or: npm i @form-instant/react-input-mapping
   ```
4. **@form-instant/react-resolver-zod** (resolves Zod schema and provides `FormInstantProvider` / `FormInstantElement`)

   ```bash
   bun add @form-instant/react-resolver-zod
   # or: npm i @form-instant/react-resolver-zod
   ```

   This package has as peers: `react`, `@form-instant/react-input-mapping`, and `zod`. Without the mapping installed first, the resolver cannot resolve fields.

**Summary:** `react` → `zod` → `@form-instant/react-input-mapping` → `@form-instant/react-resolver-zod`.


`<span id="implementation">`

## Implementation in your project

### 2.1 Creating the Mapping

The **Mapping** is a dictionary that associates each `fieldType` (string) with a React component. You can use `InputMapping` or **`InputMappingStore`** (recommended: better support for granular re-renders).

- **Default keys** (`INPUT_COMPONENTS_KEYS`): `'checkbox' | 'date' | 'select' | 'radio' | 'switch' | 'textarea' | 'number' | 'file' | 'text' | 'fallback'`.
- **Extra keys:** you can extend with your own types (e.g. `email`, `password`, `customSelect`).
- Each component receives **ParsedField**: `name` (`current`, `history`), `fieldType`, `required`, `default`, `fieldConfig`, and for selects/enums `options` as `[value, label][]`.
- **Important:** Type your components as `FC<ParsedField<MyInputs['key']>>`, not `FC<FieldConfig<...>>`. At runtime, `ElementMapping` passes a full `ParsedField` object. `FieldConfig` only describes the config shape per field; `ParsedField` is what each component actually receives.

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


`<span id="form-types">`

## Form types

### 3.1 Static form

Flat schema, fixed fields. You only need `FormInstantProvider` plus several `FormInstantElement` (one per field or per object group).

```tsx
const schema = z.object({
  name: z.string().min(2),
  email: z.email(),
  age: z.number().min(18).max(100),
});
// ...
<FormInstantProvider schema={schema}>
  <FormInstantElement<FormType> name="name" />
  <FormInstantElement<FormType> name="email" />
  <FormInstantElement<FormType> name="age" />
</FormInstantProvider>
```

### 3.2 Inputs with data fetch (select / autocomplete)

- **Select:** in the schema use `z.enum([...])` or a type the parser turns into `options`; the mapping component receives `options` and can also receive data loaded from an API (store options in state and pass them via context or props to the component that renders the field).
- **Autocomplete:** you can define your own `fieldType` (e.g. `autocomplete`), map it to a component that uses `useFields` and internally fetches and shows suggestions; the final value is still bound to the same `name`.

The select mapping already uses `options?: [string, string][]`; populating `options` from an API is compatible with the same flow.

### 3.3 Dynamic form with `discriminatedUnion`

Schema that changes based on a discriminator (e.g. user type). Steps:

1. Define the schema with **`z.discriminatedUnion('status', [ z.object({ status: z.literal('ok'), ... }), z.object({ status: z.literal('not'), ... }) ])`**.
2. Use **`useSchema`** from `@form-instant/react-resolver-zod`: it receives a callback that returns the schema and a dependencies object; when the **reference** of the dependencies object changes, the schema and initial values are recalculated. Pass a stable dependencies object (e.g. from state or `useMemo`) to avoid unnecessary recalculations on parent re-renders.
3. Keep **dependencies** in sync with the current discriminator value in the form (e.g. with `form.watch('data.status')` if you use react-hook-form, or your own state).
4. The first field in the union is the discriminator; you can map that field to a select in your mapping (by `fieldType` or by the discriminator key) so the user can switch the variant.

Structure example (submit and form provider depend on your form library):

```tsx
const formSchema = z.object({
  data: z.discriminatedUnion('status', [
    z.object({ status: z.literal('ok'), code: z.string() }),
    z.object({ status: z.literal('not'), birthday: z.coerce.date() }),
  ]),
});

const [dependencies, setDependencies] = useState({ status: 'ok' });
const { schema } = useSchema(() => formSchema, dependencies);

// In a useEffect or in the same flow as the form: when data.status changes,
// update setDependencies({ status: newStatus }) so useSchema returns
// the correct schema and FormInstantElement shows the fields for that variant.

<FormInstantProvider schema={schema}>
  <FormInstantElement<FormType> name="data" />
</FormInstantProvider>
```

### 3.4 Array with dynamic input creation

For **arrays of objects** (e.g. list of items or skills):

1. Schema with **`z.array(z.object({ ... }))`** (optionally `.min()`/`.max()`).
2. In the **array** component:
   - **`useFields({ key: 'items' })`** (or the array field name) to get the parsed field.
   - **`useInputArray(field)`** (from `@form-instant/react-input-mapping`): returns `inputs`, `append`, `remove`, `fieldConfig`, etc.
3. Render each item: for each entry in `inputs`, iterate over properties and use **`ElementMapping formProps={...}`** for each. +/- buttons that call `append()` and `remove(index)`.

Condensed example:

```tsx
const arrayFormSchema = z.object({
  items: z.array(z.object({
    name: z.string().min(2),
    quantity: z.number().min(1),
    price: z.number().min(0),
  })).min(1).max(10),
});

function ArrayFieldComponent({ name }: { name: 'items' }) {
  const field = useFields({ key: name });
  const { inputs, append, remove, fieldConfig } = useInputArray(field);
  const id = useId();

  return (
    <div>
      {inputs.map((inputFields, index) => (
        <div key={`${id}-${index}`}>
          {Object.entries(inputFields).map(([key, value]) => (
            <ElementMapping key={key} formProps={value} />
          ))}
          <button type="button" onClick={() => remove(index)}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={append}>+ Add</button>
    </div>
  );
}

<FormInstantProvider schema={arrayFormSchema}>
  <ArrayFieldComponent name="items" />
</FormInstantProvider>
```

`fieldConfig?.min` / `fieldConfig?.max` can come from the schema (e.g. via `.fieldConfig({ min: 1, max: 10 })`) to disable buttons based on limits.

### 3.5 Nested object

Schema with **`z.object({ group: z.object({ a: z.string(), b: z.number() }) })`**. No custom component needed: a single **`FormInstantElement<FormType> name="group"`** makes the resolver render all fields of `group` (the parser fills `field.schema` and `FormInstantElement` walks those children with `ElementMapping`).

```tsx
const objectFormSchema = z.object({
  personalData: z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
  }),
  address: z.object({
    street: z.string(),
    city: z.string(),
    zipCode: z.string(),
  }),
});

<FormInstantProvider schema={objectFormSchema}>
  <FormInstantElement<ObjectFormType> name="personalData" />
  <FormInstantElement<ObjectFormType> name="address" />
</FormInstantProvider>
```


`<span id="full-example">`

## Full example: React Hook Form + Shadcn UI + Zod

This example wires **react-hook-form**, **@hookform/resolvers** (Zod resolver), **Zod**, and **shadcn/ui** (or any similar UI primitives) with Form Instant. Validation runs via `zodResolver`; inputs are rendered from your schema and mapping.

### Dependencies

```bash
bun add react-hook-form @hookform/resolvers zod
# or: npm i react-hook-form @hookform/resolvers zod
```

Add **shadcn/ui** with your stack (e.g. `npx shadcn@latest init`) and install the components you need (e.g. `Input`, `Label`, `Button`). You can also use plain HTML elements or your own design system.

### 1. Zod schema

```ts
// lib/schemas/profile.ts
import { z } from 'zod';

export const profileSchema = z.object({
  username: z.string().min(2, 'At least 2 characters').fieldConfig({ fieldType: 'text', placeholder: 'Username', label: 'Username' }),
  email: z.string().email('Invalid email').fieldConfig({ fieldType: 'email', placeholder: 'you@example.com', label: 'Email' }),
  age: z.number().min(18, 'Must be 18+').max(120).fieldConfig({ fieldType: 'number', label: 'Age', min: 18, max: 120 }),
  bio: z.string().min(10, 'At least 10 characters').fieldConfig({ fieldType: 'textarea', label: 'Bio', placeholder: 'Tell us about yourself' }),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
```

### 2. Input mapping (with react-hook-form registration)

Type each mapping component as `FC<ParsedField<MyInputs['key']>>`—they receive a full `ParsedField`, not `FieldConfig` alone.

For react-hook-form to validate and submit correctly, each rendered input must be **registered**. Use `useFormContext()` inside your mapping components and spread `register(name.history)` (and optionally show errors from `formState.errors`).

```tsx
// components/input-mapping.tsx
import {
  InputMappingStore,
  createFormInstantContainer,
  type ParsedField,
  type FieldConfig,
} from '@form-instant/react-input-mapping';
import { useFormContext } from 'react-hook-form';
import type { FC } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export type MyInputs = {
  text: FieldConfig<{ placeholder?: string; label?: string }>;
  number: FieldConfig<{ placeholder?: string; label?: string; min?: number; max?: number }>;
  textarea: FieldConfig<{ placeholder?: string; label?: string }>;
  email: FieldConfig<{ placeholder?: string; label?: string }>;
  fallback: FieldConfig;
};

const TextInput: FC<ParsedField<MyInputs['text']>> = ({ name, fieldConfig, required, ...props }) => {
  const { register, formState: { errors } } = useFormContext();
  const label = (fieldConfig as any)?.label ?? name.current;
  const placeholder = (fieldConfig as any)?.placeholder ?? '';

  return (
    <div className="space-y-2">
      <Label htmlFor={name.current}>{label}{required && ' *'}</Label>
      <Input
        id={name.current}
        type="text"
        placeholder={placeholder}
        aria-invalid={!!errors[name.history]}
        {...register(name.history)}
        {...props}
      />
      {errors[name.history]?.message && (
        <p className="text-sm text-destructive">{String(errors[name.history]?.message)}</p>
      )}
    </div>
  );
};

const NumberInput: FC<ParsedField<MyInputs['number']>> = ({ name, fieldConfig, required, ...props }) => {
  const { register, formState: { errors } } = useFormContext();
  const label = (fieldConfig as any)?.label ?? name.current;

  return (
    <div className="space-y-2">
      <Label htmlFor={name.current}>{label}{required && ' *'}</Label>
      <Input
        id={name.current}
        type="number"
        min={fieldConfig?.min}
        max={fieldConfig?.max}
        aria-invalid={!!errors[name.history]}
        {...register(name.history, { valueAsNumber: true })}
        {...props}
      />
      {errors[name.history]?.message && (
        <p className="text-sm text-destructive">{String(errors[name.history]?.message)}</p>
      )}
    </div>
  );
};

const TextareaInput: FC<ParsedField<MyInputs['textarea']>> = ({ name, fieldConfig, required, ...props }) => {
  const { register, formState: { errors } } = useFormContext();
  const label = (fieldConfig as any)?.label ?? name.current;
  const placeholder = (fieldConfig as any)?.placeholder ?? '';

  return (
    <div className="space-y-2">
      <Label htmlFor={name.current}>{label}{required && ' *'}</Label>
      <Textarea
        id={name.current}
        placeholder={placeholder}
        aria-invalid={!!errors[name.history]}
        {...register(name.history)}
        {...props}
      />
      {errors[name.history]?.message && (
        <p className="text-sm text-destructive">{String(errors[name.history]?.message)}</p>
      )}
    </div>
  );
};

const EmailInput: FC<ParsedField<MyInputs['email']>> = ({ name, fieldConfig, required, ...props }) => {
  const { register, formState: { errors } } = useFormContext();
  const label = (fieldConfig as any)?.label ?? name.current;
  const placeholder = (fieldConfig as any)?.placeholder ?? '';

  return (
    <div className="space-y-2">
      <Label htmlFor={name.current}>{label}{required && ' *'}</Label>
      <Input
        id={name.current}
        type="email"
        placeholder={placeholder}
        aria-invalid={!!errors[name.history]}
        {...register(name.history)}
        {...props}
      />
      {errors[name.history]?.message && (
        <p className="text-sm text-destructive">{String(errors[name.history]?.message)}</p>
      )}
    </div>
  );
};

const FallbackInput: FC<ParsedField<MyInputs['fallback']>> = ({ name, fieldConfig, required, ...props }) => {
  const { register, formState: { errors } } = useFormContext();
  const label = (fieldConfig as any)?.label ?? name.current;

  return (
    <div className="space-y-2">
      <Label htmlFor={name.current}>{label}{required && ' *'}</Label>
      <Input
        id={name.current}
        type="text"
        aria-invalid={!!errors[name.history]}
        {...register(name.history)}
        {...props}
      />
      {errors[name.history]?.message && (
        <p className="text-sm text-destructive">{String(errors[name.history]?.message)}</p>
      )}
    </div>
  );
};

export const inputMapping = new InputMappingStore<MyInputs>({
  text: TextInput,
  number: NumberInput,
  textarea: TextareaInput,
  email: EmailInput,
  fallback: FallbackInput,
});

export const { FormInstantInputsProvider, useInputMapping } =
  createFormInstantContainer<MyInputs>(inputMapping);
```

### 3. Form component

Use **FormProvider** from react-hook-form, **zodResolver** with your schema, and **FormInstantProvider** + **FormInstantElement** so fields are rendered from the schema and your mapping.

```tsx
// components/profile-form.tsx
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInstantProvider, FormInstantElement } from '@form-instant/react-resolver-zod';
import { profileSchema, type ProfileFormValues } from '@/lib/schemas/profile';
import { Button } from '@/components/ui/button';

export function ProfileForm() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: '',
      email: '',
      age: undefined,
      bio: '',
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    console.log(data);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormInstantProvider schema={profileSchema}>
          <FormInstantElement<ProfileFormValues> name="username" />
          <FormInstantElement<ProfileFormValues> name="email" />
          <FormInstantElement<ProfileFormValues> name="age" />
          <FormInstantElement<ProfileFormValues> name="bio" />
        </FormInstantProvider>
        <Button type="submit">Submit</Button>
      </form>
    </FormProvider>
  );
}
```

### 4. App root

Ensure **FormInstantInputsProvider** wraps the tree where forms use the mapping (e.g. root layout or App).

```tsx
// App.tsx
import { FormInstantInputsProvider } from '@/components/input-mapping';
import { ProfileForm } from '@/components/profile-form';

export default function App() {
  return (
    <FormInstantInputsProvider>
      <ProfileForm />
    </FormInstantInputsProvider>
  );
}
```

**Summary:** Use **Zod** for the schema, **zodResolver** in `useForm`, **FormProvider** (react-hook-form) around the form, and **FormInstantProvider** + **FormInstantElement** to render fields from the schema. In your mapping components, call **useFormContext()** and **register(name.history)** (and optionally **formState.errors**) so react-hook-form controls and validates the inputs.


`<span id="api-reference">`

## API reference (minimal)

| Concept                                                        | Package                          | Description                                                           |
| -------------------------------------------------------------- | -------------------------------- | --------------------------------------------------------------------- |
| `InputMapping` / `InputMappingStore`                       | react-input-mapping              | Maps fieldType → React component.                                    |
| `createFormInstantContainer`                                 | react-input-mapping              | Creates `FormInstantInputsProvider` and `useInputMapping`.        |
| `ParsedField`, `FieldConfig`                               | react-input-mapping              | Props types for mapping components.                                   |
| `ElementMapping`                                             | react-input-mapping              | Renders a single field from `formProps` (fieldType, name, etc.).    |
| `useInputArray`                                              | react-input-mapping              | For arrays:`inputs`, `append`, `remove`, `fieldConfig`.       |
| `FormInstantProvider`, `FormInstantElement`, `useFields` | react-resolver-zod               | Schema provider, element per path, hook for a field.                  |
| `useSchema`                                                  | react-resolver-zod               | Reactive schema (e.g. for `discriminatedUnion`) and initial values. Recalculates when the **reference** of the dependencies object changes; pass a stable object to avoid unnecessary recalculations. |
| `.fieldConfig(...)`                                          | react-resolver-zod (extends Zod) | Associate `fieldType` and props with a schema field.                |

