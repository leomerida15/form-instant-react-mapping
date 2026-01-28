# Estrategia de Testing - @form-instant/react-resolver-zod

## Visión General

La estrategia de testing para `@form-instant/react-resolver-zod` está diseñada para garantizar la calidad, confiabilidad y mantenibilidad del código, cubriendo todos los aspectos desde unit tests hasta end-to-end testing, utilizando Bun.js como runtime y test runner principal.

## Objetivos de Testing

### 1. Calidad del Código

- Detectar bugs tempranamente
- Prevenir regresiones
- Mantener la estabilidad del API
- Asegurar type safety

### 2. Confiabilidad

- Validar funcionalidad core
- Verificar integración con Zod v4
- Comprobar compatibilidad con React
- Asegurar performance con Bun.js

### 3. Mantenibilidad

- Documentar comportamiento esperado
- Facilitar refactoring
- Guiar el desarrollo
- Reducir tiempo de debugging

## Pirámide de Testing

```
                    ┌─────────────────┐
                    │   E2E Tests     │ ← Menos tests, más integración
                    └─────────────────┘
                ┌─────────────────────────┐
                │   Integration Tests     │ ← Tests de componentes
                └─────────────────────────┘
    ┌─────────────────────────────────────────────┐
    │           Unit Tests                        │ ← Más tests, menos integración
    └─────────────────────────────────────────────┘
```

### Distribución Objetivo

- **Unit Tests**: 70% (700-800 tests)
- **Integration Tests**: 25% (250-300 tests)
- **E2E Tests**: 5% (50-100 tests)

## Herramientas de Testing

### Core Testing Stack

```json
{
    "devDependencies": {
        "bun": "^1.0.0",
        "zod": "^4.0.0",
        "@types/react": "^19.0.0",
        "typescript": "^5.0.0"
    }
}
```

### Testing Utilities

```typescript
// Bun.js testing utilities
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Custom testing utilities for Bun.js
import { renderHook, act } from '@testing-library/react';
```

## Unit Testing Strategy

### 1. Hooks Testing

#### useZodResolver Hook

```typescript
describe('useZodResolver', () => {
    const schema = z.object({
        user: z.object({
            profile: z.object({
                email: z.string().email(),
                name: z.string().min(1),
            }),
        }),
    });

    it('should initialize with default values', () => {
        const { result } = renderHook(() => useZodResolver(), {
            wrapper: ({ children }) => (
                <ZodResolverProvider schema={schema}>
                    {children}
                </ZodResolverProvider>
            ),
        });

        expect(result.current.values).toEqual({});
        expect(result.current.errors).toEqual({});
        expect(result.current.isValid).toBe(false);
        expect(result.current.isDirty).toBe(false);
    });

    it('should validate nested fields correctly', async () => {
        const { result } = renderHook(() => useZodResolver(), {
            wrapper: ({ children }) => (
                <ZodResolverProvider schema={schema}>
                    {children}
                </ZodResolverProvider>
            ),
        });

        await act(async () => {
            result.current.setValue('user.profile.email', 'invalid-email');
            const isValid = await result.current.validate('user.profile.email');
            expect(isValid).toBe(false);
            expect(result.current.errors['user.profile.email']).toBeDefined();
        });
    });

    it('should handle nested form submission', async () => {
        const onSubmit = jest.fn();
        const { result } = renderHook(() => useZodResolver(), {
            wrapper: ({ children }) => (
                <ZodResolverProvider schema={schema}>
                    {children}
                </ZodResolverProvider>
            ),
        });

        await act(async () => {
            result.current.setValue('user.profile.email', 'test@example.com');
            result.current.setValue('user.profile.name', 'John Doe');

            const handleSubmit = result.current.handleSubmit(onSubmit);
            await handleSubmit({ preventDefault: jest.fn() });

            expect(onSubmit).toHaveBeenCalledWith({
                user: {
                    profile: {
                        email: 'test@example.com',
                        name: 'John Doe',
                    },
                },
            });
        });
    });
});
```

#### useSchema Hook

