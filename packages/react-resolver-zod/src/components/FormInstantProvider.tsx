import { createContext, useContext, useMemo } from 'react';
import type { zodResolverProps } from '../types';
import { parseSchema } from '../utils/schemaParser';
import type { NestedKeys } from './FormInstantElement';
import type { FieldMetadata } from '@form-instant/react-input-mapping';

interface ZodResolverContextType {
	fields: Record<string, FieldMetadata>;
	schema: zodResolverProps;
}

export const ZodResolverContext = createContext<ZodResolverContextType | null>(null);

export const FormInstantProvider: FCC<{
	schema: zodResolverProps;
}> = ({ children, schema }) => {
	const fields = useMemo(() => parseSchema(schema).fields, [schema]);
	const value = useMemo(() => ({ schema, fields }), [schema, fields]);

	return <ZodResolverContext.Provider value={value}>{children}</ZodResolverContext.Provider>;
};

interface useFieldsProps<Sc extends Record<string, any>> {
	key: NestedKeys<Sc>;
}

/**
 * Hook to get a specific field by name from the schema
 */
export const useFields = <Sc extends Record<string, any>>({ key }: useFieldsProps<Sc>) => {
	const { fields } = useContext(ZodResolverContext)!;

	if (!fields) {
		throw new Error('useFields must be used within FormInstantProvider');
	}

	return fields[key as string]!;
};
