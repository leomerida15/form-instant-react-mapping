import { describe, it, expect } from 'bun:test';
import { z } from 'zod';
import { parseSchema } from '../src/utils/schemaParser';

describe('Debug Schema Parser', () => {
    it('should debug simple schema', () => {
        const schema = z.object({
            name: z.string(),
        });

        const metadata = parseSchema(schema);

        expect(metadata.fields).toBeDefined();
    });
});