```typescript
describe('useSchema', () => {
    const schema = z.object({
        user: z.object({
            profile: z.object({
                name: z.string(),
                email: z.string().email(),
            }),
        }),
    });

    it('should provide schema utilities', () => {
        const { result } = renderHook(() => useSchema(), {
            wrapper: ({ children }) => (
                <ZodResolverProvider schema={schema}>
                    {children}
                </ZodResolverProvider>
            ),
        });

        expect(result.current.schema).toBe(schema);
        expect(typeof result.current.parse).toBe('function');
        expect(typeof result.current.safeParse).toBe('function');
    });

    it('should resolve nested schema paths', () => {
        const { result } = renderHook(() => useSchema(), {
            wrapper: ({ children }) => (
                <ZodResolverProvider schema={schema}>
                    {children}
                </ZodResolverProvider>
            ),
        });

        const emailSchema = result.current.getFieldSchema('user.profile.email');
        const nameSchema = result.current.getFieldSchema('user.profile.name');
        const invalidSchema = result.current.getFieldSchema('user.invalid.path');

        expect(emailSchema).toBeDefined();
        expect(nameSchema).toBeDefined();
        expect(invalidSchema).toBeUndefined();
    });

    it('should parse nested data correctly', () => {
        const { result } = renderHook(() => useSchema(), {
            wrapper: ({ children }) => (
                <ZodResolverProvider schema={schema}>
                    {children}
                </ZodResolverProvider>
            ),
        });

        const data = {
            user: {
                profile: {
                    name: 'John Doe',
                    email: 'john@example.com',
                },
            },
        };

        const parsed = result.current.parse(data);
        expect(parsed).toEqual(data);
    });
});
```

### 2. Utility Functions Testing

#### Schema Path Resolver

```typescript
describe('SchemaPathResolver', () => {
    let pathResolver: SchemaPathResolver;
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

    beforeEach(() => {
        pathResolver = new SchemaPathResolver(schema);
    });

    it('should resolve valid paths', () => {
        const emailSchema = pathResolver.resolvePath(schema, 'user.profile.email');
        const addressSchema = pathResolver.resolvePath(schema, 'user.profile.address');
        const streetSchema = pathResolver.resolvePath(schema, 'user.profile.address.street');

        expect(emailSchema).toBeDefined();
        expect(addressSchema).toBeDefined();
        expect(streetSchema).toBeDefined();
    });

    it('should return undefined for invalid paths', () => {
        const invalidSchema = pathResolver.resolvePath(schema, 'user.invalid.path');
        const deepInvalidSchema = pathResolver.resolvePath(schema, 'user.profile.address.invalid');

        expect(invalidSchema).toBeUndefined();
        expect(deepInvalidSchema).toBeUndefined();
    });

    it('should get nested values correctly', () => {
        const data = {
            user: {
                profile: {
                    email: 'test@example.com',
                    name: 'John Doe',
                    address: {
                        street: '123 Main St',
                        city: 'New York',
                    },
                },
            },
        };

        const email = pathResolver.getNestedValue(data, 'user.profile.email');
        const street = pathResolver.getNestedValue(data, 'user.profile.address.street');

        expect(email).toBe('test@example.com');
        expect(street).toBe('123 Main St');
    });

    it('should set nested values correctly', () => {
        const data = {
            user: {
                profile: {
                    email: 'old@example.com',
                    name: 'John Doe',
                },
            },
        };

        pathResolver.setNestedValue(data, 'user.profile.email', 'new@example.com');
        pathResolver.setNestedValue(data, 'user.profile.address.street', '456 Oak St');

        expect(data.user.profile.email).toBe('new@example.com');
        expect(data.user.profile.address.street).toBe('456 Oak St');
    });
});
```

#### Validation Engine

```typescript
describe('ValidationEngine', () => {
    let validationEngine: ValidationEngine;
    const schema = z.object({
        user: z.object({
            profile: z.object({
                email: z.string().email(),
                name: z.string().min(1),
            }),
        }),
    });

    beforeEach(() => {
        validationEngine = new ValidationEngine(schema, { runtime: 'bun' });
    });

    it('should validate nested fields correctly', async () => {
        const result = await validationEngine.validateField(
            'user.profile.email',
            'test@example.com',
        );
        expect(result.isValid).toBe(true);
        expect(result.errors).toEqual({});
    });

    it('should return validation errors for nested fields', async () => {
        const result = await validationEngine.validateField('user.profile.email', 'invalid-email');
        expect(result.isValid).toBe(false);
        expect(result.errors['user.profile.email']).toBeDefined();
    });

    it('should validate entire nested form', async () => {
        const formData = {
            user: {
                profile: {
                    email: 'test@example.com',
                    name: 'John Doe',
                },
            },
        };

        const result = await validationEngine.validateForm(formData);
        expect(result.isValid).toBe(true);
        expect(result.data).toEqual(formData);
    });

    it('should provide performance metrics', async () => {
        const result = await validationEngine.validateField(
            'user.profile.email',
            'test@example.com',
        );

        expect(result.performance).toBeDefined();
        expect(typeof result.performance.validationTime).toBe('number');
        expect(typeof result.performance.memoryUsage).toBe('number');
    });
});
```

