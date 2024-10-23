# Install

## input-mapping

<!-- tabs:start -->

#### **npm**

```shell
npm i @form-instant/react-input-mapping
```

#### **bun**

```shell
bun add @form-instant/react-input-mapping
```

<!-- tabs:end -->

## resolvers

<!-- tabs:start -->

#### **zod**

<!-- tabs:start -->

#### **npm**

```shell
npm i @form-instant/react-resolver-zod
```

#### **bun**

```shell
bun add @form-instant/react-resolver-zod
```

<!-- tabs:end -->

<!-- tabs:end -->

# Example

## react

### constructor new InputMapping

#### \* **_new Input Mapping_**

Is the pillar of this set of tools, it consists of an extraction of the native **_new Map_** method in **_javascript_**, which receives as a parameter an object which works as a mapping of the input types, it also accepts two types as a parameter **_P_** are the parameters that each **_input_** component will accept and **_K_** are additional keys that are added to the input glossary.

```typescript
import {
  InputMapping
} from "@form-instant/react-input-mapping";

exprot type extendProps = React.InputHTMLAttributes<HTMLInputElement>;

export type P = Record<
  string,
  ParsedField<extendProps, string>
>;
export type K = "email" | "password" | "date";

export const inputMapping = new InputMapping<P, K>({
  fallback: (props) => {
    const { fieldConfig, ...prop } = props;

    return <input {...prop} {...fieldConfig} />;
  },
  textarea: () => <textarea />,
  number: () => <input type="number" />,
  text: (props) => {
    const { fieldConfig, ...prop } = props;

    return <input {...prop} {...fieldConfig} />;
  },
  date: () => <input type="date" />,
  email: (props) => {
    const { fieldConfig, ...prop } = props;

    return <input {...prop} {...fieldConfig} />;
  },
  password: (props) => {
    const { fieldConfig, ...prop } = props;

    return <input {...prop} {...fieldConfig} />;
  },
});
```

default keys glossary, all values ​​entered by **_k_** will only understand the default listing.

```typescript
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
```

#### \* **_create global provider_**

We created a global provider to be able to access input mapping.

```typescript
import { createFormInstantContainer } from '@form-instant/react-input-mapping';
import { inputMapping, P, K } from './inputMapping.tsx';

export const { FormInstantInputsProvider, useInputMapping } =
  createFormInstantContainer<P, K>(inputMapping);
```

we add our provider in the root of the **_vite_** project "./App.tsx" and **_next.js_** "layout.tsx" in the root.

<!-- tabs:start -->

#### **next.js**

```typescript
import { ReactNode } from "react";
import { FormInstantInputsProvider } from "./components/providers";

function Layout({ children }: { children: ReactNode }) {
  return (
    <FormInstantInputsProvider>
      {children}
    </FormInstantInputsProvider>
  );
}

export default Layout;
```

#### **vite**

```typescript
import "./App.css";
import { Router } from "./router";
import { FormInstantInputsProvider } from "./components/providers";

function App() {
  return (
    <FormInstantInputsProvider>
      <Forms />
    </FormInstantInputsProvider>
  );
}

export default App;
```

<!-- tabs:end -->

#### \* **_use resolver_**

To use our resolver we must instantiate the function to generate the **_fieldConfig_**.

```typescript
import { createFormInstantContainer } from '@form-instant/react-input-mapping';
import { inputMapping, P, K, extendProps } from './inputMapping.tsx';

export const { FormInstantInputsProvider, useInputMapping } =
  createFormInstantContainer<P, K>(inputMapping);

export const fieldConfig = createZodSchemaFieldConfig<extendProps>();
```

#### \* **_build form_**

- schema:

```typescript
import { z } from 'zod';
import { fieldConfig } from './providers';

export const formSchema = z.object({
  security_data: z
    .object({
      email: z
        .string()
        .email()
        .superRefine(
          fieldConfig({
            fieldType: 'email',
            placeholder: 'example@mal.com',
          })
        ),
      password: z.string().superRefine(
        fieldConfig({
          type: 'password',
          placeholder: '******',
        })
      ),
      confirm: z.string(),
    })
    .refine(({ confirm, password }) => confirm !== password, {
      message: 'the confim password is diferent to password',
    }),

  personal_data: z.object({
    last_name: z.string().superRefine(
      fieldConfig({
        placeholder: 'select date',
      })
    ),
    firse_name: z.string(),

    birthday: z.coerce.date().optional(),

    code: z.string(),
  }),
});

export type formSchemaType = Zod.infer<typeof formSchema>;
```

- component

```typescript
import {
  FormInstantElement,
  FormInstantProvider,
} from "@form-instant/react-resolver-zod";
import { z } from "zod";
import { formSchema, formSchemaType } from "./schema";

export const Forms = () => {
  return (
    <form>
      <h1>your form</h1>
      <FormInstantProvider schema={formSchema}>
        <div>
          <FormInstantElement<formSchemaType> name="security_data" />
          <br />
          <FormInstantElement<formSchemaType> name="personal_data" />
        </div>
      </FormInstantProvider>

      <button type="submit">submit</button>
    </form>
  );
};
```
