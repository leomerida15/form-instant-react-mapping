import { use, useMemo } from 'react';
import { validateStoreInstance } from '../validators/store-validator';
import type { InputMappingStore } from '../../infrastructure/store/input-mapping-store';
import type { InputMapping } from '@pkg/react-input-mapping';

/**
 * Hook to get stable methods for modifying the InputMapping.
 * Methods don't change between renders and don't cause global re-renders.
 * Single Responsibility: Provide stable action methods.
 *
 * @template Ob - The object structure defining the Inputs.
 * @param InputMappingContext - React Context containing the InputMapping instance.
 * @returns Object with set, clear, and delete methods.
 */
export function useInputMappingActions<Ob extends Record<string, any>>(
	InputMappingContext: React.Context<InputMapping<Ob> | null> | React.Context<InputMapping<Ob>>,
) {
	// Normalize context type for use() hook compatibility
	const normalizedContext = InputMappingContext as React.Context<InputMapping<Ob> | null>;
	const store = use(normalizedContext)!;

	// Validate that the store is an instance of InputMappingStore
	validateStoreInstance(store);

	const storeInstance = store as InputMappingStore<Ob>;

	return useMemo(
		() => ({
			set: (key: keyof Ob | string, value: React.FC<any>) => {
				return storeInstance.set(key, value);
			},
			clear: () => {
				storeInstance.clear();
			},
			delete: (key: keyof Ob | string) => {
				return storeInstance.delete(key);
			},
		}),
		[storeInstance],
	);
}
