# Context - Plan de Desarrollo y Documentación del Proyecto

Esta carpeta contiene toda la documentación y contexto necesario para el desarrollo del proyecto `@form-instant/react-resolver-zod`.

## Estructura de Documentos

### 📋 Planificación

- `development-plan.md` - Plan de desarrollo detallado
- `roadmap.md` - Hoja de ruta del proyecto
- `milestones.md` - Hitos y objetivos

### 🏗️ Arquitectura

- `architecture.md` - Arquitectura del sistema
- `api-design.md` - Diseño de la API
- `component-structure.md` - Estructura de componentes

### 📚 Documentación Técnica

- `technical-specs.md` - Especificaciones técnicas
- `integration-guide.md` - Guía de integración
- `migration-guide.md` - Guía de migración

### 🧪 Testing y Calidad

- `testing-strategy.md` - Estrategia de testing
- `quality-guidelines.md` - Guías de calidad

### 📦 Gestión de Versiones

- `versioning-strategy.md` - Estrategia de versionado
- `changelog-template.md` - Plantilla de changelog

### 🔧 Configuración y Herramientas

- `build-config.md` - Configuración de build
- `deployment-guide.md` - Guía de despliegue

## Propósito del Proyecto

`@form-instant/react-resolver-zod` es una librería React **agnóstica a hooks de formulario** que se enfoca únicamente en hacer **match entre esquemas Zod y el mapping de componentes**. La librería proporciona una capa de abstracción que conecta la definición de esquemas con la renderización de componentes, dejando la validación y gestión del estado del formulario como responsabilidad del desarrollador.

## Tecnologías Principales

- **React 19+** - Framework principal
- **Zod 4.x** - Validación de esquemas (versión actualizada)
- **TypeScript** - Tipado estático
- **@form-instant/react-input-mapping** - Mapeo de inputs
- **Bun.js** - Runtime, bundler y package manager

## Decisiones Técnicas Importantes

### 🎯 Arquitectura Agnóstica

- **Sin hooks de formulario**: No incluye gestión de estado de formularios
- **Sin validación automática**: La validación es responsabilidad del desarrollador
- **Enfoque en mapping**: Solo conecta esquemas Zod con componentes
- **Flexibilidad total**: Compatible con cualquier librería de formularios

### 🚀 Migración a Bun.js

- **Runtime**: Bun.js como runtime principal
- **Bundler**: Migración de dts-cli a Bun.js
- **Package Manager**: Bun.js para gestión de dependencias
- **Testing**: Bun.js test runner

### 📋 Zod v4

- **Versión**: Actualización a Zod 4.x
- **Compatibilidad**: Mantener compatibilidad con versiones anteriores
- **Features**: Aprovechar nuevas funcionalidades de Zod 4

### 🔑 Navegación de Esquemas

- **Keys con puntos**: Soporte para navegación en estructura interna
- **Ejemplo**: `user.profile.email` para acceder a esquemas anidados
- **Type Safety**: Inferencia automática de tipos para rutas anidadas

### ⚡ Build Optimizado

- **Bundle size mínimo**: Enfoque en crear el build más ligero posible
- **Tree shaking**: Optimización para eliminar código no utilizado
- **Code splitting**: Carga diferida de funcionalidades avanzadas
- **Sin overhead**: Sin opciones de runtime innecesarias

## Estado Actual

- Versión: 1.8.4
- Estado: En desarrollo activo
- Dependencias principales actualizadas
- Estructura base implementada
- Migración a Bun.js en progreso

## Código Legacy

### 📁 Directorio `old/`

Todo el código anterior y legacy del proyecto se encuentra en el directorio `old/`. Este directorio contiene:

- **Código anterior**: Implementaciones previas de la librería
- **Hooks legacy**: Versiones anteriores de hooks de formulario
- **Componentes antiguos**: Componentes que ya no se utilizan
- **Utilidades deprecated**: Funciones y utilidades obsoletas
- **Tests legacy**: Tests de versiones anteriores

### 🔄 Propósito del Código Legacy

El código en `old/` se mantiene para:

1. **Referencia histórica**: Entender la evolución del proyecto
2. **Migración gradual**: Facilitar la migración de funcionalidades útiles
3. **Rollback**: Posibilidad de revertir cambios si es necesario
4. **Análisis**: Estudiar patrones y decisiones de diseño anteriores

### 📋 Contenido del Directorio `old/`

```
old/
├── Element/           # Componentes de elementos de formulario
├── context.tsx       # Context provider legacy
├── funcs/            # Funciones utilitarias antiguas
├── index.ts          # Punto de entrada legacy
├── provider.tsx      # Provider component legacy
├── type.ts           # Definiciones de tipos antiguas
└── useSchema.tsx     # Hook de esquema legacy
```

### ⚠️ Nota Importante

**El código en `old/` NO debe ser utilizado en nuevas implementaciones.** Solo sirve como referencia y para migración gradual. La nueva arquitectura agnóstica y optimizada se desarrolla en el directorio `src/`.
