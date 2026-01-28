# Especificaciones Técnicas - @form-instant/react-resolver-zod

## API Design

### Core API

#### SchemaMapper

```typescript
interface SchemaMapperProps {
    schema: ZodSchema;
    componentMapping: ComponentMapping;
    options?: {
        // Mapping options
        defaultComponent?: React.ComponentType<any>;
        pathSeparator?: string;
    };
}

const SchemaMapper: React.FC<SchemaMapperProps>;
```

#### useSchemaMapping

```typescript
interface UseSchemaMappingReturn {
    // Schema utilities
    schema: ZodSchema;
    getFieldSchema: (path: string) => ZodSchema | undefined;
    getFieldType: (path: string) => string | undefined;
    getFieldMetadata: (path: string) => FieldMetadata | undefined;

    // Component mapping
    getComponentForPath: (path: string) => React.ComponentType<any> | undefined;
    getPropsForPath: (path: string) => ComponentProps | undefined;
    renderField: (path: string, props?: any) => React.ReactElement | null;

    // Schema navigation
    resolvePath: (path: string) => ZodSchema | undefined;
    getNestedPaths: () => string[];
    validatePath: (path: string) => boolean;
}
```

#### useSchemaNavigation

```typescript
interface UseSchemaNavigationReturn {
    schema: ZodSchema;
    parse: (data: any) => any;
    safeParse: (data: any) => { success: boolean; data?: any; error?: ZodError };
    getFieldSchema: (path: string) => ZodSchema | undefined;
    getFieldType: (path: string) => string | undefined;

    // Zod v4 specific features
    refine: <T extends ZodSchema>(refinement: (data: z.infer<T>) => boolean) => T;
    transform: <T extends ZodSchema>(transformer: (data: z.infer<T>) => any) => T;
    preprocess: <T extends ZodSchema>(preprocessor: (data: any) => any) => T;
}
```

### Schema Navigation with Dot Notation

#### Path Resolution

```typescript
interface SchemaPathResolver {
    // Resolve nested schema paths
    resolvePath: (schema: ZodSchema, path: string) => ZodSchema | undefined;

    // Get value from nested object using path
    getNestedValue: (obj: any, path: string) => any;

    // Set value in nested object using path
    setNestedValue: (obj: any, path: string, value: any) => void;

    // Validate path exists in schema
    validatePath: (schema: ZodSchema, path: string) => boolean;

    // Get all available paths in schema
    getAllPaths: (schema: ZodSchema) => string[];
}

// Example usage
const schema = z.object({
    user: z.object({
        profile: z.object({
            email: z.string().email(),
            name: z.string().min(1),
            address: z.object({
                street: z.string(),
                city: z.string(),
            }),
        }),
    }),
});

// Navigation examples
const emailSchema = getFieldSchema('user.profile.email');
const addressSchema = getFieldSchema('user.profile.address');
const streetValue = getFieldValue('user.profile.address.street');
```

### Component Mapping

#### ComponentMapping

```typescript
interface ComponentMapping {
    [path: string]: {
        component: React.ComponentType<any>;
        props?: ComponentProps;
        metadata?: FieldMetadata;
    };
}

interface ComponentProps {
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    // Schema navigation
    path?: string; // Support for dot notation
    schema?: ZodSchema; // Direct schema reference
}

interface FieldMetadata {
    type: string;
    required: boolean;
    description?: string;
    examples?: any[];
    constraints?: Record<string, any>;
}
```

#### FieldRegistration

```typescript
interface FieldRegistration {
    name: string;
    path: string; // Full path for nested fields
    schema: ZodSchema;
    component: React.ComponentType<any>;
    props: ComponentProps;
    metadata: FieldMetadata;
}
```

### Schema Metadata

#### FieldMetadata

```typescript
interface FieldMetadata {
    type: string;
    required: boolean;
    description?: string;
    examples?: any[];
    constraints?: Record<string, any>;
    // Zod v4 specific metadata
    code?: string;
    expected?: string;
    received?: string;
}
```

#### ZodError

```typescript
interface ZodError {
    issues: Array<{
        code: string;
        message: string;
        path: string[];
        expected?: string;
        received?: string;
        // Zod v4 additional properties
        fatal?: boolean;
        validation?: string;
    }>;
}
```

## Implementation Details

### Context Structure

#### SchemaMappingContext

