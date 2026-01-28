import type { Context, FC, ReactNode } from 'react';
import { createElement, memo, use } from 'react';
import { InputMapping } from './class';
import { InputMappingContext } from './context';
import type { FieldMetadata, ObBase, ParsedField } from './types';
import {
	createInputMappingGranularHook,
	InputMappingStore,
} from '../hooks/useInputMappingGranular';

type FCC = React.FC<{ children: ReactNode }>;

interface createFormInstantContainerReturn<Ob extends Record<ObBase, any>> {
	useInputMapping: Context<InputMapping<Ob>>;
	FormInstantInputsProvider: FCC;
}

// Create the granular hook once for reuse
// Cast to match the expected type (InputMappingContext is typed as non-null but internally allows null)
const granularHooks = createInputMappingGranularHook(
	InputMappingContext as React.Context<InputMapping<any> | null>,
);

/**
 * Creates a form instant container with granular rendering enabled by default.
 * Automatically converts InputMapping to InputMappingStore if needed.
 *
 * @template Ob - The object structure defining the Inputs.
 * @param inputMapping - InputMapping or InputMappingStore instance.
 * @returns Object with FormInstantInputsProvider and useInputMapping hook.
 */
export const createFormInstantContainer = <Ob extends Record<any, any>>(
	inputMapping: InputMapping<Ob> | InputMappingStore<Ob>,
) => {
	// Convert InputMapping to InputMappingStore if needed for granular rendering
	const store: InputMappingStore<Ob> =
		inputMapping instanceof InputMappingStore
			? inputMapping
			: new InputMappingStore(Object.fromEntries(inputMapping.entries()) as any);

	const FormInstantInputsProvider: FCC = (props) =>
		createElement(
			InputMappingContext.Provider,
			{
				value: store,
			},
			props.children,
		);

	const useInputMapping = () => use(InputMappingContext);

	return {
		FormInstantInputsProvider,
		useInputMapping,
	} as unknown as createFormInstantContainerReturn<Ob>;
};

/**
 * Component that renders the appropriate input component based on fieldType.
 * Uses granular rendering to only re-render when the specific fieldType's component changes.
 *
 * @param formProps - The parsed field properties including fieldType and name.
 */
export const ElementMapping: FC<{ formProps: FieldMetadata }> = memo(
	({ formProps }) => {
		const Element =
			granularHooks.useInputComponent(formProps.fieldType) ||
			granularHooks.useInputComponent('fallback');

		if (!Element) return null;

		return createElement(Element, formProps);
	},
	(prevProps, nextProps) => {
		// Only re-render if these specific values change
		return (
			prevProps.formProps.fieldType === nextProps.formProps.fieldType &&
			prevProps.formProps.name.history === nextProps.formProps.name.history &&
			prevProps.formProps.name.current === nextProps.formProps.name.current
		);
	},
);

ElementMapping.displayName = 'ElementMapping';
