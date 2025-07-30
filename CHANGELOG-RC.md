# Changelog - Release Candidate 1.7.3-rc.1

## 🚀 Nuevas Características

### Mejoras de Tipado

- **Tipado más seguro**: Eliminados todos los usos de `any` y reemplazados por tipos más específicos
- **Contexto genérico**: El contexto ahora es completamente genérico y preserva el tipado de los inputs
- **Hooks mejorados**: `useInputMapping` ahora retorna el tipo correcto sin conversiones inseguras

### Cambios Técnicos

- **InputMapping**: Mejorado el método `extends` para evitar el uso de `as unknown as`
- **Provider**: Refactorizado para usar contexto de React nativo en lugar de `use-context-selector`
- **useFormInstantField**: Corregidas las referencias a propiedades inexistentes (`maxLength`, `minLength`)

## 🔧 Cambios Breaking (Potenciales)

### Para usuarios que usan tipos personalizados:

- El contexto ahora requiere tipado explícito
- Los hooks retornan tipos más específicos

### Para desarrolladores:

- `useInputMappingFactory` renombrado a `createInputMappingHook`
- Eliminadas las non-null assertions (`!`) en favor de verificaciones seguras

## 📦 Instalación

Para probar esta versión RC:

```bash
npm install @form-instant/react-input-mapping@rc
```

O específicamente:

```bash
npm install @form-instant/react-input-mapping@1.7.3-rc.1
```

## ⚠️ Nota Importante

Esta es una versión Release Candidate. Los usuarios que instalen con `npm install @form-instant/react-input-mapping` obtendrán la versión estable anterior (1.7.2).

## 🧪 Testing

Por favor, prueba esta versión RC en tus proyectos y reporta cualquier problema o incompatibilidad.

## 📝 Migración

Si encuentras errores de tipado, asegúrate de:

1. Usar el tipo correcto en `createFormInstantContainer<MyInputs>`
2. Verificar que tus componentes de input tengan el tipado correcto
3. Actualizar cualquier uso de `useInputMappingFactory` a `createInputMappingHook`