```typescript
interface SchemaMappingContextValue {
    // Schema and navigation
    schema: ZodSchema;
    pathResolver: SchemaPathResolver;

    // Component mapping
    componentMapping: ComponentMapping;
    defaultComponent: React.ComponentType<any>;

    // Utility methods
    getFieldSchema: (path: string) => ZodSchema | undefined;
    getFieldMetadata: (path: string) => FieldMetadata | undefined;
    getComponentForPath: (path: string) => React.ComponentType<any> | undefined;
    getPropsForPath: (path: string) => ComponentProps | undefined;

    // Schema navigation
    resolvePath: (path: string) => ZodSchema | undefined;
    getAllPaths: () => string[];
    validatePath: (path: string) => boolean;
}
```

### State Management

#### SchemaState

```typescript
interface SchemaState {
    schema: ZodSchema;
    componentMapping: ComponentMapping;
    resolvedPaths: Map<string, ZodSchema>;
    fieldMetadata: Map<string, FieldMetadata>;
}
```

#### FieldState

```typescript
interface FieldState {
    name: string;
    path: string; // Full path for nested fields
    schema: ZodSchema;
    component: React.ComponentType<any>;
    props: ComponentProps;
    metadata: FieldMetadata;
}
```

### Schema Resolution Engine

#### SchemaResolutionEngine

```typescript
class SchemaResolutionEngine {
    constructor(schema: ZodSchema);

    // Core resolution methods
    resolvePath(path: string): ZodSchema | undefined;
    getFieldMetadata(path: string): FieldMetadata | undefined;
    getAllPaths(): string[];

    // Schema utilities
    getFieldSchema(path: string): ZodSchema | undefined;
    getFieldPath(path: string): string[];
    resolveNestedPath(path: string): ZodSchema | undefined;

    // Metadata extraction
    extractMetadata(schema: ZodSchema): FieldMetadata;
    extractConstraints(schema: ZodSchema): Record<string, any>;

    // Zod v4 specific methods
    refineSchema<T extends ZodSchema>(refinement: (data: z.infer<T>) => boolean): T;
    transformSchema<T extends ZodSchema>(transformer: (data: z.infer<T>) => any): T;
}
```

#### ResolutionResult

```typescript
interface ResolutionResult {
    schema: ZodSchema | undefined;
    metadata: FieldMetadata | undefined;
}
```

### Performance Optimizations

#### Memoization Strategy

```typescript
// Memoize schema resolution
const memoizedResolvePath = useMemo(() => {
    return (path: string) => schemaResolver.resolvePath(path);
}, [schemaResolver]);

// Memoize component mapping
const memoizedGetComponent = useCallback(
    (path: string) => {
        return componentMapping[path]?.component || defaultComponent;
    },
    [componentMapping, defaultComponent],
);

// Memoize path resolution
const memoizedPathResolver = useMemo(() => {
    return new SchemaPathResolver(schema);
}, [schema]);

// Memoize metadata extraction
const memoizedMetadata = useMemo(() => {
    return extractAllMetadata(schema);
}, [schema]);
```

#### Re-render Optimization

```typescript
// Use React.memo for schema components
const SchemaField = React.memo(({ path, ...props }) => {
    const { getComponentForPath, getPropsForPath } = useSchemaMapping();
    const Component = getComponentForPath(path);
    const fieldProps = getPropsForPath(path);

    if (!Component) {
        return null;
    }

    return <Component {...fieldProps} {...props} />;
});

// Optimize context updates
const contextValue = useMemo(() => ({
    schema,
    pathResolver,
    componentMapping,
    defaultComponent,
    // ... other values
}), [schema, pathResolver, componentMapping, defaultComponent]);
```

### Error Handling

#### Error Types

```typescript
enum ErrorType {
    SCHEMA_ERROR = 'SCHEMA_ERROR',
    PATH_ERROR = 'PATH_ERROR',
    COMPONENT_ERROR = 'COMPONENT_ERROR',
    MAPPING_ERROR = 'MAPPING_ERROR',
}
```

#### Error Handler

```typescript
class ErrorHandler {
    static handleSchemaError(error: ZodError): SchemaErrors {
        return error.issues.reduce((acc, issue) => {
            const path = issue.path.join('.');
            acc[path] = {
                type: issue.code,
                message: issue.message,
                path: issue.path,
                expected: issue.expected,
                received: issue.received,
            };
            return acc;
        }, {} as SchemaErrors);
    }

    static handlePathError(path: string): string {
        return `Invalid path: ${path}`;
    }

    static handleComponentError(path: string, component: string): string {
        return `Component not found for path ${path}: ${component}`;
    }
}
```