## Integration Testing Strategy

### 1. Component Integration

#### ZodResolverProvider

```typescript
describe('ZodResolverProvider', () => {
    it('should provide context to children', () => {
        const schema = z.object({
            user: z.object({
                profile: z.object({
                    name: z.string(),
                }),
            }),
        });

        const TestComponent = () => {
            const { schema: contextSchema } = useSchema();
            return <div data-testid="schema">{contextSchema ? 'has-schema' : 'no-schema'}</div>;
        };

        render(
            <ZodResolverProvider schema={schema}>
                <TestComponent />
            </ZodResolverProvider>
        );

        expect(screen.getByTestId('schema')).toHaveTextContent('has-schema');
    });

    it('should handle Bun.js specific options', () => {
        const schema = z.object({
            user: z.object({
                profile: z.object({
                    name: z.string(),
                }),
            }),
        });

        const options = {
            mode: 'onChange' as const,
            defaultValues: { user: { profile: { name: 'John' } } },
            runtime: 'bun' as const,
            optimizeForBun: true,
        };

        const TestComponent = () => {
            const { values } = useZodResolver();
            return <div data-testid="values">{JSON.stringify(values)}</div>;
        };

        render(
            <ZodResolverProvider schema={schema} options={options}>
                <TestComponent />
            </ZodResolverProvider>
        );

        expect(screen.getByTestId('values')).toHaveTextContent('{"user":{"profile":{"name":"John"}}}');
    });
});
```

### 2. Form Integration

#### Complete Form Flow with Nested Fields

```typescript
describe('Form Integration with Nested Fields', () => {
    it('should handle complete nested form submission flow', async () => {
        const schema = z.object({
            user: z.object({
                profile: z.object({
                    email: z.string().email(),
                    name: z.string().min(1),
                    address: z.object({
                        street: z.string().min(1),
                        city: z.string().min(1),
                    }),
                }),
            }),
        });

        const onSubmit = jest.fn();
        const TestForm = () => {
            const { register, handleSubmit, errors } = useZodResolver();

            return (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                        {...register('user.profile.name')}
                        placeholder="Name"
                        data-testid="name"
                    />
                    {errors['user.profile.name'] && (
                        <span data-testid="name-error">{errors['user.profile.name'].message}</span>
                    )}

                    <input
                        {...register('user.profile.email')}
                        placeholder="Email"
                        data-testid="email"
                    />
                    {errors['user.profile.email'] && (
                        <span data-testid="email-error">{errors['user.profile.email'].message}</span>
                    )}

                    <input
                        {...register('user.profile.address.street')}
                        placeholder="Street"
                        data-testid="street"
                    />
                    {errors['user.profile.address.street'] && (
                        <span data-testid="street-error">{errors['user.profile.address.street'].message}</span>
                    )}

                    <input
                        {...register('user.profile.address.city')}
                        placeholder="City"
                        data-testid="city"
                    />
                    {errors['user.profile.address.city'] && (
                        <span data-testid="city-error">{errors['user.profile.address.city'].message}</span>
                    )}

                    <button type="submit" data-testid="submit">Submit</button>
                </form>
            );
        };

        render(
            <ZodResolverProvider schema={schema}>
                <TestForm />
            </ZodResolverProvider>
        );

        const user = userEvent.setup();

        // Fill form with invalid data
        await user.type(screen.getByTestId('email'), 'invalid-email');
        await user.type(screen.getByTestId('name'), '');

        // Submit form
        await user.click(screen.getByTestId('submit'));

        // Check for validation errors
        await waitFor(() => {
            expect(screen.getByTestId('email-error')).toBeInTheDocument();
            expect(screen.getByTestId('name-error')).toBeInTheDocument();
        });

        // Fill form with valid data
        await user.clear(screen.getByTestId('email'));
        await user.type(screen.getByTestId('email'), 'test@example.com');
        await user.clear(screen.getByTestId('name'));
        await user.type(screen.getByTestId('name'), 'John Doe');
        await user.type(screen.getByTestId('street'), '123 Main St');
        await user.type(screen.getByTestId('city'), 'New York');

        // Submit form again
        await user.click(screen.getByTestId('submit'));

        // Check successful submission
        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith({
                user: {
                    profile: {
                        email: 'test@example.com',
                        name: 'John Doe',
                        address: {
                            street: '123 Main St',
                            city: 'New York',
                        },
                    },
                },
            });
        });
    });
});
```

