import type { Context, FC, ReactNode } from 'react';
import { createElement, memo, use } from 'react';
import { InputMapping } from './class';
import { InputMappingContext } from './context';
import type { FieldMetadata, ObBase } from './types';
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
 *
 * Previously wrapped in React.memo with a custom comparator that only
 * checked `fieldType`, `name.history`, and `name.current`. That prevented
 * re-renders when `fieldConfig` or `required` changed, and also prevented
 * the child input component from receiving updated RHF form state in
 * certain React render cycles (e.g. when the parent re-renders due to
 * formState.errors but the formProps reference is stable).
 *
 * Removing the custom comparator lets React's default shallow comparison
 * decide re-renders while keeping the memo for pure performance. Input
 * components read `useFormContext()` internally and re-render reactively
 * when the form state changes — the memo should not block that.
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
);

ElementMapping.displayName = 'ElementMapping';
