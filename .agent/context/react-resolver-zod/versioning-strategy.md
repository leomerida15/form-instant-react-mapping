# Estrategia de Versionado - @form-instant/react-resolver-zod

## Visión General

Este documento define la estrategia de versionado para `@form-instant/react-resolver-zod`, siguiendo Semantic Versioning (SemVer) y estableciendo procesos claros para releases.

## Semantic Versioning (SemVer)

### Estructura de Versión

```
MAJOR.MINOR.PATCH[-PRERELEASE][+BUILD]
```

### Reglas de Versionado

#### MAJOR (X.0.0)

Cambios que rompen la compatibilidad hacia atrás:

- **Breaking Changes** en la API pública
- **Remoción** de funcionalidades deprecadas
- **Cambios** en el comportamiento core
- **Nuevas** dependencias que pueden causar conflictos

#### MINOR (0.X.0)

Nuevas funcionalidades compatibles hacia atrás:

- **Nuevas** funcionalidades
- **Mejoras** en funcionalidades existentes
- **Nuevos** hooks o componentes
- **Nuevas** opciones de configuración

#### PATCH (0.0.X)

Correcciones de bugs compatibles hacia atrás:

- **Bug fixes**
- **Performance improvements**
- **Documentation updates**
- **Security patches**

### Ejemplos de Versionado

```typescript
// MAJOR - Breaking change
// Antes: useZodResolver()
// Después: useZodResolver(options)
1.0.0 → 2.0.0

// MINOR - Nueva funcionalidad
// Agregado: useValidation hook
1.0.0 → 1.1.0

// PATCH - Bug fix
// Corregido: Error en validación de arrays
1.0.0 → 1.0.1

// PRERELEASE - Alpha/Beta
1.0.0 → 1.1.0-alpha.1
1.0.0 → 1.1.0-beta.2

// BUILD - Build metadata
1.0.0 → 1.0.0+build.123
```

## Ciclo de Release

### 1. Development Phase

```bash
# Branch de desarrollo
git checkout -b feature/new-validation-hook
# Desarrollo y testing
git commit -m "feat: add useValidation hook"
git push origin feature/new-validation-hook
```

### 2. Pre-release Phase

```bash
# Crear release candidate
npm version prerelease --preid=alpha
# Tag: v1.1.0-alpha.1

# Testing exhaustivo
npm run test:coverage
npm run test:e2e
npm run build
```

### 3. Release Phase

```bash
# Crear release final
npm version minor
# Tag: v1.1.0

# Publicar a npm
npm publish

# Crear GitHub release
gh release create v1.1.0 --generate-notes
```

### 4. Post-release Phase

```bash
# Merge a main
git checkout main
git merge release/v1.1.0

# Actualizar documentación
# Monitorear feedback
# Preparar hotfixes si es necesario
```

## Tipos de Release

### Stable Releases

- **Frecuencia**: Mensual
- **Testing**: Exhaustivo
- **Documentation**: Completa
- **Examples**: Actualizados

### Beta Releases

- **Frecuencia**: Semanal
- **Testing**: Básico
- **Documentation**: Parcial
- **Examples**: Limitados

### Alpha Releases

- **Frecuencia**: Diaria
- **Testing**: Mínimo
- **Documentation**: Básica
- **Examples**: Básicos

### Hotfix Releases

- **Frecuencia**: Según necesidad
- **Testing**: Crítico
- **Documentation**: Actualizada
- **Examples**: Sin cambios

## Proceso de Release

### 1. Preparación

```bash
# Verificar estado del proyecto
npm run test:coverage
npm run lint
npm run build
npm run size

# Actualizar changelog
npm run changelog

# Verificar dependencias
npm audit
npm outdated
```

### 2. Versionado

```bash
# Determinar tipo de release
# MAJOR: npm version major
# MINOR: npm version minor
# PATCH: npm version patch

# Para prereleases
npm version prerelease --preid=alpha
npm version prerelease --preid=beta
npm version prerelease --preid=rc
```

### 3. Testing

```bash
# Tests unitarios
npm run test

# Tests de integración
npm run test:integration

# Tests de performance
npm run test:performance

# Tests de compatibilidad
npm run test:compatibility
```

### 4. Build

```bash
# Build de producción
npm run build

# Verificar bundle size
npm run size

# Verificar tipos TypeScript
npm run type-check
```

### 5. Publicación

```bash
# Publicar a npm
npm publish

# Para prereleases
npm publish --tag alpha
npm publish --tag beta
npm publish --tag rc
```

### 6. Documentación

```bash
# Actualizar documentación
npm run docs:build

# Deploy a GitHub Pages
npm run docs:deploy

# Actualizar README
# Actualizar ejemplos
```

## Changelog Management

### Estructura del Changelog

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- New `useValidation` hook for field validation
- Support for conditional validation
- Performance optimizations for large forms

### Changed

- Improved error message formatting
- Enhanced TypeScript support

### Deprecated

- `useLegacyValidator` hook (will be removed in v2.0.0)

### Removed

- Support for React 16 (minimum is now React 17)

### Fixed

- Bug in array validation
- Memory leak in form state management
- TypeScript compilation errors

### Security

