# Contexto Completo - @form-instant/react-input-mapping

## 📋 Resumen del Proyecto

Este proyecto proporciona un sistema de mapeo de componentes de entrada (inputs) para React con tipado TypeScript completo. Permite crear formularios dinámicos con componentes personalizados y tipado seguro.

## 🏗️ Arquitectura Principal

### Core Components

#### 1. `InputMapping<Ob>`

**Ubicación**: `src/InputMapping/class.ts`

**Propósito**: Clase principal que extiende `Map` para mapear tipos de input a componentes React.

**Tipado**:

```typescript
class InputMapping<Ob extends Record<string, any>> extends Map<
    keyof Ob | INPUT_COMPONENTS_KEYS,
    FC<any>
>
```

**Métodos Principales**:

- **`constructor(obj?: Partial<InputComponentMap<Ob>>)`**
    - Inicializa el mapping con un objeto de componentes
    - `obj`: Objeto parcial que mapea claves a componentes React

- **`set<K extends keyof Ob>(k: K, v: FC<Ob[K]>): this`**
    - Establece un componente para una clave específica
    - `k`: Clave del tipo de input
    - `v`: Componente React con props tipadas

- **`get<Ky extends keyof Ob | INPUT_COMPONENTS_KEYS>(k: Ky)`**
    - Obtiene un componente por clave
    - Retorna: `FC<any>` | `undefined`

- **`exists(k: string)`**
    - Verifica si existe un componente para la clave
    - Retorna: `keyof Ob | INPUT_COMPONENTS_KEYS | 'fallback'`

- **`extends<Ext>(cb: (mapping) => Ext)`**
    - Extiende el mapping con nuevos componentes
    - `cb`: Callback que recibe el mapping actual y retorna nuevos componentes

#### 2. `createFormInstantContainer<Ob>`

**Ubicación**: `src/InputMapping/provider.tsx`

**Propósito**: Crea un provider y hook para el contexto de InputMapping.

**Tipado**:

```typescript
function createFormInstantContainer<Ob extends Record<ObBase, any>>(
    inputMapping: InputMapping<Ob>,
): {
    useInputMapping: () => InputMapping<Ob>;
    FormInstantInputsProvider: FC<{ children: ReactNode }>;
};
```

**Retorna**:

- `FormInstantInputsProvider`: Provider de React Context
- `useInputMapping`: Hook personalizado que retorna el InputMapping

#### 3. `createInputMappingHook<Ob>`

**Ubicación**: `src/InputMapping/useInputMapping.tsx`

**Propósito**: Factory que crea un hook personalizado para acceder al InputMapping con re-render automático.

**Tipado**:

```typescript
function createInputMappingHook<Ob extends Record<string, any>>(
    InputMappingContext: React.Context<InputMapping<Ob> | null>,
): () => InputMapping<Ob> & {
    set: (key: keyof Ob | string, value: FC<any>) => InputMapping<Ob>;
    clear: () => void;
    delete: (key: keyof Ob | string) => boolean;
};
```

**Características**:

- Re-render automático cuando se modifican los métodos `set`, `clear`, `delete`
- Mantiene la funcionalidad completa de `InputMapping`
- Tipado seguro para todas las operaciones

## 🎯 Tipos de Datos

### `INPUT_COMPONENTS_KEYS`

**Ubicación**: `src/InputMapping/types.ts`

```typescript
type INPUT_COMPONENTS_KEYS =
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

### `ParsedField<AdditionalRenderable, FieldTypes>`

**Propósito**: Define la estructura de un campo de formulario.

```typescript
interface ParsedField<AdditionalRenderable, FieldTypes = string> {
    name: { current: string; history: string };
    type: string;
    required: boolean;
    default?: unknown;
    fieldConfig?: FieldConfig<AdditionalRenderable, FieldTypes>;
    options?: [string, string][]; // [value, label] for enums
    schema?: ParsedField<AdditionalRenderable, FieldTypes>[];
}
```

### `FieldConfig<AdditionalRenderable, FieldTypes>`

**Propósito**: Configuración adicional para campos de formulario.

```typescript
type FieldConfig<AdditionalRenderable = object, FieldTypes = string> = {
    fieldType?: FieldTypes;
    min?: number;
    max?: number;
} & AdditionalRenderable;
```

## 🔧 Hooks y Utilidades

### `useFormInstantField<P>`

**Ubicación**: `src/InputMapping/useFormInstantField.tsx`

**Propósito**: Hook para manejar campos de formulario con arrays dinámicos.

**Tipado**:

```typescript
function useFormInstantField<P extends ParsedField<unknown, string>>(props: P): {
    fiends: unknown[];
    append: () => void;
    remove: (index: number) => void;
    setFiends: (fiends: unknown[]) => void;
    fieldConfig: P['fieldConfig'];
    name: P['name'];
    ...P;
}
```

**Métodos**:

- `append()`: Agrega un nuevo elemento al array (respetando `max`)
- `remove(index)`: Elimina un elemento del array (respetando `min`)
- `setFiends(fiends)`: Establece el array completo

## 📝 Patrón de Uso Típico

### 1. Definir Tipos de Inputs

```typescript
export type MyInputs = {
    text: { label: string; value: string; onChange: (v: string) => void };
    number: { label: string; value: number; onChange: (v: number) => void };
    checkbox: { label: string; checked: boolean; onChange: (v: boolean) => void };
    // ... más tipos
};
```

### 2. Crear Componentes

```typescript
const TextInput: FC<MyInputs['text']> = ({ label, value, onChange }) => (
    <label>
        {label}
        <input value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
);
```

### 3. Crear InputMapping

```typescript
const inputMapping = new InputMapping<MyInputs>({
    text: TextInput,
    number: NumberInput,
    checkbox: CheckboxInput,
    // ... más componentes
});
```

### 4. Crear Provider y Hook

```typescript
const { FormInstantInputsProvider, useInputMapping } =
    createFormInstantContainer<MyInputs>(inputMapping);
