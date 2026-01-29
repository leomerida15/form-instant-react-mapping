import { z } from 'zod';
import type { FieldConfig } from '../types';

// Extend ZodType interface to include fieldConfig method
declare module 'zod' {
    interface ZodType {
        fieldConfig: <Ob extends Record<string, any>>(config: FieldConfig<Ob, keyof Ob>) => this;
        _fieldConfig?: FieldConfig<any, any>;
    }
}

// Create a wrapper function that adds fieldConfig to any Zod schema
function addFieldConfig<T extends z.ZodTypeAny>(schema: T, config: FieldConfig<any, any>): T {
    (schema as any)._fieldConfig = config;

    // Add fieldConfig method to the schema instance
    Object.defineProperty(schema, 'fieldConfig', {
        value(newConfig: FieldConfig<any, any>) {
            (this as any)._fieldConfig = newConfig;
            return this;
        },
        writable: true,
        configurable: true,
    });

    return schema;
}

// Function to extend Zod globally with fieldConfig method
export function extendZodWithFieldConfig() {
    // In Zod v4, we need to extend the base ZodType prototype
    // Get the prototype of a basic Zod schema
    const zodTypePrototype = Object.getPrototypeOf(z.string());

    // Add fieldConfig method to all Zod schemas
    Object.defineProperty(zodTypePrototype, 'fieldConfig', {
        value(config: FieldConfig<any, any>) {
            (this as any)._fieldConfig = config;
            return this;
        },
        writable: true,
        configurable: true,
    });

    // For Zod v4, we need to be more careful about extending prototypes
    // Let's try to extend the most common ones
    try {
        // Extend string schema prototype
        const stringPrototype = Object.getPrototypeOf(z.string());
        if (stringPrototype && stringPrototype !== zodTypePrototype) {
            Object.defineProperty(stringPrototype, 'fieldConfig', {
                value(config: FieldConfig<any, any>) {
                    (this as any)._fieldConfig = config;
                    return this;
                },
                writable: true,
                configurable: true,
            });
        }

        // Extend email schema prototype (z.string().email())
        const emailPrototype = Object.getPrototypeOf(z.email());
        if (emailPrototype && emailPrototype !== zodTypePrototype) {
            Object.defineProperty(emailPrototype, 'fieldConfig', {
                value(config: FieldConfig<any, any>) {
                    (this as any)._fieldConfig = config;
                    return this;
                },
                writable: true,
                configurable: true,
            });
        }

        // Extend url schema prototype (z.string().url())
        const urlPrototype = Object.getPrototypeOf(z.string().url());
        if (urlPrototype && urlPrototype !== zodTypePrototype) {
            Object.defineProperty(urlPrototype, 'fieldConfig', {
                value(config: FieldConfig<any, any>) {
                    (this as any)._fieldConfig = config;
                    return this;
                },
                writable: true,
                configurable: true,
            });
        }

        // Extend min schema prototype (z.string().min())
        const minPrototype = Object.getPrototypeOf(z.string().min(1));
        if (minPrototype && minPrototype !== zodTypePrototype) {
            Object.defineProperty(minPrototype, 'fieldConfig', {
                value(config: FieldConfig<any, any>) {
                    (this as any)._fieldConfig = config;
                    return this;
                },
                writable: true,
                configurable: true,
            });
        }

        // Extend max schema prototype (z.string().max())
        const maxPrototype = Object.getPrototypeOf(z.string().max(100));
        if (maxPrototype && maxPrototype !== zodTypePrototype) {
            Object.defineProperty(maxPrototype, 'fieldConfig', {
                value(config: FieldConfig<any, any>) {
                    (this as any)._fieldConfig = config;
                    return this;
                },
                writable: true,
                configurable: true,
            });
        }

        // Extend object schema prototype
        const objectPrototype = Object.getPrototypeOf(z.object({}));
        if (objectPrototype && objectPrototype !== zodTypePrototype) {
            Object.defineProperty(objectPrototype, 'fieldConfig', {
                value(config: FieldConfig<any, any>) {
                    (this as any)._fieldConfig = config;
                    return this;
                },
                writable: true,
                configurable: true,
            });
        }

        // Extend array schema prototype
        const arrayPrototype = Object.getPrototypeOf(z.array(z.string()));
        if (arrayPrototype && arrayPrototype !== zodTypePrototype) {
            Object.defineProperty(arrayPrototype, 'fieldConfig', {
                value(config: FieldConfig<any, any>) {
                    (this as any)._fieldConfig = config;
                    return this;
                },
                writable: true,
                configurable: true,
            });
        }

        // Extend optional schema prototype
        const optionalPrototype = Object.getPrototypeOf(z.optional(z.string()));
        if (optionalPrototype && optionalPrototype !== zodTypePrototype) {
            Object.defineProperty(optionalPrototype, 'fieldConfig', {
                value(config: FieldConfig<any, any>) {
                    (this as any)._fieldConfig = config;
                    return this;
                },
                writable: true,
                configurable: true,
            });
        }

        // Extend nullable schema prototype
        const nullablePrototype = Object.getPrototypeOf(z.nullable(z.string()));
        if (nullablePrototype && nullablePrototype !== zodTypePrototype) {
            Object.defineProperty(nullablePrototype, 'fieldConfig', {
                value(config: FieldConfig<any, any>) {
                    (this as any)._fieldConfig = config;
                    return this;
                },
                writable: true,
                configurable: true,
            });
        }

        // Extend default schema prototype
        const defaultPrototype = Object.getPrototypeOf(z.string().default(''));
        if (defaultPrototype && defaultPrototype !== zodTypePrototype) {
            Object.defineProperty(defaultPrototype, 'fieldConfig', {
                value(config: FieldConfig<any, any>) {
                    (this as any)._fieldConfig = config;
                    return this;
                },
                writable: true,
                configurable: true,
            });
        }

        // Extend boolean schema prototype
        const booleanPrototype = Object.getPrototypeOf(z.boolean());
        if (booleanPrototype && booleanPrototype !== zodTypePrototype) {
            Object.defineProperty(booleanPrototype, 'fieldConfig', {
                value(config: FieldConfig<any, any>) {
                    (this as any)._fieldConfig = config;
                    return this;
                },
                writable: true,
                configurable: true,
            });
        }

        // Extend number schema prototype
        const numberPrototype = Object.getPrototypeOf(z.number());
        if (numberPrototype && numberPrototype !== zodTypePrototype) {
            Object.defineProperty(numberPrototype, 'fieldConfig', {
                value(config: FieldConfig<any, any>) {
                    (this as any)._fieldConfig = config;
                    return this;
                },
                writable: true,
                configurable: true,
            });
        }

        // Extend refinement schema prototype (for validations like email, url, etc.)
        const refinementPrototype = Object.getPrototypeOf(z.string().refine(() => true));
        if (refinementPrototype && refinementPrototype !== zodTypePrototype) {
            Object.defineProperty(refinementPrototype, 'fieldConfig', {
                value(config: FieldConfig<any, any>) {
                    (this as any)._fieldConfig = config;
                    return this;
                },
                writable: true,
                configurable: true,
            });
        }

        // Extend validation schema prototype (for validations like min, max, etc.)
        const validationPrototype = Object.getPrototypeOf(z.string().min(1));
        if (validationPrototype && validationPrototype !== zodTypePrototype) {
            Object.defineProperty(validationPrototype, 'fieldConfig', {
                value(config: FieldConfig<any, any>) {
                    (this as any)._fieldConfig = config;
                    return this;
                },
                writable: true,
                configurable: true,
            });
        }
    } catch (error) {
        console.warn('Some Zod prototypes could not be extended:', error);
    }

    return z;
}

// Execute the extension immediately when this module is imported
extendZodWithFieldConfig();

// Helper function to get field configuration from a schema
export function getFieldConfig<T = FieldConfig<any, any>>(schema: z.ZodTypeAny): T | undefined {
    return (schema as any)._fieldConfig;
}

// Helper function to set field configuration on an existing schema
export function setFieldConfig<T = FieldConfig<any, any>>(
    schema: z.ZodTypeAny,
    config: T,
): z.ZodTypeAny {
    (schema as any)._fieldConfig = config;
    return schema;
}

// Export the wrapper function for manual use
export { addFieldConfig };
