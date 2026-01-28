// Import zodExtensions to ensure the extension is applied globally
import './utils/zodExtensions';

// FormInstant components (legacy compatibility)
export { FormInstantProvider, useFields } from './components/FormInstantProvider';
export { useSchema, getInitialValues } from './hooks/useSchema';
export { FormInstantElement } from './components/FormInstantElement';

// Types and utilities
export * from './types';

export * from './utils/schemaParser';

// Export addFieldConfig for manual use
export { addFieldConfig } from './utils/zodExtensions';