```

### 5. Usar en Componentes

```typescript
const MyForm = () => {
    const mapping = useInputMapping();
    const Text = mapping.get('text') as FC<MyInputs['text']>;

    return (
        <FormInstantInputsProvider>
            {Text && <Text label="Nombre" value="" onChange={() => {}} />}
        </FormInstantInputsProvider>
    );
};
```

## 🔄 Migración desde Versiones Anteriores

### Cambios Breaking en 1.7.3-rc.1

1. **Contexto Genérico**: Ahora requiere tipado explícito

    ```typescript
    // Antes
    const { useInputMapping } = createFormInstantContainer(inputMapping);

    // Ahora
    const { useInputMapping } = createFormInstantContainer<MyInputs>(inputMapping);
    ```

2. **Factory Renombrado**: `useInputMappingFactory` → `createInputMappingHook`

3. **Tipado Más Estricto**: Eliminados usos de `any` en favor de tipos específicos

## 🚀 Características Avanzadas

### Extensión de Mapping

```typescript
const extendedMapping = inputMapping.extends((mapping) => ({
    customInput: CustomComponent,
    anotherInput: AnotherComponent,
}));
```

### Uso con Zod Schemas

```typescript
// El mapping automáticamente mapea tipos Zod a componentes
// ZodBoolean → checkbox
// ZodDate → date
// ZodEnum → select
// etc.
```

## ⚠️ Consideraciones de Rendimiento

- El hook `useInputMapping` re-renderiza automáticamente cuando se modifican los métodos
- Usar `useCallback` para componentes de input para evitar re-renders innecesarios
- El contexto es genérico y no causa re-renders en componentes que no lo usan

## 🧪 Testing

Para probar la versión RC:

```bash
npm install @form-instant/react-input-mapping@rc
```

Para usar la versión estable:

```bash
npm install @form-instant/react-input-mapping
```

## 🔧 Casos de Uso Avanzados

### 1. Formularios Dinámicos con Validación

```typescript
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
    user: z.object({
        name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
        email: z.string().email('Email inválido'),
        age: z.number().min(18, 'Debe ser mayor de edad'),
    }),
});

const DynamicForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const mapping = useInputMapping();

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormInstantElement name="user" />
        </form>
    );
};
```

### 2. Componentes Personalizados con Estilos

```typescript
const StyledTextInput: FC<MyInputs['text']> = ({ label, value, onChange }) => (
    <div className="form-group">
        <label className="form-label">{label}</label>
        <input
            className="form-input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    </div>
);

const StyledNumberInput: FC<MyInputs['number']> = ({ label, value, onChange }) => (
    <div className="form-group">
        <label className="form-label">{label}</label>
        <input
            type="number"
            className="form-input"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
        />
    </div>
);
```

### 3. Integración con UI Libraries

```typescript
// Con Material-UI
const MuiTextInput: FC<MyInputs['text']> = ({ label, value, onChange }) => (
    <TextField
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        variant="outlined"
        fullWidth
    />
);

// Con Chakra UI
const ChakraTextInput: FC<MyInputs['text']> = ({ label, value, onChange }) => (
    <FormControl>
        <FormLabel>{label}</FormLabel>
        <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    </FormControl>
);
```

### 4. Formularios Condicionales

```typescript
const ConditionalForm = () => {
    const [formType, setFormType] = useState<'simple' | 'advanced'>('simple');
    const mapping = useInputMapping();

    const simpleSchema = z.object({
        name: z.string(),
        email: z.string().email(),
    });

    const advancedSchema = z.object({
        name: z.string(),
        email: z.string().email(),
        phone: z.string(),
        address: z.object({
            street: z.string(),
            city: z.string(),
            zipCode: z.string(),
        }),
    });

    const schema = formType === 'simple' ? simpleSchema : advancedSchema;

    return (
        <div>
            <select value={formType} onChange={(e) => setFormType(e.target.value as any)}>
                <option value="simple">Formulario Simple</option>
                <option value="advanced">Formulario Avanzado</option>
            </select>

            <FormInstantProvider schema={schema}>
                <FormInstantElement name="" />
            </FormInstantProvider>
        </div>
    );
};
```

### 5. Arrays Dinámicos con useFormInstantField

```typescript
const DynamicArrayForm = () => {
    const fieldProps = useFormInstantField({
        name: { current: 'items', history: 'items' },
        type: 'array',
        required: true,
        fieldConfig: {
            min: 1,
            max: 5,
        },
        schema: [
            {
                name: { current: 'item', history: 'item' },
                type: 'text',
                required: true,
            },
        ],
    });

    return (
        <div>
            <h3>Items ({fieldProps.fiends.length})</h3>
            {fieldProps.fiends.map((_, index) => (
                <div key={index}>
                    <FormInstantElement name={`items.${index}.item`} />
                    <button onClick={() => fieldProps.remove(index)}>Eliminar</button>
                </div>
            ))}
            <button onClick={fieldProps.append}>Agregar Item</button>
        </div>
    );
};
```

## 🛠️ Integración con Otros Frameworks

### Next.js

```typescript
// app/providers.tsx
'use client';

import { createFormInstantContainer } from '@form-instant/react-input-mapping';
import { inputMapping } from './inputMapping';

