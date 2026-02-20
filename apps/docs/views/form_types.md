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
