# Contexto técnico de form-instant-react-mapping

## 1. Descripción general
Librería para React.js en TypeScript que permite generar campos de formularios de manera automática usando un modelo de datos basado en `Map` de ES6. Su objetivo es mapear tipos de input a componentes React de forma flexible y extensible, facilitando la creación dinámica de formularios.

## 2. Arquitectura y modelo de datos
- El modelo principal es un `new Map()` estándar de ES6, extendido mediante la clase `InputMapping`.
- El mapping es una relación clave-valor donde la clave es el tipo de input y el valor es el componente/render function correspondiente.
- Ejemplo de claves por defecto:
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

## 3. Hooks principales
- **useInputMapping**: Permite acceder y manipular el mapping global de inputs. Expone métodos como `set`, `clear`, y `delete` que actualizan el estado y fuerzan el re-render.
- **useFormInstantField**: Gestiona el estado de un campo individual, permitiendo operaciones como agregar o eliminar instancias del campo según restricciones de longitud/mínimo/máximo.

## 4. Proveedor global
Se recomienda envolver la app con el `FormInstantInputsProvider` para que los hooks funcionen correctamente.

Ejemplo de integración en Next.js:
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

## 5. Ejemplo de uso
Ejemplo de creación de mapping:
```typescript
const inputMapping = new InputMapping({
  text: (props) => <input {...props} />, 
  date: () => <input type="date" />, 
  // ...otros tipos
});
```

Ejemplo de provider:
```typescript
export const { FormInstantInputsProvider, useInputMapping } = createFormInstantContainer(inputMapping);
```

## 6. Punto de entrada principal
El archivo principal de la librería es `src/index.ts`, que reexporta todo desde la carpeta `InputMapping`.

## 7. Instalación
Disponible vía npm o bun:
```bash
npm i @form-instant/react-input-mapping
```

## 8. Personalización y extensibilidad
Puedes extender el mapping agregando nuevas claves y componentes. Los hooks permiten manipular dinámicamente los campos y el mapping.

---
Este archivo resume el contexto técnico y de uso de la librería para desarrolladores y colaboradores. 