const { FormInstantInputsProvider } = createFormInstantContainer(inputMapping);

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <FormInstantInputsProvider>
            {children}
        </FormInstantInputsProvider>
    );
}

// app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
```

### Vite + React

```typescript
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { FormInstantInputsProvider } from './providers';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <FormInstantInputsProvider>
            <App />
        </FormInstantInputsProvider>
    </React.StrictMode>
);
```

### Gatsby

```typescript
// gatsby-browser.js
import React from 'react';
import { FormInstantInputsProvider } from './src/providers';

export const wrapRootElement = ({ element }) => (
    <FormInstantInputsProvider>
        {element}
    </FormInstantInputsProvider>
);
```

## 🔍 Troubleshooting

### Error: "InputMappingContext not found"

**Causa**: El componente no está envuelto en `FormInstantInputsProvider`.

**Solución**:

```typescript
// Asegúrate de que el componente esté dentro del provider
const App = () => (
    <FormInstantInputsProvider>
        <MyForm />
    </FormInstantInputsProvider>
);
```

### Error: "Type 'any' is not assignable to parameter"

**Causa**: Falta tipado explícito en `createFormInstantContainer`.

**Solución**:

```typescript
// Agrega el tipo genérico
const { useInputMapping } = createFormInstantContainer<MyInputs>(inputMapping);
```

### Error: "Property 'maxLength' does not exist"

**Causa**: Uso de propiedades que no existen en `FieldConfig`.

**Solución**:

```typescript
// Usa solo las propiedades disponibles: min, max, fieldType
const fieldConfig = {
    min: 1,
    max: 10,
    fieldType: 'text',
};
```

### Error: "React Hook rules-of-hooks"

**Causa**: Llamada a hooks fuera de componentes React.

**Solución**:

```typescript
// Asegúrate de que los hooks se llamen solo en componentes o hooks personalizados
const MyComponent = () => {
    const mapping = useInputMapping(); // ✅ Correcto
    // ...
};
```

## 📊 Mejores Prácticas

### 1. Organización de Archivos

```
src/
├── components/
│   ├── inputs/
│   │   ├── TextInput.tsx
│   │   ├── NumberInput.tsx
│   │   └── index.ts
│   └── forms/
│       └── MyForm.tsx
├── types/
│   └── inputs.ts
├── providers/
│   └── formProvider.ts
└── hooks/
    └── useFormValidation.ts
```

### 2. Tipado Estricto

```typescript
// ✅ Bueno: Tipado explícito
export type FormInputs = {
    name: { label: string; value: string; onChange: (v: string) => void };
    email: { label: string; value: string; onChange: (v: string) => void };
};

// ❌ Evitar: Uso de any
export type FormInputs = Record<string, any>;
```

### 3. Componentes Reutilizables

```typescript
// ✅ Bueno: Componente genérico
const BaseInput: FC<{ label: string; error?: string }> = ({ label, error, children }) => (
    <div className="form-group">
        <label>{label}</label>
        {children}
        {error && <span className="error">{error}</span>}
    </div>
);

// ✅ Uso
const TextInput: FC<MyInputs['text']> = ({ label, value, onChange }) => (
    <BaseInput label={label}>
        <input value={value} onChange={(e) => onChange(e.target.value)} />
    </BaseInput>
);
```

### 4. Validación Centralizada

```typescript
// hooks/useFormValidation.ts
export const useFormValidation = <T extends Record<string, any>>(schema: z.ZodSchema<T>) => {
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = useCallback(
        (data: T) => {
            try {
                schema.parse(data);
                setErrors({});
                return true;
            } catch (error) {
                if (error instanceof z.ZodError) {
                    const newErrors: Record<string, string> = {};
                    error.errors.forEach((err) => {
                        newErrors[err.path.join('.')] = err.message;
                    });
                    setErrors(newErrors);
                }
                return false;
            }
        },
        [schema],
    );

    return { errors, validate };
};
```

## 🎨 Temas y Estilos

### CSS Modules

```typescript
// components/inputs/TextInput.module.css
.formGroup {
    margin-bottom: 1rem;
}

.label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
}

.input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.error {
    color: #dc3545;
    font-size: 0.875rem;
    margin-top: 0.25rem;
}

// components/inputs/TextInput.tsx
import styles from './TextInput.module.css';

const TextInput: FC<MyInputs['text']> = ({ label, value, onChange, error }) => (
    <div className={styles.formGroup}>
        <label className={styles.label}>{label}</label>
        <input
            className={styles.input}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
        {error && <span className={styles.error}>{error}</span>}
    </div>
);
```

### Styled Components

```typescript
import styled from 'styled-components';

const FormGroup = styled.div`
    margin-bottom: 1rem;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
`;

const Input = styled.input`
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;

    &:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }
`;

const ErrorText = styled.span`
    color: #dc3545;
    font-size: 0.875rem;
    margin-top: 0.25rem;
`;

const TextInput: FC<MyInputs['text']> = ({ label, value, onChange, error }) => (
    <FormGroup>
        <Label>{label}</Label>
        <Input value={value} onChange={(e) => onChange(e.target.value)} />
        {error && <ErrorText>{error}</ErrorText>}
    </FormGroup>
);
```

## 🔒 Seguridad y Validación

### Sanitización de Inputs

```typescript
import DOMPurify from 'dompurify';