- Updated dependencies to fix security vulnerabilities

## [1.1.0] - 2024-01-15

### Added

- `useSchema` hook for schema utilities
- Support for nested schemas
- Custom error message support

### Changed

- Improved performance by 30%
- Better error handling

### Fixed

- Validation timing issues
- Bundle size optimization

## [1.0.1] - 2024-01-01

### Fixed

- Critical bug in form submission
- TypeScript type definitions

## [1.0.0] - 2023-12-15

### Added

- Initial release
- `useZodResolver` hook
- `ZodResolverProvider` component
- Basic validation support
```

### Convenciones de Commits

```bash
# Format: type(scope): description

# Features
feat(hooks): add useValidation hook
feat(provider): support custom validation options

# Bug fixes
fix(validation): resolve array validation issue
fix(types): correct TypeScript definitions

# Breaking changes
feat!(api): change useZodResolver signature

# Documentation
docs(readme): update installation guide
docs(api): add useValidation documentation

# Performance
perf(validation): optimize validation performance
perf(bundle): reduce bundle size by 20%

# Refactoring
refactor(engine): simplify validation engine
refactor(hooks): improve hook composition

# Testing
test(hooks): add tests for useValidation
test(integration): add form submission tests

# Chore
chore(deps): update dependencies
chore(build): update build configuration
```

## Branching Strategy

### Main Branches

```bash
main          # Código de producción
develop       # Código de desarrollo
release/*     # Branches de release
hotfix/*      # Branches de hotfix
feature/*     # Branches de features
```

### Workflow

```bash
# Feature development
git checkout develop
git checkout -b feature/new-feature
# ... desarrollo ...
git push origin feature/new-feature
# Crear Pull Request

# Release preparation
git checkout develop
git checkout -b release/v1.1.0
# ... preparación de release ...
git push origin release/v1.1.0
# Crear Pull Request

# Hotfix
git checkout main
git checkout -b hotfix/critical-bug
# ... fix ...
git push origin hotfix/critical-bug
# Crear Pull Request
```

## Dependencias y Compatibilidad

### Peer Dependencies

```json
{
    "peerDependencies": {
        "react": "^19.0.0",
        "zod": "^4.0.0"
    }
}
```

### Version Compatibility Matrix

| Library Version | React | Zod | Node |
| --------------- | ----- | --- | ---- |
| 1.x.x           | 19+   | 4+  | 18+  |
| 2.x.x           | 19+   | 4+  | 18+  |
| 3.x.x           | 20+   | 5+  | 18+  |

### Breaking Changes Policy

1. **Anuncio anticipado**: 6 meses antes
2. **Deprecation warnings**: 3 meses antes
3. **Migration guides**: Disponibles inmediatamente
4. **Support period**: 12 meses después del release

## Release Automation

### GitHub Actions Workflow

```yaml
name: Release

on:
    push:
        tags:
            - 'v*'

jobs:
    release:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v3

            - name: Setup Node.js
              uses: actions/setup-node@v3
              with:
                  node-version: '18'
                  registry-url: 'https://registry.npmjs.org'

            - name: Install dependencies
              run: npm ci

            - name: Run tests
              run: npm run test:coverage

            - name: Build
              run: npm run build

            - name: Publish to npm
              run: npm publish
              env:
                  NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

            - name: Create GitHub Release
              uses: actions/create-release@v1
              env:
                  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
              with:
                  tag_name: ${{ github.ref }}
                  release_name: Release ${{ github.ref }}
                  body: ${{ github.event.head_commit.message }}
                  draft: false
                  prerelease: false
```

### Pre-release Workflow

```yaml
name: Pre-release

on:
    push:
        branches:
            - develop

jobs:
    pre-release:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v3

            - name: Setup Node.js
              uses: actions/setup-node@v3
              with:
                  node-version: '18'

            - name: Install dependencies
              run: npm ci

            - name: Run tests
              run: npm run test

            - name: Build
              run: npm run build

            - name: Create pre-release
              run: |
                  npm version prerelease --preid=alpha
                  npm publish --tag alpha
```

## Monitoring y Feedback

### Release Metrics

- **Download counts**: NPM statistics
- **GitHub stars**: Repository engagement
- **Issue reports**: Bug tracking
- **Community feedback**: Discussions

### Quality Gates

- **Test coverage**: >95%
- **Performance**: <10ms validation
- **Bundle size**: <10KB
- **Security**: No vulnerabilities
- **Documentation**: 100% coverage

### Rollback Strategy

```bash
# En caso de issues críticos
npm unpublish @form-instant/react-resolver-zod@1.1.0
npm publish @form-instant/react-resolver-zod@1.0.1

# Comunicar a la comunidad
# Proporcionar migration path
# Investigar y fix el issue
```

## Próximos Releases

### v1.1.0 (Enero 2024)

- [ ] `useValidation` hook
- [ ] Conditional validation
- [ ] Performance optimizations

### v1.2.0 (Febrero 2024)

- [ ] Nested schemas support
- [ ] Custom validators
- [ ] Integration adapters

### v2.0.0 (Marzo 2024)

- [ ] Breaking changes
- [ ] New API design
- [ ] Major performance improvements
