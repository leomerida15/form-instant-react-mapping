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

export type ExtendProps = React.InputHTMLAttributes<HTMLInputElement>;
export type P = ParsedField<
  ExtendProps,
  string
>;
export type K = "email" | "password";

const inputMapping = new InputMapping<P, K>({
  fallback: (props) => {
    const { fieldConfig, name, ...prop } = props;

    return <input {...prop} {...fieldConfig} />;
  },
  textarea: () => <textarea />,
  number: (props) => {
    const { fieldConfig, name, ...prop } = props;

    return <input {...prop} {...fieldConfig} />;
  },
  text: (props) => {
    const { fieldConfig, name, ...prop } = props;

    return <input {...prop} {...fieldConfig} />;
  },
  date: () => <input type="date" />,
  email: (props) => {
    const { fieldConfig, name, ...prop } = props;

    return <input {...prop} {...fieldConfig} />;
  },
  password: (props) => {
    const { fieldConfig, name, ...prop } = props;

    return <input {...prop} {...fieldConfig} />;
  },
  select: (props) => {
    const { options } = props;

    return (
      <select>
        {options?.map(([k, v]) => (
          <option key={k} value={k}>
            {v}
          </option>
        ))}
      </select>
    );
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

export const { FormInstantInputsProvider, useInputMapping } = createFormInstantContainer<P, K>(
    inputMapping,
);
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

#### **_use resolver_**

To use our resolver we must add the function **_fieldConfig_**.

<!-- tabs:start -->

#### **zod**

generate provider and hook by use resolver.

```typescript
import { createFormInstantContainer } from '@form-instant/react-input-mapping';
import { inputMapping, P, K, extendProps } from './inputMapping.tsx';

export const { FormInstantInputsProvider, useInputMapping } = createFormInstantContainer<P, K>(
    inputMapping,
);
```

add **_fieldConfig_** in the zod schema.

```typescript
import { z } from 'zod';

extendZodWithFieldConfig<React.InputHTMLAttributes<HTMLInputElement>>(z);

export { z };
```

<!-- tabs:end -->

#### \* **_build form_**

- schema:

```typescript
import { z } from 'zod';

const formSchema = z.object({
  data: z.object({
    email: z.string().email(),
    password: z.string(),,
    confirm: z.string(),
  })
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

## **_special inputs_**

### **use-formInstantField**

#### **by object**

```typescript
import { Fragment } from "react";
import { ElementMapping, ParsedField, useFormInstantField } from "@form-instant/react-input-mapping";
import { P } from "@/providers";

export const ObjectComp: FC<P> = (props) => {
  const { fiends, fieldConfig, ...prop } = useFormInstantField<P>(props);
  const id = useId();

  return (
    <div {...{ ...fieldConfig, ...prop }}>
      {fiends.map((prop) => {
        return (
          <Fragment key={`${id}-${prop.name.history}`}>
            <ElementMapping formProps={prop} />
          </Fragment>
        );
      })}
    </div>
  );
};
```

#### **by array**

```typescript
import { Fragment, useId } from "react";
import { ElementMapping, ParsedField, useFormInstantField } from "@form-instant/react-input-mapping";
import { P } from "@/providers";


export const ArrayComp: FC<P> = (props) => {
  const { fiends, fieldConfig, ...prop } = useFormInstantField<P>(props);
  const id = useId();

  return (
    <div {...{ ...fieldConfig, ...prop }}>
      {fiends.map((prop, index) => {
        return (
          <Fragment key={`${id}-${prop.name.history}`}>
            <div>
              <ElementMapping formProps={prop} />
              <button onClick={() => append()}>+</button>
              <button onClick={() => remove(index)}>-</button>
            </div>
            <br />
            <br />
          </Fragment>
        );
      })}
    </div>
  );
};
```

## **_reactive schemas_**

### **fieldConfig**

```typescript
import { Fragment, useId } from "react";
import { ElementMapping, useFormInstantField } from "@form-instant/react-input-mapping";
import { FormInstantElement, FormInstantProvider } from "@form-instant/react-resolver-zod";
import { P } from "@/providers";
import { z } from '@/zod';

const formSchema = z.object({
  data: z.object({
    email: z.string().email().fieldConfig({
      fieldType: "email",
      placeholder: "example@mal.com",
    }),
    password: z.string().fieldConfig({
      fieldType: "password",
      placeholder: "******",
    }),
    confirm: z.string(),
  })
});

export const FromComp = (props) => {

  return (
    <>
      <FormInstantProvider schema={schema}>
        <h1>your form </h1>
        <div>
           <br />
          <FormInstantElement<formSchemaType> name="data" />
        </div>
        <button>
          submit
        </button>
      </FormInstantProvider>
    </>
  );
};
```

### **use-schema**

**useSchema** is a hook, receives two values, a callback and a dependencies object, the callback will be executed when the dependencies change, similar to a useEffect, the callback receives as a parameter the same dependencies object, the callback must always return a valid zod schema..

```typescript
  const [dependencies, setDependencies] = useState({ status: "ok" });

  const { schema } = useSchema((dependencies /* is a dependencies object */) => {
    return formSchema;
  }, dependencies);
```

Example with react-hook-form we must remember that they can use the form hook or form solution that the developer prefers, in this example shows the usage for conditional rendering using the **z.discriminatedUnion** method of **zod**.

When used in **z.discriminatedUnion**, an array of objects is received, where the first object is the input of the discriminant condition and will have the **discriminator** type, with this key or the **fiendType** that you pass in the **fiendConfig** you can capture this value in the mapping.

```typescript
import { Fragment, useId } from "react";
import { ElementMapping, ParsedField, useFormInstantField } from "@form-instant/react-input-mapping";
import { FormInstantElement, FormInstantProvider, useSchema } from "@form-instant/react-resolver-zod";
import { FormInstantInputsProvider, useInputMapping } from "@/resolver";
import { P } from "@/providers";
import { z } from '@/zod';

const formSchema = z.object({
  data: z.discriminatedUnion("status", [
    z.object({
      status: z.literal("ok"),

      code: z.string(),
    }),
    z.object({
      status: z.literal("not"),

      birthday: z.coerce.date(),
    }),
  ]),
});

export const FromComp = (props) => {

  // define state by dependecys
  const [dependencies, setDependencies] = useState({ status: "" });

  const { schema } = useSchema(() => {
    return formSchema;
  }, dependencies);

  const form = useForm<Zod.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      data: {
        status: "ok",
      },
    },
  });

  useEffect(() => {

    /* This way of capturing and formatting form data was
    taken from the useFormValues ​​hook
    recommended by react-hook-form */
    const fromValues = {
      ...form.getValues(),
      ...form.watch(),
    };

    if (
      !dependencies.status ||
      dependencies.status !== fromValues.data.status
    ) {

      setDependencies((prev) => {
        return {
          ...prev,
          status: fromValues.data.status,
        };
      });
    }
  }, [form.watch(), dependencies]);

  const onSubmit = form.handleSubmit(
    (data) => {
      console.log("data", data);
    },
    (err) => {
      console.log("err", err);
    }
  );

  return (
    <form onSubmit={onSubmit}>
      <FormProvider {...form}>
        <FormInstantProvider schema={schema}>
          <h1>your form </h1>
          <div>
             <br />
            <FormInstantElement<formSchemaType> name="data" />
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              const pre = form.getValues("personal_data.status");

              form.setValue(
                "personal_data.status",
                pre === "not" ? "ok" : "not"
              );
            }}
          >
            switch
          </button>
        </FormInstantProvider>
      </FormProvider>
    </form>
  );
};
```

discriminator component example.

```tsx
import { FC } from "react";
import { P } from "@/providers";

const discriminator: FC<P> = (props) => {
  const { options } = props;

  return (
    <select>
      {options?.map(([k, v]) => (
        <option key={k} value={k}>
          {v}
        </option>
      ))}
    </select>
  );
}
```