### 3. Performance Testing

#### Re-render Optimization

```typescript
describe('Performance with Bun.js', () => {
    it('should minimize re-renders with nested fields', () => {
        const renderCount = jest.fn();
        const schema = z.object({
            user: z.object({
                profile: z.object({
                    name: z.string(),
                    email: z.string().email(),
                }),
            }),
        });

        const TestComponent = React.memo(() => {
            renderCount();
            const { values } = useZodResolver();
            return (
                <div>
                    <span data-testid="name">{values.user?.profile?.name || 'empty'}</span>
                    <span data-testid="email">{values.user?.profile?.email || 'empty'}</span>
                </div>
            );
        });

        const { rerender } = render(
            <ZodResolverProvider schema={schema}>
                <TestComponent />
            </ZodResolverProvider>
        );

        const initialRenderCount = renderCount.mock.calls.length;

        // Re-render provider with same props
        rerender(
            <ZodResolverProvider schema={schema}>
                <TestComponent />
            </ZodResolverProvider>
        );

        expect(renderCount.mock.calls.length).toBe(initialRenderCount);
    });

    it('should provide performance metrics', async () => {
        const schema = z.object({
            user: z.object({
                profile: z.object({
                    email: z.string().email(),
                }),
            }),
        });

        const TestComponent = () => {
            const { validate } = useZodResolver();
            const [metrics, setMetrics] = useState(null);

            const handleValidation = async () => {
                const startTime = performance.now();
                await validate('user.profile.email');
                const endTime = performance.now();
                setMetrics({ validationTime: endTime - startTime });
            };

            return (
                <div>
                    <button onClick={handleValidation} data-testid="validate">Validate</button>
                    {metrics && <span data-testid="metrics">{JSON.stringify(metrics)}</span>}
                </div>
            );
        };

        render(
            <ZodResolverProvider schema={schema}>
                <TestComponent />
            </ZodResolverProvider>
        );

        const user = userEvent.setup();
        await user.click(screen.getByTestId('validate'));

        await waitFor(() => {
            const metrics = screen.getByTestId('metrics');
            expect(metrics).toBeInTheDocument();
            const metricsData = JSON.parse(metrics.textContent);
            expect(metricsData.validationTime).toBeLessThan(100); // Should be fast with Bun.js
        });
    });
});
```

## E2E Testing Strategy

### 1. Critical User Journeys

#### Complex Nested Form Submission Journey

