import { useReducer, useRef, use } from 'react';
import { InputMapping } from '../InputMapping/class';

export function createInputMappingHook<Ob extends Record<string, any>>(
	InputMappingContext: React.Context<InputMapping<Ob> | null>,
) {
	return function useInputMapping() {
		const initialState = use(InputMappingContext);
		if (!initialState) throw new Error('InputMappingContext not found');
		const mapRef = useRef(initialState);
		const [, reRender] = useReducer((x) => x + 1, 0);

		return {
			...mapRef.current,
			set: (key: keyof Ob | string, value: React.FC<any>) => {
				const result = mapRef.current.set(key, value);
				reRender();
				return result;
			},
			clear: () => {
				mapRef.current.clear();
				reRender();
			},
			delete: (key: keyof Ob | string) => {
				const result = mapRef.current.delete(key);
				reRender();
				return result;
			},
		};
	};
}