const SanitizedTextInput: FC<MyInputs['text']> = ({ label, value, onChange }) => {
    const handleChange = (newValue: string) => {
        const sanitized = DOMPurify.sanitize(newValue);
        onChange(sanitized);
    };

    return (
        <label>
            {label}
            <input value={value} onChange={(e) => handleChange(e.target.value)} />
        </label>
    );
};
```

### Validación en Tiempo Real

```typescript
const ValidatedTextInput: FC<MyInputs['text']> = ({ label, value, onChange }) => {
    const [error, setError] = useState<string>('');

    const handleChange = (newValue: string) => {
        onChange(newValue);

        // Validación en tiempo real
        if (newValue.length < 2) {
            setError('El texto debe tener al menos 2 caracteres');
        } else if (newValue.length > 50) {
            setError('El texto no puede exceder 50 caracteres');
        } else {
            setError('');
        }
    };

    return (
        <div>
            <label>{label}</label>
            <input value={value} onChange={(e) => handleChange(e.target.value)} />
            {error && <span style={{ color: 'red' }}>{error}</span>}
        </div>
    );
};
```

## 📈 Performance Optimization

### Memoización de Componentes

```typescript
const MemoizedTextInput = React.memo<MyInputs['text']>(({ label, value, onChange }) => (
    <label>
        {label}
        <input value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
));

// Usar en el mapping
const inputMapping = new InputMapping<MyInputs>({
    text: MemoizedTextInput,
    // ...
});
```

### Lazy Loading de Componentes

```typescript
const LazyTextInput = React.lazy(() => import('./TextInput'));

const inputMapping = new InputMapping<MyInputs>({
    text: (props) => (
        <React.Suspense fallback={<div>Loading...</div>}>
            <LazyTextInput {...props} />
        </React.Suspense>
    ),
    // ...
});
```

### Debounced Inputs

```typescript
import { useDebouncedCallback } from 'use-debounce';

const DebouncedTextInput: FC<MyInputs['text']> = ({ label, value, onChange }) => {
    const debouncedOnChange = useDebouncedCallback(onChange, 300);

    return (
        <label>
            {label}
            <input
                value={value}
                onChange={(e) => debouncedOnChange(e.target.value)}
            />
        </label>
    );
};
```

## 🌐 Internacionalización (i18n)

### Con react-i18next

```typescript
import { useTranslation } from 'react-i18next';

const LocalizedTextInput: FC<MyInputs['text']> = ({ label, value, onChange }) => {
    const { t } = useTranslation();

    return (
        <label>
            {t(label)}
            <input value={value} onChange={(e) => onChange(e.target.value)} />
        </label>
    );
};

// Uso
const inputMapping = new InputMapping<MyInputs>({
    text: LocalizedTextInput,
    // ...
});
```

## 🧪 Testing

### Jest + React Testing Library

```typescript
// __tests__/TextInput.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { TextInput } from '../components/inputs/TextInput';

describe('TextInput', () => {
    it('renders with label', () => {
        const mockOnChange = jest.fn();
        render(
            <TextInput
                label="Test Label"
                value=""
                onChange={mockOnChange}
            />
        );

        expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    it('calls onChange when input changes', () => {
        const mockOnChange = jest.fn();
        render(
            <TextInput
                label="Test"
                value=""
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'test' } });

        expect(mockOnChange).toHaveBeenCalledWith('test');
    });
});
```

### Testing con Providers

```typescript
// test-utils.tsx
import { render } from '@testing-library/react';
import { FormInstantInputsProvider } from '../providers/formProvider';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return (
        <FormInstantInputsProvider>
            {children}
        </FormInstantInputsProvider>
    );
};

const customRender = (ui: React.ReactElement, options = {}) =>
    render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

## 📦 Build y Deployment

### Configuración de Rollup

```javascript
// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/index.js',
            format: 'cjs',
            sourcemap: true,
        },
        {
            file: 'dist/index.esm.js',
            format: 'esm',
            sourcemap: true,
        },
    ],
    external: ['react', 'react-dom'],
    plugins: [
        resolve(),
        commonjs(),
        typescript({
            tsconfig: './tsconfig.json',
        }),
        terser(),
    ],
};
```

### Bundle Analysis

```bash
# Analizar el tamaño del bundle
npm run analyze

# Ver qué está ocupando espacio
npx webpack-bundle-analyzer dist/stats.json
```

## 🔄 Migración Guiada

### Paso 1: Actualizar Dependencias

```bash
# Instalar la versión RC
npm install @form-instant/react-input-mapping@rc

# O específicamente
npm install @form-instant/react-input-mapping@1.7.3-rc.1
```

### Paso 2: Actualizar Imports

```typescript
// Antes
import { useInputMappingFactory } from '@form-instant/react-input-mapping';

// Después
import { createInputMappingHook } from '@form-instant/react-input-mapping';
```

### Paso 3: Actualizar Tipado

```typescript
// Antes
const { useInputMapping } = createFormInstantContainer(inputMapping);

// Después
const { useInputMapping } = createFormInstantContainer<MyInputs>(inputMapping);
```

### Paso 4: Verificar Componentes

```typescript
// Asegúrate de que tus componentes de input tengan el tipado correcto
const TextInput: FC<MyInputs['text']> = ({ label, value, onChange }) => {
    // Tu implementación
};
```

## 🎯 Roadmap y Futuras Características

### Próximas Versiones

- **v1.8.0**: Soporte para formularios anidados
- **v1.9.0**: Integración con más validadores (Yup, Joi)
- **v2.0.0**: Soporte para formularios multi-paso
- **v2.1.0**: Drag & drop para reordenar campos

### Características Experimentales

```typescript
// Formularios anidados (experimental)
const nestedSchema = z.object({
    user: z.object({
        profile: z.object({
            name: z.string(),
            avatar: z.string(),
        }),
        settings: z.object({
            theme: z.enum(['light', 'dark']),
            notifications: z.boolean(),
        }),
    }),
});
```

## 📞 Soporte y Comunidad

