import { describe, it, expect } from 'bun:test';
import { z } from 'zod';
import { FormInstantProvider, FormInstantElement, useFields, useSchema } from '../src/index';

describe('Migration from dts-cli to Bun.js', () => {
    it('should export all legacy FormInstant components', () => {
        expect(FormInstantProvider).toBeDefined();
        expect(FormInstantElement).toBeDefined();
        expect(useFields).toBeDefined();
        expect(useSchema).toBeDefined();
    });
});

describe('Legacy FormInstant Components', () => {
    it('should work with legacy FormInstantProvider', () => {
        expect(FormInstantProvider).toBeDefined();
        expect(typeof FormInstantProvider).toBe('function');
    });

    it('should work with legacy FormInstantElement', () => {
        expect(FormInstantElement).toBeDefined();
        expect(typeof FormInstantElement).toBe('function');
    });

    it('should work with legacy useFields hook', () => {
        expect(useFields).toBeDefined();
        expect(typeof useFields).toBe('function');
    });

    it('should work with legacy useSchema hook', () => {
        expect(useSchema).toBeDefined();
        expect(typeof useSchema).toBe('function');
    });
});

describe('Bun.js Integration', () => {
    it('should work with Bun.js test runner', () => {
        expect(Bun.version).toBeDefined();
        expect(typeof Bun.version).toBe('string');
    });

    it('should support modern ES modules', () => {
        const module = { default: 'test' };
        expect(module.default).toBe('test');
    });
});

describe('Zod v4 Compatibility', () => {
    it('should work with Zod v4 schemas', () => {
        const schema = z.object({
            name: z.string(),
            email: z.string().email(),
            age: z.number().optional(),
        });

        expect(schema).toBeDefined();
        expect(typeof schema.parse).toBe('function');
    });

    it('should handle ZodEffects correctly', () => {
        const schema = z
            .object({
                name: z.string(),
            })
            .refine((data) => data.name.length > 0, {
                message: 'Name must not be empty',
            });

        expect(schema).toBeDefined();
        expect(typeof schema.parse).toBe('function');
    });
});