```typescript
describe('E2E: Complex Nested Form Submission', () => {
    it('should complete complex user registration flow', async () => {
        const schema = z.object({
            user: z.object({
                profile: z.object({
                    firstName: z.string().min(1),
                    lastName: z.string().min(1),
                    email: z.string().email(),
                    phone: z.string().optional(),
                }),
                preferences: z.object({
                    newsletter: z.boolean(),
                    notifications: z.boolean(),
                }),
                address: z.object({
                    street: z.string().min(1),
                    city: z.string().min(1),
                    state: z.string().min(1),
                    zipCode: z.string().min(1),
                }),
            }),
        }).refine((data) => {
            // Custom validation: require phone if newsletter is enabled
            if (data.user.preferences.newsletter && !data.user.profile.phone) {
                return false;
            }
            return true;
        }, {
            message: "Phone number is required when newsletter is enabled",
            path: ["user", "profile", "phone"],
        });

        const TestRegistrationForm = () => {
            const { register, handleSubmit, errors } = useZodResolver();
            const [isSubmitted, setIsSubmitted] = useState(false);

            const onSubmit = (data: any) => {
                console.log('Form submitted:', data);
                setIsSubmitted(true);
            };

            if (isSubmitted) {
                return <div data-testid="success">Registration successful!</div>;
            }

            return (
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Profile Fields */}
                    <input {...register('user.profile.firstName')} placeholder="First Name" data-testid="firstName" />
                    {errors['user.profile.firstName'] && <span data-testid="firstName-error">{errors['user.profile.firstName'].message}</span>}

                    <input {...register('user.profile.lastName')} placeholder="Last Name" data-testid="lastName" />
                    {errors['user.profile.lastName'] && <span data-testid="lastName-error">{errors['user.profile.lastName'].message}</span>}

                    <input {...register('user.profile.email')} placeholder="Email" data-testid="email" />
                    {errors['user.profile.email'] && <span data-testid="email-error">{errors['user.profile.email'].message}</span>}

                    <input {...register('user.profile.phone')} placeholder="Phone (optional)" data-testid="phone" />
                    {errors['user.profile.phone'] && <span data-testid="phone-error">{errors['user.profile.phone'].message}</span>}

                    {/* Preferences */}
                    <label>
                        <input {...register('user.preferences.newsletter')} type="checkbox" data-testid="newsletter" />
                        Subscribe to newsletter
                    </label>

                    <label>
                        <input {...register('user.preferences.notifications')} type="checkbox" data-testid="notifications" />
                        Enable notifications
                    </label>

                    {/* Address Fields */}
                    <input {...register('user.address.street')} placeholder="Street" data-testid="street" />
                    {errors['user.address.street'] && <span data-testid="street-error">{errors['user.address.street'].message}</span>}

                    <input {...register('user.address.city')} placeholder="City" data-testid="city" />
                    {errors['user.address.city'] && <span data-testid="city-error">{errors['user.address.city'].message}</span>}

                    <input {...register('user.address.state')} placeholder="State" data-testid="state" />
                    {errors['user.address.state'] && <span data-testid="state-error">{errors['user.address.state'].message}</span>}

                    <input {...register('user.address.zipCode')} placeholder="ZIP Code" data-testid="zipCode" />
                    {errors['user.address.zipCode'] && <span data-testid="zipCode-error">{errors['user.address.zipCode'].message}</span>}

                    <button type="submit" data-testid="submit">Register</button>
                </form>
            );
        };

        render(
            <ZodResolverProvider schema={schema}>
                <TestRegistrationForm />
            </ZodResolverProvider>
        );

        const user = userEvent.setup();

        // Fill form step by step
        await user.type(screen.getByTestId('firstName'), 'John');
        await user.type(screen.getByTestId('lastName'), 'Doe');
        await user.type(screen.getByTestId('email'), 'john.doe@example.com');
        await user.type(screen.getByTestId('street'), '123 Main St');
        await user.type(screen.getByTestId('city'), 'New York');
        await user.type(screen.getByTestId('state'), 'NY');
        await user.type(screen.getByTestId('zipCode'), '10001');

        // Enable newsletter without phone (should trigger validation error)
        await user.click(screen.getByTestId('newsletter'));
        await user.click(screen.getByTestId('submit'));

        // Check for validation error
        await waitFor(() => {
            expect(screen.getByTestId('phone-error')).toBeInTheDocument();
        });

        // Add phone number and submit again
        await user.type(screen.getByTestId('phone'), '555-123-4567');
        await user.click(screen.getByTestId('submit'));

        // Verify success
        await waitFor(() => {
            expect(screen.getByTestId('success')).toBeInTheDocument();
        });
    });
});
```

## Testing Best Practices

### 1. Test Organization

```typescript
// Group related tests
describe('useZodResolver', () => {
    describe('initialization', () => {
        // Initialization tests
    });

    describe('validation', () => {
        // Validation tests
    });

    describe('nested fields', () => {
        // Nested field tests
    });

    describe('form submission', () => {
        // Submission tests
    });
});
```

### 2. Test Data Management

```typescript
// Centralized test data
const TEST_SCHEMAS = {
    simple: z.object({
        name: z.string().min(1),
        email: z.string().email(),
    }),
    nested: z.object({
        user: z.object({
            profile: z.object({
                name: z.string().min(1),
                email: z.string().email(),
            }),
        }),
    }),
    complex: z.object({
        user: z.object({
            profile: z.object({
                firstName: z.string().min(1),
                lastName: z.string().min(1),
                email: z.string().email(),
            }),
            address: z.object({
                street: z.string().min(1),
                city: z.string().min(1),
            }),
        }),
    }),
};

const TEST_DATA = {
    validSimple: { name: 'John Doe', email: 'john@example.com' },
    validNested: {
        user: {
            profile: {
                name: 'John Doe',
                email: 'john@example.com',
            },
        },
    },
    invalidNested: {
        user: {
            profile: {
                name: '',
                email: 'invalid-email',
            },
        },
    },
};
```

