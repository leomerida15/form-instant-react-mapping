import type { FieldMetadata } from '@form-instant/react-input-mapping';
import type { ReactNode } from 'react';

// Core schema types - compatible with Zod v4
export type ZodSchema = any;

// Component mapping types
export type ComponentMapping = Record<string, React.ComponentType<any>>;

// Path resolver types
export type SchemaPath = string; // e.g., "user.profile.email"
export type PathSegment = string;

// Field configuration types based on old FieldConfig
export type FieldConfig<Ob, K extends keyof Ob = keyof Ob> = {
    fieldType: K;
} & Ob[K];



// Schema metadata types
export interface SchemaMetadata {
    fields: Record<string, FieldMetadata>;
    paths: SchemaPath[];
    structure: Record<string, any>;
}

// Mapping configuration types
export interface MappingConfig {
    componentMapping: ComponentMapping;
    defaultComponent?: React.ComponentType<any>;
    transformProps?: (props: any) => any;
}

// Hook return types
export interface SchemaMappingResult {
    schema: ZodSchema;
    metadata: SchemaMetadata;
    mappingConfig: MappingConfig;
}

export interface SchemaNavigationResult {
    navigate: (path: SchemaPath) => FieldMetadata | null;
    getField: (path: SchemaPath) => FieldMetadata | null;
    getPaths: () => SchemaPath[];
    hasPath: (path: SchemaPath) => boolean;
}

export interface SchemaMetadataResult {
    metadata: SchemaMetadata;
    getField: (path: SchemaPath) => FieldMetadata | null;
    getPaths: () => SchemaPath[];
    getStructure: () => Record<string, any>;
}

// Legacy compatibility types
export type zodResolverProps = ZodSchema;

// Component props types
export interface SchemaMapperProps {
    schema: ZodSchema;
    componentMapping: ComponentMapping;
    defaultComponent?: React.ComponentType<any>;
    transformProps?: (props: any) => any;
    children?: ReactNode;
}

export interface ElementProps<Schema extends Record<string, any>> {
    name: keyof Schema;
}
