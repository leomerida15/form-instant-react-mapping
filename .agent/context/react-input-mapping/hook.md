# Plan: Hook Único para Renderizado Granular en react-input-mapping

## 🎯 Objetivo

Crear un hook único que encapsule toda la solución de renderizado granular para evitar re-renders innecesarios cuando se actualiza el estado global del `InputMapping`.

## 📋 Problema Actual

Cuando se ejecuta `set()`, `clear()`, o `delete()` en el `InputMapping`:
- Se fuerza un `reRender()` global con `useReducer`
- **TODOS** los inputs del formulario se re-renderizan
- Esto es ineficiente, especialmente con formularios grandes y estructuras anidadas profundas

## 🏗️ Arquitectura del Hook Único

### Estructura: `useInputMappingGranular`

```typescript
export function createInputMappingGranularHook<Ob extends Record<string, any>>(
  InputMappingContext: React.Context<InputMapping<Ob> | null>
) {
  // Retorna hooks y utilidades encapsuladas
  return {
    useInputComponent: (fieldType: string) => FC<any> | undefined,
    useInputMappingActions: () => { set, clear, delete },
    // ... otros hooks internos si es necesario
  };
}
```

## 🔧 Componentes del Hook

### 1. Extensión de InputMapping con Subscripciones

**Clase: `InputMappingStore`** (extiende `InputMapping`)

```typescript
class InputMappingStore<Ob> extends InputMapping<Ob> {
  private listeners = new Map<string, Set<() => void>>();
  
  subscribe(key: string, callback: () => void): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(callback);
    return () => this.unsubscribe(key, callback);
  }
  
  unsubscribe(key: string, callback: () => void): void {
    this.listeners.get(key)?.delete(callback);
  }
  
  private notify(key: string): void {
    this.listeners.get(key)?.forEach(cb => cb());
  }
  
  override set(k, v): this {
    const changed = !super.has(k);
    super.set(k, v);
    if (changed) this.notify(String(k));
    return this;
  }
  
  override delete(k): boolean {
    const result = super.delete(k);
    if (result) this.notify(String(k));
    return result;
  }
  
  override clear(): void {
    const keys = Array.from(this.keys()).map(k => String(k));
    super.clear();
    keys.forEach(key => this.notify(key));
  }
}
```

### 2. Hook para Obtención Granular de Componentes

**Hook: `useInputComponent(fieldType: string)`**

```typescript
function useInputComponent(fieldType: string): FC<any> | undefined {
  const store = use(InputMappingContext);
  
  // Suscripción selectiva solo a este fieldType
  return useSyncExternalStore(
    (onStoreChange) => {
      // Suscribirse solo a cambios de este fieldType específico
      return store.subscribe(fieldType, onStoreChange);
    },
    () => {
      // Snapshot: obtener el componente actual
      return store.get(fieldType);
    },
    () => {
      // Server snapshot (SSR)
      return store.get(fieldType);
    }
  );
}
```

**Características:**
- Solo se re-renderiza cuando cambia el componente de ese `fieldType` específico
- No afecta otros componentes con diferentes `fieldType`
- Compatible con React Server Components (SSR)

### 3. Hook para Métodos de Escritura Estables

**Hook: `useInputMappingActions()`**

```typescript
function useInputMappingActions() {
  const store = use(InputMappingContext);
  
  return useMemo(() => ({
    set: (key: keyof Ob | string, value: React.FC<any>) => {
      return store.set(key, value);
      // El store.notify() se ejecuta automáticamente
    },
    clear: () => {
      store.clear();
      // Notifica todas las keys automáticamente
    },
    delete: (key: keyof Ob | string) => {
      return store.delete(key);
      // El store.notify() se ejecuta automáticamente
    },
  }), [store]);
}
```

**Características:**
- Métodos estables (no cambian entre renders)
- No fuerzan re-renders globales
- Solo notifican a los suscriptores específicos

## 📦 Implementación Completa del Hook

### Archivo: `src/hooks/useInputMappingGranular.tsx`

```typescript
import { use, useMemo, useSyncExternalStore } from 'react';
import { InputMapping } from '../InputMapping/class';
import type { FC } from 'react';

// Extensión con subscripciones
class InputMappingStore<Ob extends Record<string, any>> extends InputMapping<Ob> {
  private listeners = new Map<string, Set<() => void>>();
  
  subscribe(key: string, callback: () => void): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(callback);
    return () => this.unsubscribe(key, callback);
  }
  
  unsubscribe(key: string, callback: () => void): void {
    this.listeners.get(key)?.delete(callback);
  }
  
  private notify(key: string): void {
    this.listeners.get(key)?.forEach(cb => cb());
  }
  
  override set(k: keyof Ob | string, v: FC<any>): this {
    const changed = !super.has(k);
    super.set(k, v);
    if (changed) this.notify(String(k));
    return this;
  }
  
  override delete(k: keyof Ob | string): boolean {
    const result = super.delete(k);
    if (result) this.notify(String(k));
    return result;
  }
  
  override clear(): void {
    const keys = Array.from(this.keys()).map(k => String(k));
    super.clear();
    keys.forEach(key => this.notify(key));
  }
}

// Factory function para crear el hook
export function createInputMappingGranularHook<Ob extends Record<string, any>>(
  InputMappingContext: React.Context<InputMapping<Ob> | null>
) {
  // Hook para obtener componente de forma granular
  function useInputComponent(fieldType: string): FC<any> | undefined {
    const store = use(InputMappingContext);
    
    // Asegurar que el store es una instancia de InputMappingStore
    if (!(store instanceof InputMappingStore)) {
      throw new Error('InputMapping must be an instance of InputMappingStore for granular rendering');
    }
    
    return useSyncExternalStore(
      (onStoreChange) => store.subscribe(fieldType, onStoreChange),
      () => store.get(fieldType),
      () => store.get(fieldType)
    );
  }
  
  // Hook para métodos de escritura estables
  function useInputMappingActions() {
    const store = use(InputMappingContext);
    
    if (!(store instanceof InputMappingStore)) {
      throw new Error('InputMapping must be an instance of InputMappingStore for granular rendering');
    }
    
    return useMemo(() => ({
      set: (key: keyof Ob | string, value: React.FC<any>) => {
        return store.set(key, value);
      },
      clear: () => {
        store.clear();
      },
      delete: (key: keyof Ob | string) => {
        return store.delete(key);
      },
    }), [store]);
  }
  
  return {
    useInputComponent,
    useInputMappingActions,
  };
}
```