### 3. Custom Testing Utilities

```typescript
// Custom render function for Bun.js
const renderWithProvider = (
    ui: React.ReactElement,
    { schema, options, ...renderOptions } = {}
) => {
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <ZodResolverProvider schema={schema} options={options}>
            {children}
        </ZodResolverProvider>
    );

    return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Custom hook testing utility for Bun.js
const renderHookWithProvider = (
    hook: () => any,
    { schema, options, ...renderOptions } = {}
) => {
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <ZodResolverProvider schema={schema} options={options}>
            {children}
        </ZodResolverProvider>
    );

    return renderHook(hook, { wrapper: Wrapper, ...renderOptions });
};

// Performance testing utility
const measurePerformance = async (fn: () => Promise<any>) => {
    const startTime = performance.now();
    const startMemory = performance.memory?.usedJSHeapSize || 0;

    const result = await fn();

    const endTime = performance.now();
    const endMemory = performance.memory?.usedJSHeapSize || 0;

    return {
        result,
        performance: {
            executionTime: endTime - startTime,
            memoryUsage: endMemory - startMemory,
        },
    };
};
```

## Coverage Goals

### Target Coverage

- **Statements**: 95%
- **Branches**: 90%
- **Functions**: 95%
- **Lines**: 95%

### Coverage Exclusions

```typescript
// Exclude development-only code
/* istanbul ignore next */
if (process.env.NODE_ENV === 'development') {
    // Development code
}

// Exclude Bun.js specific optimizations
/* istanbul ignore next */
if (process.env.RUNTIME === 'bun') {
    // Bun.js specific code
}

// Exclude error boundaries
/* istanbul ignore next */
class ErrorBoundary extends React.Component {
    // Error boundary implementation
}
```

## Continuous Integration

### GitHub Actions Workflow for Bun.js

```yaml
name: Tests with Bun.js
on: [push, pull_request]
jobs:
    test:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v3

            - name: Setup Bun.js
              uses: oven-sh/setup-bun@v1
              with:
                  bun-version: latest

            - name: Install dependencies
              run: bun install

            - name: Run tests
              run: bun test

            - name: Run tests with coverage
              run: bun test --coverage

            - name: Build
              run: bun run build

            - name: Type check
              run: bun run type-check

            - name: Upload coverage
              uses: codecov/codecov-action@v3
```

### Pre-commit Hooks

```json
{
    "husky": {
        "hooks": {
            "pre-commit": "bun test --staged",
            "pre-push": "bun test --coverage"
        }
    }
}
```

## Performance Testing

### Bundle Size Testing

```typescript
describe('Bundle Size', () => {
    it('should maintain size limits with Bun.js', () => {
        // Test bundle size limits
        expect(bundleSize).toBeLessThan(10 * 1024); // 10KB
    });
});
```

### Memory Leak Testing

```typescript
describe('Memory Leaks', () => {
    it('should not leak memory on unmount with Bun.js', () => {
        const { unmount } = render(<TestComponent />);
        const initialMemory = performance.memory?.usedJSHeapSize || 0;

        unmount();

        // Force garbage collection if available
        if (global.gc) {
            global.gc();
        }

        const finalMemory = performance.memory?.usedJSHeapSize || 0;
        expect(finalMemory).toBeLessThanOrEqual(initialMemory);
    });
});
```

### Runtime Performance Testing

```typescript
describe('Runtime Performance', () => {
    it('should validate nested fields efficiently', async () => {
        const schema = z.object({
            user: z.object({
                profile: z.object({
                    email: z.string().email(),
                    name: z.string().min(1),
                }),
            }),
        });

        const { performance } = await measurePerformance(async () => {
            const validationEngine = new ValidationEngine(schema, { runtime: 'bun' });
            await validationEngine.validateField('user.profile.email', 'test@example.com');
        });

        expect(performance.executionTime).toBeLessThan(10); // Should be very fast with Bun.js
        expect(performance.memoryUsage).toBeLessThan(1024 * 1024); // Less than 1MB
    });
});
```
