import { createContext } from 'react';
import { InputMapping } from './class';

export const InputMappingContext = createContext<InputMapping>(new InputMapping());
