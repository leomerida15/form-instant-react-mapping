import type { InputMapping } from '@pkg/react-input-mapping';
import { useInputComponent } from '../hooks/use-input-component';
import { useInputMappingActions } from '../hooks/use-input-mapping-actions';

/**
 * Factory function to create granular hooks for InputMapping.
 * Returns hooks that enable granular rendering by subscribing only to specific fieldType changes.
 * Single Responsibility: Factory for creating hook instances.
 *
 * @template Ob - The object structure defining the Inputs.
 * @param InputMappingContext - React Context containing the InputMapping instance.
 * @returns Object with hooks for granular component access and actions.
 */
export function createInputMappingGranularHook<Ob extends Record<string, any>>(
	InputMappingContext: React.Context<InputMapping<Ob> | null> | React.Context<InputMapping<Ob>>,
) {
	/**
	 * Hook to get a component for a specific fieldType with granular subscription.
	 * Only re-renders when the component for this specific fieldType changes.
	 *
	 * @param fieldType - The fieldType to get the component for.
	 * @returns The React component for the fieldType, or undefined if not found.
	 */
	function useInputComponentHook(fieldType: string) {
		return useInputComponent(InputMappingContext, fieldType);
	}

	/**
	 * Hook to get stable methods for modifying the InputMapping.
	 * Methods don't change between renders and don't cause global re-renders.
	 *
	 * @returns Object with set, clear, and delete methods.
	 */
	function useInputMappingActionsHook() {
		return useInputMappingActions(InputMappingContext);
	}

	return {
		useInputComponent: useInputComponentHook,
		useInputMappingActions: useInputMappingActionsHook,
	};
}