### Recursos Adicionales

- **Documentación**: https://leomerida15.github.io/form-instant-react-mapping
- **GitHub**: https://github.com/leomerida15/form-instant-react-mapping
- **Issues**: https://github.com/leomerida15/form-instant-react-mapping/issues
- **Discussions**: https://github.com/leomerida15/form-instant-react-mapping/discussions

### Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add some amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

### Reportar Bugs

Por favor, incluye:

- Versión de la librería
- Versión de React
- Código de ejemplo reproducible
- Stack trace completo
- Pasos para reproducir

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles.

---

**Nota**: Este documento se actualiza con cada versión. Para la información más reciente, consulta la documentación oficial o el repositorio de GitHub.

# Configuración de TypeScript Avanzada

## tsconfig.json Recomendado

```json
{
    "compilerOptions": {
        "target": "ES2020",
        "lib": ["DOM", "DOM.Iterable", "ES6"],
        "allowJs": true,
        "skipLibCheck": true,
        "esModuleInterop": true,
        "allowSyntheticDefaultImports": true,
        "strict": true,
        "forceConsistentCasingInFileNames": true,
        "noFallthroughCasesInSwitch": true,
        "module": "ESNext",
        "moduleResolution": "node",
        "resolveJsonModule": true,
        "isolatedModules": true,
        "noEmit": true,
        "jsx": "react-jsx",
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "exactOptionalPropertyTypes": true,
        "noImplicitReturns": true,
        "noFallthroughCasesInSwitch": true,
        "noUncheckedIndexedAccess": true
    },
    "include": ["src", "types"],
    "exclude": ["node_modules", "dist"]
}
```

## Tipos Personalizados Avanzados

```typescript
// types/form-utils.ts
import { ParsedField, FieldConfig } from '@form-instant/react-input-mapping';

// Tipo para formularios con validación
export type ValidatedField<T> = ParsedField<{
    validation?: {
        required?: boolean;
        minLength?: number;
        maxLength?: number;
        pattern?: RegExp;
        custom?: (value: T) => string | null;
    };
}>;

// Tipo para campos con dependencias
export type DependentField<T> = ParsedField<{
    dependsOn?: string;
    condition?: (formData: any) => boolean;
    defaultValue?: T;
}>;

// Tipo para campos con transformación
export type TransformableField<T, U> = ParsedField<{
    transform?: {
        input?: (value: T) => U;
        output?: (value: U) => T;
    };
}>;
```

# Debugging Avanzado

## React DevTools Integration

```typescript
// components/DebugProvider.tsx
import { createContext, useContext } from 'react';

interface DebugContextType {
    logFormData: (data: any) => void;
    logValidationErrors: (errors: any) => void;
    logPerformance: (metric: string, value: number) => void;
}

const DebugContext = createContext<DebugContextType | null>(null);

export const useDebug = () => {
    const context = useContext(DebugContext);
    if (!context) {
        throw new Error('useDebug must be used within DebugProvider');
    }
    return context;
};

export const DebugProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const logFormData = useCallback((data: any) => {
        if (process.env.NODE_ENV === 'development') {
            console.group('📝 Form Data');
            console.log(data);
            console.groupEnd();
        }
    }, []);

    const logValidationErrors = useCallback((errors: any) => {
        if (process.env.NODE_ENV === 'development') {
            console.group('❌ Validation Errors');
            console.table(errors);
            console.groupEnd();
        }
    }, []);

    const logPerformance = useCallback((metric: string, value: number) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`⚡ ${metric}: ${value}ms`);
        }
    }, []);

    return (
        <DebugContext.Provider value={{ logFormData, logValidationErrors, logPerformance }}>
            {children}
        </DebugContext.Provider>
    );
};
```

## Performance Monitoring

```typescript
// hooks/usePerformanceMonitor.ts
import { useRef, useCallback } from 'react';

export const usePerformanceMonitor = () => {
    const timers = useRef<Map<string, number>>(new Map());

    const startTimer = useCallback((name: string) => {
        timers.current.set(name, performance.now());
    }, []);

    const endTimer = useCallback((name: string) => {
        const startTime = timers.current.get(name);
        if (startTime) {
            const duration = performance.now() - startTime;
            console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
            timers.current.delete(name);
            return duration;
        }
        return 0;
    }, []);

    const measureRender = useCallback(
        (componentName: string, fn: () => void) => {
            startTimer(`${componentName}-render`);
            fn();
            endTimer(`${componentName}-render`);
        },
        [startTimer, endTimer],
    );

    return { startTimer, endTimer, measureRender };
};
```

# Integración con Herramientas de Desarrollo

## ESLint Configuration

```json
// .eslintrc.json
{
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "plugins": ["@typescript-eslint", "react", "react-hooks"],
    "rules": {
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "react/prop-types": "off",
        "react/react-in-jsx-scope": "off",
        "react-hooks/exhaustive-deps": "warn",
        "@typescript-eslint/no-unused-vars": [
            "error",
            {
                "argsIgnorePattern": "^_",
                "varsIgnorePattern": "^_"
            }
        ]
    },
    "settings": {
        "react": {
            "version": "detect"
        }
    }
}
```

## Prettier Configuration

```json
// .prettierrc
{
    "semi": true,
    "trailingComma": "es5",
    "singleQuote": true,
    "printWidth": 80,
    "tabWidth": 2,
    "useTabs": false,
    "bracketSpacing": true,
    "arrowParens": "avoid",
    "endOfLine": "lf"
}
```

## VSCode Settings

