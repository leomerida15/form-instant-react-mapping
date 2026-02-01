
import { z } from 'zod';
import { parseSchema } from './schemaParser';
import { describe, expect, it } from 'bun:test';

describe('parseSchema', () => {
    it('should parse array of objects correctly returning array with structure object', () => {
        const schema = z.object({
            items: z.array(z.object({
                name: z.string(),
                quantity: z.number(),
            }))
        });

        const result = parseSchema(schema);
        const itemsField = result.fields['items'];

        expect(itemsField).toBeDefined();
        expect(itemsField!.fieldType).toBe('array');

        // The user wants the schema to be an array containing the structure map
        // instead of an array of the values field metadatas
        expect(Array.isArray(itemsField!.schema)).toBe(true);
        expect(itemsField!.schema).toHaveLength(1);

        const schemaArr = Array.isArray(itemsField!.schema) ? itemsField!.schema : [];
        const structure = schemaArr[0];
        // structure should be { name: FieldMetadata, quantity: FieldMetadata }
        // NOT FieldMetadata

        expect(structure).toBeDefined();
        expect(structure!).toHaveProperty('name');
        expect(structure!).toHaveProperty('quantity');

        expect(structure!.name!.name.current).toBe('name');
        expect(structure!.quantity!.name.current).toBe('quantity');
    });

    it('should parse nested objects with correct paths (no [0] index)', () => {
        const schema = z.object({
            address: z.object({
                street: z.string(),
                city: z.string(),
            })
        });

        const result = parseSchema(schema);
        const addressField = result.fields['address'];
        const streetField = result.fields['address.street'];

        expect(addressField).toBeDefined();
        expect(addressField!.fieldType).toBe('object'); // or 'unknown' if fieldType not set, checking default behavior

        expect(streetField).toBeDefined();
        expect(streetField!.name.history).toBe('address.street');
        expect(streetField!.name.history).not.toContain('[0]');
    });
});
