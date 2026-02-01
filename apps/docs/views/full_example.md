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