```json
// .vscode/settings.json
{
    "typescript.preferences.importModuleSpecifier": "relative",
    "typescript.suggest.autoImports": true,
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true,
        "source.organizeImports": true
    },
    "typescript.updateImportsOnFileMove.enabled": "always",
    "emmet.includeLanguages": {
        "typescript": "html",
        "typescriptreact": "html"
    }
}
```

# Ejemplos de Producción

## Formulario de Registro Completo

```typescript
// components/RegistrationForm.tsx
import { useState, useCallback } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInstantElement, FormInstantProvider } from '@form-instant/react-input-mapping';

const registrationSchema = z.object({
    personalInfo: z.object({
        firstName: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
        lastName: z.string().min(2, 'Apellido debe tener al menos 2 caracteres'),
        email: z.string().email('Email inválido'),
        phone: z.string().regex(/^\+?[\d\s-()]+$/, 'Teléfono inválido'),
        dateOfBirth: z.string().refine((date) => {
            const age = new Date().getFullYear() - new Date(date).getFullYear();
            return age >= 18;
        }, 'Debe ser mayor de 18 años'),
    }),
    address: z.object({
        street: z.string().min(5, 'Dirección debe tener al menos 5 caracteres'),
        city: z.string().min(2, 'Ciudad debe tener al menos 2 caracteres'),
        state: z.string().min(2, 'Estado debe tener al menos 2 caracteres'),
        zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Código postal inválido'),
        country: z.string().min(2, 'País debe tener al menos 2 caracteres'),
    }),
    preferences: z.object({
        newsletter: z.boolean(),
        notifications: z.boolean(),
        theme: z.enum(['light', 'dark', 'auto']),
        language: z.enum(['es', 'en', 'fr']),
    }),
    terms: z.boolean().refine((val) => val === true, 'Debe aceptar los términos'),
});

type RegistrationForm = z.infer<typeof registrationSchema>;

const RegistrationForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const form = useForm<RegistrationForm>({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            personalInfo: {
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                dateOfBirth: '',
            },
            address: {
                street: '',
                city: '',
                state: '',
                zipCode: '',
                country: '',
            },
            preferences: {
                newsletter: false,
                notifications: true,
                theme: 'auto',
                language: 'es',
            },
            terms: false,
        },
    });

    const onSubmit = useCallback(async (data: RegistrationForm) => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            // Simular llamada a API
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log('Form data submitted:', data);

            // Mostrar mensaje de éxito
            alert('Registro exitoso!');

        } catch (error) {
            setSubmitError('Error al enviar el formulario. Inténtalo de nuevo.');
            console.error('Submit error:', error);
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    return (
        <div className="registration-form">
            <h1>Registro de Usuario</h1>

            <FormInstantProvider schema={registrationSchema}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <section>
                        <h2>Información Personal</h2>
                        <FormInstantElement name="personalInfo" />
                    </section>

                    <section>
                        <h2>Dirección</h2>
                        <FormInstantElement name="address" />
                    </section>

                    <section>
                        <h2>Preferencias</h2>
                        <FormInstantElement name="preferences" />
                    </section>

                    <section>
                        <h2>Términos y Condiciones</h2>
                        <FormInstantElement name="terms" />
                    </section>

                    {submitError && (
                        <div className="error-message">
                            {submitError}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="submit-button"
                    >
                        {isSubmitting ? 'Registrando...' : 'Registrarse'}
                    </button>
                </form>
            </FormInstantProvider>
        </div>
    );
};
```

## Dashboard con Formularios Dinámicos

```typescript
// components/Dashboard.tsx
import { useState, useMemo } from 'react';
import { z } from 'zod';

interface DashboardConfig {
    id: string;
    title: string;
    schema: z.ZodSchema<any>;
    defaultData?: any;
}

const Dashboard = () => {
    const [activeForm, setActiveForm] = useState<string>('profile');
    const [formData, setFormData] = useState<Record<string, any>>({});

    const dashboardConfigs: DashboardConfig[] = useMemo(() => [
        {
            id: 'profile',
            title: 'Perfil de Usuario',
            schema: z.object({
                avatar: z.string().url('URL de avatar inválida'),
                bio: z.string().max(500, 'Biografía no puede exceder 500 caracteres'),
                website: z.string().url('URL inválida').optional(),
                social: z.object({
                    twitter: z.string().optional(),
                    linkedin: z.string().optional(),
                    github: z.string().optional(),
                }),
            }),
            defaultData: {
                avatar: '',
                bio: '',
                website: '',
                social: {
                    twitter: '',
                    linkedin: '',
                    github: '',
                },
            },
        },
        {
            id: 'settings',
            title: 'Configuración',
            schema: z.object({
                notifications: z.object({
                    email: z.boolean(),
                    push: z.boolean(),
                    sms: z.boolean(),
                }),
                privacy: z.object({
                    profileVisibility: z.enum(['public', 'private', 'friends']),
                    showEmail: z.boolean(),
                    showPhone: z.boolean(),
                }),
                security: z.object({
                    twoFactorAuth: z.boolean(),
                    sessionTimeout: z.number().min(5).max(480),
                }),
            }),
            defaultData: {
                notifications: {
                    email: true,
                    push: false,
                    sms: false,
                },
                privacy: {
                    profileVisibility: 'public',
                    showEmail: false,
                    showPhone: false,
                },
                security: {
                    twoFactorAuth: false,
                    sessionTimeout: 30,
                },
            },
        },
        {
            id: 'billing',
            title: 'Facturación',
            schema: z.object({
                plan: z.enum(['free', 'basic', 'pro', 'enterprise']),
                paymentMethod: z.object({
                    type: z.enum(['card', 'paypal', 'bank']),
                    cardNumber: z.string().optional(),
                    expiryDate: z.string().optional(),
                    cvv: z.string().optional(),
                }),
                billingAddress: z.object({
                    name: z.string(),
                    address: z.string(),
                    city: z.string(),
                    country: z.string(),
                    zipCode: z.string(),
                }),
            }),
            defaultData: {
                plan: 'free',
                paymentMethod: {
                    type: 'card',
                    cardNumber: '',
                    expiryDate: '',
                    cvv: '',
                },
                billingAddress: {
                    name: '',
                    address: '',
                    city: '',
                    country: '',
                    zipCode: '',
                },
            },
        },
    ], []);

    const currentConfig = useMemo(() =>
        dashboardConfigs.find(config => config.id === activeForm),
        [dashboardConfigs, activeForm]
    );

    const handleFormSubmit = (data: any) => {
        setFormData(prev => ({
            ...prev,
            [activeForm]: data,
        }));

        console.log(`Form ${activeForm} submitted:`, data);
        alert(`${currentConfig?.title} actualizado exitosamente!`);
    };

    if (!currentConfig) {
        return <div>Formulario no encontrado</div>;
    }

    return (
        <div className="dashboard">
            <nav className="dashboard-nav">
                {dashboardConfigs.map(config => (
                    <button
                        key={config.id}
                        onClick={() => setActiveForm(config.id)}
                        className={`nav-button ${activeForm === config.id ? 'active' : ''}`}
                    >
                        {config.title}
                    </button>
                ))}
            </nav>

            <main className="dashboard-content">
                <h1>{currentConfig.title}</h1>

                <FormInstantProvider schema={currentConfig.schema}>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        // Handle form submission
                    }}>
                        <FormInstantElement name="" />

                        <div className="form-actions">
                            <button type="submit" className="save-button">
                                Guardar Cambios
                            </button>
                            <button type="button" className="reset-button">
                                Restablecer
                            </button>
                        </div>
                    </form>
                </FormInstantProvider>
            </main>
        </div>
    );
};
```

