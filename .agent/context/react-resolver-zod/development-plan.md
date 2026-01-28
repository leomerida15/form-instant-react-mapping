# Plan de Desarrollo - @form-instant/react-resolver-zod

## Resumen Ejecutivo

Este documento define el plan de desarrollo para la librería `@form-instant/react-resolver-zod`, una integración React **agnóstica a hooks de formulario** que se enfoca únicamente en hacer **match entre esquemas Zod y el mapping de componentes**. La librería proporciona una capa de abstracción pura que conecta la definición de esquemas con la renderización de componentes, migrando a Bun.js como runtime y bundler principal, con el objetivo de crear el build más ligero posible.

## Estado Actual del Proyecto

### ✅ Completado

- Configuración base del proyecto
- Dependencias principales configuradas
- Estructura de archivos establecida
- Configuración de build y testing
- **Código legacy preservado en directorio `old/`**

### 🔄 En Progreso

- Migración del código legacy a la nueva estructura
- Implementación de la API principal
- Documentación técnica
- **Migración de dts-cli a Bun.js**
- **Actualización a Zod v4**

### 📋 Pendiente

- Tests unitarios completos
- Documentación de uso
- Ejemplos de integración
- Optimizaciones de performance
- **Implementación de keys con puntos para navegación de esquemas**
- **Configuración de Bun.js test runner**

## Código Legacy y Migración

### 📁 Directorio `old/`

Todo el código anterior del proyecto se encuentra en el directorio `old/`:

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

### 🔄 Estrategia de Migración

#### Fase 1: Análisis del Código Legacy

- [x] Preservar código anterior en `old/`
- [ ] Analizar funcionalidades útiles del código legacy
- [ ] Identificar patrones de diseño a migrar
- [ ] Documentar diferencias arquitectónicas

#### Fase 2: Migración Selectiva

- [ ] Migrar solo funcionalidades esenciales
- [ ] Adaptar a nueva arquitectura agnóstica
- [ ] Eliminar dependencias innecesarias
- [ ] Optimizar para bundle size mínimo

#### Fase 3: Limpieza

- [ ] Remover código legacy no migrado
- [ ] Actualizar documentación
- [ ] Validar nueva implementación
- [ ] Eliminar directorio `old/` (futuro)

### ⚠️ Notas Importantes

- **El código en `old/` NO debe ser utilizado en nuevas implementaciones**
- **Solo sirve como referencia para migración gradual**
- **La nueva arquitectura se desarrolla completamente en `src/`**
- **Mantener compatibilidad hacia atrás durante la transición**

## Objetivos de Desarrollo

### Objetivo Principal

Crear una librería React **agnóstica a hooks de formulario** que permita hacer **match entre esquemas Zod y el mapping de componentes**, proporcionando una capa de abstracción pura que conecte la definición de esquemas con la renderización de componentes, utilizando Bun.js como runtime moderno y creando el build más ligero posible.

### Objetivos Específicos

1. **API Simple y Enfocada**: Proporcionar una API que solo se enfoque en mapping de esquemas a componentes
2. **Type Safety**: Garantizar tipado completo con TypeScript
3. **Performance**: Optimizar el rendimiento para esquemas complejos
4. **Compatibilidad**: Mantener compatibilidad con React 19+
5. **Documentación**: Proporcionar documentación completa y ejemplos
6. **Bun.js Integration**: Migrar completamente a Bun.js como runtime
7. **Zod v4 Features**: Aprovechar las nuevas funcionalidades de Zod 4
8. **Schema Navigation**: Implementar navegación de esquemas con keys con puntos
9. **Agnostic Design**: No incluir gestión de estado de formularios ni validación automática
10. **Bundle Size**: Crear el build más ligero posible sin overhead innecesario
11. **Legacy Migration**: Migrar funcionalidades útiles del código legacy

## Fases de Desarrollo

### Fase 1: Fundación y Migración (Semana 1-2)

- [ ] Analizar código legacy en `old/`
- [ ] Migrar código legacy a nueva estructura
- [ ] **Migrar de dts-cli a Bun.js**
- [ ] **Actualizar a Zod v4**
- [ ] Implementar API básica de mapping
- [ ] Configurar tests unitarios
- [ ] Documentar API básica

### Fase 2: Core Features (Semana 3-4)

- [ ] Implementar mapping de esquemas Zod a componentes
- [ ] Crear utilidades de navegación de esquemas
- [ ] Desarrollar componentes de mapping base
- [ ] **Implementar navegación de esquemas con keys con puntos**
- [ ] Tests de integración

### Fase 3: Optimización (Semana 5-6)

- [ ] Optimizar performance del mapping
- [ ] Implementar memoización de esquemas
- [ ] Reducir bundle size al mínimo
- [ ] **Optimizar build para máxima ligereza**
- [ ] Tests de performance

### Fase 4: Documentación y Release (Semana 7-8)

- [ ] Documentación completa
- [ ] Ejemplos de integración con diferentes librerías de formularios
- [ ] Guías de migración
- [ ] **Guías de integración agnóstica**
- [ ] Release v2.0.0

## Migración Técnica

### Migración a Bun.js

#### Objetivos

- Reemplazar dts-cli con Bun.js como bundler
- Utilizar Bun.js como runtime principal
- Migrar tests a Bun.js test runner
- Optimizar para el ecosistema Bun.js

#### Tareas

