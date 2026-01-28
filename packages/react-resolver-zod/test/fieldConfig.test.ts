import { describe, it, expect } from 'bun:test';
import { z } from 'zod';
import '../src/utils/zodExtensions'; // Import to extend Zod
import { parseSchema } from '../src/utils/schemaParser';

describe('fieldConfig Extension', () => {
    it('should add fieldConfig method to basic schemas', () => {
        const stringSchema = z.string();
        expect(typeof stringSchema.fieldConfig).toBe('function');

        const numberSchema = z.number();
        expect(typeof numberSchema.fieldConfig).toBe('function');

        const booleanSchema = z.boolean();
        expect(typeof booleanSchema.fieldConfig).toBe('function');
    });

    it('should add fieldConfig method to object schemas', () => {
        const objectSchema = z.object({});
        expect(typeof objectSchema.fieldConfig).toBe('function');
    });

    it('should store configuration in _fieldConfig property', () => {
        const config = {
            label: 'Test Field',
            placeholder: 'Enter test value',
        };

        const schema = z.string().fieldConfig(config);
        expect((schema as any)._fieldConfig).toEqual(config);
    });

    it('should work with custom properties', () => {
        const config = {
            label: 'Custom Field',
            customProperty: 'custom value',
            anotherCustom: 123,
        };

        const schema = z.string().fieldConfig(config);
        const storedConfig = (schema as any)._fieldConfig;

        expect(storedConfig.customProperty).toBe('custom value');
        expect(storedConfig.anotherCustom).toBe(123);
    });

    it('should work with object schemas', () => {
        const config = {
            label: 'User Object',
        };

        const schema = z
            .object({
                name: z.string(),
                email: z.string().email(),
            })
            .fieldConfig(config);

        expect((schema as any)._fieldConfig).toEqual(config);
    });

    it('should work with nested fieldConfig calls', () => {
        const schema = z.object({
            name: z.string().fieldConfig({
                label: 'Name',
            }),
            email: z.string().email().fieldConfig({
                label: 'Email',
            }),
        });

        const nameField = schema.shape.name;
        const emailField = schema.shape.email;

        expect((nameField as any)._fieldConfig.label).toBe('Name');
        expect((emailField as any)._fieldConfig.label).toBe('Email');
    });

    it('should extract fieldConfig in parseSchema', () => {
        const schema = z.object({
            name: z.string().fieldConfig({
                fieldType: 'text',
                label: 'Name',
                placeholder: 'Enter name',
            } as any),
            email: z
                .string()
                .email()
                .fieldConfig({
                    fieldType: 'email',
                    label: 'Email',
                    placeholder: 'Enter email',
                } as any),
        });

        const metadata = parseSchema(schema);

        // Check that fieldConfig is extracted
        expect(metadata.fields.name.fieldConfig).toBeDefined();
        expect(metadata.fields.email.fieldConfig).toBeDefined();

        // Check fieldType values
        expect(metadata.fields.name.fieldConfig.fieldType).toBe('text');
        expect(metadata.fields.email.fieldConfig.fieldType).toBe('email');

        // Check other properties
        expect(metadata.fields.name.fieldConfig.label).toBe('Name');
        expect(metadata.fields.email.fieldConfig.label).toBe('Email');
    });

    it('should handle schemas without fieldConfig', () => {
        const schema = z.object({
            name: z.string(),
            email: z.string().email(),
        });

        const metadata = parseSchema(schema);

        // Check that fieldConfig is undefined for fields without it
        expect(metadata.fields.name.fieldConfig).toBeUndefined();
        expect(metadata.fields.email.fieldConfig).toBeUndefined();
    });
});