# Guías de Seguridad

## Validación y Sanitización

```typescript
// utils/security.ts
import DOMPurify from 'dompurify';
import { z } from 'zod';

// Esquemas de validación seguros
export const secureStringSchema = z
    .string()
    .min(1, 'Campo requerido')
    .max(1000, 'Texto demasiado largo')
    .transform((val) => DOMPurify.sanitize(val));

export const secureEmailSchema = z
    .string()
    .email('Email inválido')
    .transform((val) => val.toLowerCase().trim());

export const secureUrlSchema = z
    .string()
    .url('URL inválida')
    .refine((url) => {
        const allowedDomains = ['example.com', 'trusted-site.com'];
        const urlObj = new URL(url);
        return allowedDomains.includes(urlObj.hostname);
    }, 'Dominio no permitido');

export const securePhoneSchema = z
    .string()
    .regex(/^\+?[\d\s-()]+$/, 'Teléfono inválido')
    .transform((val) => val.replace(/[^\d+]/g, ''));

// Función de sanitización general
export const sanitizeInput = (input: string): string => {
    return DOMPurify.sanitize(input, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
    });
};

// Validación de archivos
export const secureFileSchema = z
    .object({
        file: z.instanceof(File),
        maxSize: z.number().default(5 * 1024 * 1024), // 5MB
        allowedTypes: z.array(z.string()).default(['image/jpeg', 'image/png', 'image/gif']),
    })
    .refine((data) => {
        return data.file.size <= data.maxSize;
    }, 'Archivo demasiado grande')
    .refine((data) => {
        return data.allowedTypes.includes(data.file.type);
    }, 'Tipo de archivo no permitido');
```

## Componentes Seguros

```typescript
// components/secure/SecureTextInput.tsx
import { useState, useCallback } from 'react';
import { secureStringSchema } from '../../utils/security';

interface SecureTextInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    maxLength?: number;
    required?: boolean;
}

const SecureTextInput: FC<SecureTextInputProps> = ({
    label,
    value,
    onChange,
    maxLength = 1000,
    required = false,
}) => {
    const [error, setError] = useState<string>('');
    const [isValidating, setIsValidating] = useState(false);

    const handleChange = useCallback(async (newValue: string) => {
        setIsValidating(true);
        setError('');

        try {
            const schema = secureStringSchema.max(maxLength);
            if (required) {
                schema.min(1, 'Campo requerido');
            }

            const sanitizedValue = await schema.parseAsync(newValue);
            onChange(sanitizedValue);
        } catch (err) {
            if (err instanceof z.ZodError) {
                setError(err.errors[0].message);
            }
        } finally {
            setIsValidating(false);
        }
    }, [onChange, maxLength, required]);

    return (
        <div className="secure-input">
            <label>
                {label}
                {required && <span className="required">*</span>}
            </label>
            <input
                type="text"
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                maxLength={maxLength}
                className={error ? 'error' : ''}
                disabled={isValidating}
            />
            {error && <span className="error-message">{error}</span>}
            {isValidating && <span className="validating">Validando...</span>}
        </div>
    );
};
```

## Rate Limiting

