import { use, useSyncExternalStore } from 'react';
import type { FC } from 'react';
import { validateStoreInstance } from '../validators/store-validator';
import type { InputMappingStore } from '../../infrastructure/store/input-mapping-store';
import type { InputMapping } from '@pkg/react-input-mapping';

/**
 * Hook to get a component for a specific fieldType with granular subscription.
 * Only re-renders when the component for this specific fieldType changes.
 * Single Responsibility: Component retrieval with granular subscription.
 *
 * @param InputMappingContext - React Context containing the InputMapping instance.
 * @param fieldType - The fieldType to get the component for.
 * @returns The React component for the fieldType, or undefined if not found.
 */
export function useInputComponent<Ob extends Record<string, any>>(
	InputMappingContext: React.Context<InputMapping<Ob> | null> | React.Context<InputMapping<Ob>>,
	fieldType: string,
): FC<any> | undefined {
	// Normalize context type for use() hook compatibility
	const normalizedContext = InputMappingContext as React.Context<InputMapping<Ob> | null>;
	const store = use(normalizedContext)!;

	// Validate that the store is an instance of InputMappingStore
	validateStoreInstance(store);

	// Use useSyncExternalStore for granular subscription
	return useSyncExternalStore(
		(onStoreChange) => (store as InputMappingStore<Ob>).subscribe(fieldType, onStoreChange),
		() => store.get(fieldType),
		() => store.get(fieldType), // SSR snapshot
	);
}