## 🔄 Migración y Uso

### 1. Actualizar `InputMapping` para usar `InputMappingStore`

```typescript
// En lugar de:
const inputMapping = new InputMapping({...});

// Usar:
const inputMapping = new InputMappingStore({...});
```

### 2. Actualizar `ElementMapping` para usar el hook granular

```typescript
// Antes:
export const ElementMapping: FC<{ formProps: ParsedField<any, string> }> = ({ formProps }) => {
  const InputMapping = use(InputMappingContext);
  const Element = InputMapping.get(formProps.fieldType);
  // ...
};

// Después:
export const ElementMapping: FC<{ formProps: ParsedField<any, string> }> = ({ formProps }) => {
  const { useInputComponent } = createInputMappingGranularHook(InputMappingContext);
  const Element = useInputComponent(formProps.fieldType) || useInputComponent('fallback');
  // ...
};
```

### 3. Memoización de `ElementMapping`

```typescript
export const ElementMapping = React.memo<{ formProps: ParsedField<any, string> }>(
  ({ formProps }) => {
    const { useInputComponent } = createInputMappingGranularHook(InputMappingContext);
    const Element = useInputComponent(formProps.fieldType) || useInputComponent('fallback');
    
    if (!Element) return null;
    
    return createElement(Element, formProps);
  },
  (prevProps, nextProps) => {
    // Solo re-renderizar si cambian estos valores
    return (
      prevProps.formProps.fieldType === nextProps.formProps.fieldType &&
      prevProps.formProps.name.history === nextProps.formProps.name.history &&
      prevProps.formProps.name.current === nextProps.formProps.name.current
    );
  }
);
```

## ✅ Beneficios

1. **Renderizado Granular**: Solo los inputs con el `fieldType` afectado se re-renderizan
2. **Sin Dependencias**: Solo usa APIs nativas de React 19+ (`useSyncExternalStore`)
3. **Escalable**: Funciona bien con formularios grandes y estructuras anidadas profundas
4. **Compatibilidad SSR**: Soporta React Server Components
5. **API Estable**: Métodos de escritura no cambian entre renders
6. **Encapsulado**: Todo en un solo hook, fácil de mantener

## 🎯 Flujo de Renderizado Optimizado

### Antes (Actual):
```
set('text', NewComponent)
  → reRender() global
  → TODOS los inputs se re-renderizan
```

### Después (Optimizado):
```
set('text', NewComponent)
  → store.notify('text')
  → Solo inputs con fieldType='text' se re-renderizan
  → Otros inputs NO se re-renderizan
```

## 📝 Consideraciones

1. **Compatibilidad**: El store debe ser una instancia de `InputMappingStore` para funcionar
2. **Migración**: Los usuarios deben usar `InputMappingStore` en lugar de `InputMapping`
3. **Fallback**: Siempre verificar si existe el componente, usar 'fallback' si no
4. **Keys Estables**: Usar `name.history` como key en listas para evitar re-montajes
5. **Limpieza**: `useSyncExternalStore` maneja el cleanup automáticamente

## 🔍 Estructuras Anidadas

El hook funciona perfectamente con estructuras anidadas profundas porque:

- Cada campo se suscribe solo a su `fieldType` específico
- Los paths anidados (`name.history`) se usan para memoización, no para subscripciones
- Un cambio en `set('text', Component)` solo afecta inputs con `fieldType='text'`, sin importar su profundidad

Ejemplo:
```typescript
{
  user: {
    profile: {
      name: "text",      // Se re-renderiza si set('text', ...)
      age: "number",     // NO se re-renderiza
      address: {
        street: "text",  // Se re-renderiza si set('text', ...)
        zip: "number"    // NO se re-renderiza
      }
    }
  }
}
```

## 🚀 Próximos Pasos

1. Implementar `InputMappingStore` extendiendo `InputMapping`
2. Crear el hook `useInputMappingGranular`
3. Actualizar `ElementMapping` para usar el hook
4. Agregar memoización a `ElementMapping`
5. Actualizar tests si existen
6. Documentar la migración para usuarios