```typescript
// hooks/useRateLimit.ts
import { useState, useCallback, useRef } from 'react';

interface RateLimitConfig {
    maxAttempts: number;
    timeWindow: number; // en milisegundos
}

export const useRateLimit = (config: RateLimitConfig) => {
    const [isBlocked, setIsBlocked] = useState(false);
    const attempts = useRef<number[]>([]);

    const checkRateLimit = useCallback(() => {
        const now = Date.now();
        const windowStart = now - config.timeWindow;

        // Limpiar intentos antiguos
        attempts.current = attempts.current.filter(time => time > windowStart);

        // Verificar si excede el límite
        if (attempts.current.length >= config.maxAttempts) {
            setIsBlocked(true);
            return false;
        }

        // Agregar nuevo intento
        attempts.current.push(now);
        return true;
    }, [config.maxAttempts, config.timeWindow]);

    const resetRateLimit = useCallback(() => {
        attempts.current = [];
        setIsBlocked(false);
    }, []);

    return { checkRateLimit, resetRateLimit, isBlocked };
};

// Uso en formularios
const SecureForm = () => {
    const { checkRateLimit, isBlocked } = useRateLimit({
        maxAttempts: 5,
        timeWindow: 60000, // 1 minuto
    });

    const handleSubmit = async (data: any) => {
        if (!checkRateLimit()) {
            alert('Demasiados intentos. Inténtalo de nuevo en 1 minuto.');
            return;
        }

        // Procesar formulario
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Campos del formulario */}
            <button type="submit" disabled={isBlocked}>
                {isBlocked ? 'Demasiados intentos' : 'Enviar'}
            </button>
        </form>
    );
};
```

# Monitoreo y Analytics

## Error Tracking

```typescript
// utils/errorTracking.ts
interface ErrorInfo {
    message: string;
    stack?: string;
    componentStack?: string;
    userAgent?: string;
    timestamp: number;
    userId?: string;
    formData?: any;
}

class ErrorTracker {
    private errors: ErrorInfo[] = [];
    private maxErrors = 100;

    trackError(error: Error, componentStack?: string, formData?: any) {
        const errorInfo: ErrorInfo = {
            message: error.message,
            stack: error.stack,
            componentStack,
            userAgent: navigator.userAgent,
            timestamp: Date.now(),
            userId: this.getUserId(),
            formData: this.sanitizeFormData(formData),
        };

        this.errors.push(errorInfo);

        // Mantener solo los últimos errores
        if (this.errors.length > this.maxErrors) {
            this.errors = this.errors.slice(-this.maxErrors);
        }

        // Enviar a servicio de tracking
        this.sendToTrackingService(errorInfo);

        console.error('Error tracked:', errorInfo);
    }

    private getUserId(): string | undefined {
        // Implementar lógica para obtener ID de usuario
        return localStorage.getItem('userId') || undefined;
    }

    private sanitizeFormData(formData: any): any {
        if (!formData) return undefined;

        // Remover datos sensibles
        const sensitiveFields = ['password', 'creditCard', 'ssn', 'token'];
        const sanitized = { ...formData };

        sensitiveFields.forEach((field) => {
            if (sanitized[field]) {
                sanitized[field] = '[REDACTED]';
            }
        });

        return sanitized;
    }

    private sendToTrackingService(errorInfo: ErrorInfo) {
        // Implementar envío a servicio de tracking
        fetch('/api/errors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(errorInfo),
        }).catch(console.error);
    }

    getErrors(): ErrorInfo[] {
        return [...this.errors];
    }

    clearErrors() {
        this.errors = [];
    }
}

export const errorTracker = new ErrorTracker();
```

## Performance Monitoring

```typescript
// hooks/usePerformanceMonitor.ts
import { useEffect, useRef } from 'react';

interface PerformanceMetric {
    name: string;
    duration: number;
    timestamp: number;
    componentName?: string;
}

class PerformanceMonitor {
    private metrics: PerformanceMetric[] = [];
    private observers: Set<(metric: PerformanceMetric) => void> = new Set();

    startMeasure(name: string, componentName?: string): () => void {
        const startTime = performance.now();

        return () => {
            const duration = performance.now() - startTime;
            const metric: PerformanceMetric = {
                name,
                duration,
                timestamp: Date.now(),
                componentName,
            };

            this.metrics.push(metric);
            this.notifyObservers(metric);

            // Log si es lento
            if (duration > 100) {
                console.warn(`Slow operation: ${name} took ${duration.toFixed(2)}ms`);
            }
        };
    }

    measureRender(componentName: string, renderFn: () => void) {
        const endMeasure = this.startMeasure('render', componentName);
        renderFn();
        endMeasure();
    }

    addObserver(observer: (metric: PerformanceMetric) => void) {
        this.observers.add(observer);
    }

    removeObserver(observer: (metric: PerformanceMetric) => void) {
        this.observers.delete(observer);
    }

    private notifyObservers(metric: PerformanceMetric) {
        this.observers.forEach((observer) => observer(metric));
    }

    getMetrics(): PerformanceMetric[] {
        return [...this.metrics];
    }

    getAverageDuration(operationName: string): number {
        const relevantMetrics = this.metrics.filter((m) => m.name === operationName);
        if (relevantMetrics.length === 0) return 0;

        const totalDuration = relevantMetrics.reduce((sum, m) => sum + m.duration, 0);
        return totalDuration / relevantMetrics.length;
    }

    clearMetrics() {
        this.metrics = [];
    }
}

export const performanceMonitor = new PerformanceMonitor();

// Hook para usar en componentes
export const usePerformanceMonitor = (componentName: string) => {
    const componentRef = useRef<{ renderCount: number }>({ renderCount: 0 });

    useEffect(() => {
        componentRef.current.renderCount++;
        const endMeasure = performanceMonitor.startMeasure('component-render', componentName);

        return endMeasure;
    });

    return {
        measureOperation: (name: string, operation: () => void) => {
            const endMeasure = performanceMonitor.startMeasure(name, componentName);
            operation();
            endMeasure();
        },
    };
};
```

---

**Nota**: Este documento se actualiza continuamente. Para la información más reciente, consulta la documentación oficial o el repositorio de GitHub.