- [ ] Configurar `bunfig.toml` para build
- [ ] Migrar scripts de package.json
- [ ] Configurar Bun.js test runner
- [ ] Optimizar bundle para máxima ligereza
- [ ] Actualizar CI/CD para Bun.js

### Actualización a Zod v4

#### Objetivos

- Migrar a Zod 4.x
- Aprovechar nuevas funcionalidades
- Mantener compatibilidad hacia atrás
- Optimizar performance

#### Tareas

- [ ] Actualizar dependencias de Zod
- [ ] Revisar breaking changes
- [ ] Implementar nuevas features
- [ ] Actualizar tipos TypeScript
- [ ] Migrar tests existentes

### Navegación de Esquemas con Keys con Puntos

#### Objetivos

- Permitir navegación en estructura interna de esquemas
- Mantener type safety para rutas anidadas
- Optimizar performance para esquemas complejos
- Proporcionar API intuitiva para mapping

#### Implementación

```typescript
// Ejemplo de uso - Solo mapping, sin gestión de estado
const schema = z.object({
    user: z.object({
        profile: z.object({
            email: z.string().email(),
            name: z.string(),
        }),
    }),
});

// Mapping de esquemas a componentes
const componentMapping = {
    'user.profile.email': EmailInput,
    'user.profile.name': TextInput,
};

// Navegación de esquemas para mapping
const emailSchema = getFieldSchema('user.profile.email');
const nameSchema = getFieldSchema('user.profile.name');
```

## Arquitectura Agnóstica

### Principios de Diseño

1. **Sin Gestión de Estado**: No maneja estado de formularios
2. **Sin Validación Automática**: La validación es responsabilidad del desarrollador
3. **Solo Mapping**: Conecta esquemas Zod con componentes
4. **Flexibilidad Total**: Compatible con cualquier librería de formularios
5. **Build Mínimo**: Sin overhead de opciones de runtime innecesarias

### Compatibilidad con Librerías de Formularios

```typescript
// Compatible con React Hook Form
const { register } = useForm();
const schemaMapping = createSchemaMapping(schema);

// Compatible con Formik
const { values, setFieldValue } = useFormik();
const schemaMapping = createSchemaMapping(schema);

// Compatible con cualquier librería personalizada
const customFormState = useCustomForm();
const schemaMapping = createSchemaMapping(schema);
```

## Métricas de Éxito

### Técnicas

- Bundle size < 5KB (objetivo: el más ligero posible)
- Test coverage > 90%
- Zero critical bugs
- TypeScript strict mode compliance
- **Bun.js compatibility: 100%**
- **Zod v4 feature utilization: >80%**
- **Mapping performance: <5ms por esquema**

### Usuario

- API simple y enfocada
- Documentación clara y completa
- Ejemplos prácticos de integración
- Soporte activo
- **Flexibilidad total con librerías de formularios**
- **Sin overhead de gestión de estado**
- **Bundle size mínimo**

## Riesgos y Mitigaciones

### Riesgos Identificados

1. **Compatibilidad con React 19**: Cambios en la API de React
2. **Performance con esquemas grandes**: Rendimiento degradado
3. **Complexidad de la API**: API difícil de usar
4. **Migración a Bun.js**: Breaking changes en build process
5. **Zod v4 Breaking Changes**: Incompatibilidades con versiones anteriores
6. **Schema Navigation Complexity**: Performance con esquemas muy anidados
7. **Expectativas de Usuario**: Usuarios esperando gestión de formularios
8. **Bundle Size**: Aumento del tamaño del bundle
9. **Legacy Code Dependencies**: Dependencias del código legacy

### Estrategias de Mitigación

1. **Testing exhaustivo**: Tests en múltiples versiones de React
2. **Optimización temprana**: Profiling y optimización continua
3. **Feedback de usuarios**: Beta testing y iteración basada en feedback
4. **Migración gradual**: Migrar por fases con rollback plan
5. **Compatibility layer**: Mantener compatibilidad con Zod v3
6. **Lazy evaluation**: Evaluar esquemas anidados solo cuando sea necesario
7. **Documentación clara**: Explicar claramente el enfoque agnóstico
8. **Bundle analysis**: Monitoreo continuo del tamaño del bundle
9. **Legacy analysis**: Análisis cuidadoso del código legacy antes de migrar

## Recursos Necesarios

### Humanos

- 1 Desarrollador principal (full-time)
- 1 Reviewer de código (part-time)
- 1 Tester (part-time)

### Técnicos

- Entorno de desarrollo configurado
- Herramientas de testing
- Herramientas de documentación
- CI/CD pipeline
- **Bun.js runtime environment**
- **Zod v4 documentation and examples**
- **Código legacy en directorio `old/`**

## Cronograma

| Semana | Objetivos    | Entregables                                                |
| ------ | ------------ | ---------------------------------------------------------- |
| 1-2    | Fundación    | API básica de mapping, tests unitarios, migración a Bun.js |
| 3-4    | Core         | Mapping completo, Zod v4, navegación de esquemas           |
| 5-6    | Optimización | Performance optimizada, bundle size mínimo                 |
| 7-8    | Release      | Documentación, v2.0.0                                      |

## Próximos Pasos

1. Revisar y aprobar este plan
2. Analizar código legacy en `old/`
3. Configurar entorno de desarrollo con Bun.js
4. Comenzar migración del código legacy
5. Implementar API básica de mapping
6. Configurar pipeline de CI/CD para Bun.js
7. Migrar a Zod v4
8. Implementar navegación de esquemas con keys con puntos
9. Optimizar bundle size al mínimo