### Type Safety

#### Type Inference

```typescript
// Infer schema type from Zod schema
type InferSchemaType<T extends ZodSchema> = z.infer<T>;

// Type-safe component mapping with path support
interface TypedComponentMapping<T> {
    [K in keyof T]: {
        component: React.ComponentType<any>;
        props?: ComponentProps;
    };
}

// Path-based type inference
type PathValue<T, P extends string> = P extends keyof T
    ? T[P]
    : P extends `${infer K}.${infer R}`
        ? K extends keyof T
            ? PathValue<T[K], R>
            : never
        : never;
```

#### Generic Hooks

```typescript
const useSchemaMapping = <T extends ZodSchema>(): UseSchemaMappingReturn<z.infer<T>> => {
    // Implementation
};

const useSchemaNavigation = <T extends ZodSchema>(): UseSchemaNavigationReturn<T> => {
    // Implementation
};
```

## Testing Strategy

### Unit Tests

```typescript
describe('useSchemaMapping', () => {
    it('should map nested schemas to components correctly', () => {
        const schema = z.object({
            user: z.object({
                profile: z.object({
                    email: z.string().email(),
                    name: z.string().min(1),
                }),
            }),
        });

        const componentMapping = {
            'user.profile.email': EmailInput,
            'user.profile.name': TextInput,
        };

        const { result } = renderHook(() => useSchemaMapping(), {
            wrapper: ({ children }) => (
                <SchemaMapper schema={schema} componentMapping={componentMapping}>
                    {children}
                </SchemaMapper>
            ),
        });

        const emailComponent = result.current.getComponentForPath('user.profile.email');
        const nameComponent = result.current.getComponentForPath('user.profile.name');
        const invalidComponent = result.current.getComponentForPath('user.invalid.path');

        expect(emailComponent).toBe(EmailInput);
        expect(nameComponent).toBe(TextInput);
        expect(invalidComponent).toBeUndefined();
    });
});
```

### Integration Tests

```typescript
describe('Schema Mapping Integration', () => {
    it('should render components based on schema mapping', () => {
        const schema = z.object({
            user: z.object({
                profile: z.object({
                    name: z.string().min(1),
                    email: z.string().email(),
                }),
            }),
        });

        const componentMapping = {
            'user.profile.name': TextInput,
            'user.profile.email': EmailInput,
        };

        const TestForm = () => {
            const { renderField } = useSchemaMapping();

            return (
                <div>
                    {renderField('user.profile.name', { placeholder: 'Name' })}
                    {renderField('user.profile.email', { placeholder: 'Email' })}
                </div>
            );
        };

        render(
            <SchemaMapper schema={schema} componentMapping={componentMapping}>
                <TestForm />
            </SchemaMapper>
        );

        expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    });
});
```

## Bundle Size Optimization

### Tree Shaking

```typescript
// Named exports for better tree shaking
export { useSchemaMapping } from './hooks/useSchemaMapping';
export { useSchemaNavigation } from './hooks/useSchemaNavigation';
export { SchemaMapper } from './components/SchemaMapper';

// Avoid default exports
// ❌ export default useSchemaMapping;
// ✅ export { useSchemaMapping };
```

### Code Splitting

```typescript
// Lazy load advanced features
const AdvancedMapping = lazy(() => import('./AdvancedMapping'));
const CustomResolvers = lazy(() => import('./CustomResolvers'));
```

### Dependencies

```typescript
// Peer dependencies
{
    "peerDependencies": {
        "react": "^19.0.0",
        "zod": "^4.0.0"
    },
    "devDependencies": {
        "@types/react": "^19.0.0",
        "typescript": "^5.0.0",
        "bun": "^1.0.0"
    }
}
```

## Bun.js Configuration

### bunfig.toml

```toml
[build]
entrypoints = ["./src/index.ts"]
outdir = "./dist"
target = "browser"
minify = true
sourcemap = "external"

[test]
preload = ["./test/setup.ts"]
coverage = true

[install]
peer = true
```

### Package.json Scripts

```json
{
    "scripts": {
        "build": "bun build ./src/index.ts --outdir ./dist",
        "test": "bun test",
        "test:coverage": "bun test --coverage",
        "dev": "bun --watch ./src/index.ts",
        "type-check": "tsc --noEmit"
    }
}
```
