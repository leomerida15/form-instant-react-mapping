import { InputMappingStore, type InputMapping } from "@pkg/react-input-mapping";


/**
 * Validates that a store instance is an InputMappingStore.
 * Single Responsibility: Validation logic.
 *
 * @param store - The store instance to validate.
 * @throws {Error} If the store is not an instance of InputMappingStore.
 */
export function validateStoreInstance<Ob extends Record<string, any>>(
	store: InputMapping<Ob>,
): asserts store is InputMappingStore<Ob> {
	if (!(store instanceof InputMappingStore)) {
		throw new Error(
			'InputMapping must be an instance of InputMappingStore for granular rendering',
		);
	}
}
