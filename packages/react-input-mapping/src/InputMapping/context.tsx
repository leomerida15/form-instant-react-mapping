import { createContext } from 'react';
import { InputMapping } from './class';

export const InputMappingContext = createContext<InputMapping<any> | null>(null) as React.Context<
	InputMapping<any>
>;
