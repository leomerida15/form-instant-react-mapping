import { useReducer, useRef } from 'react';
import { InputMapping } from './class';
import { InputMappingContext } from './context';
import { useContext } from 'use-context-selector';

export const useInputMapping = () => {
    const initialState = useContext(InputMappingContext);
    const mapRef = useRef(initialState);
    const [, reRender] = useReducer((x) => x + 1, 0);

    mapRef.current.set = (...args) => {
        InputMapping.prototype.set.apply(mapRef.current, args);
        reRender();
        return mapRef.current;
    };

    mapRef.current.clear = (...args) => {
        InputMapping.prototype.clear.apply(mapRef.current, args);
        reRender();
    };

    mapRef.current.delete = (...args) => {
        const res = InputMapping.prototype.delete.apply(mapRef.current, args);
        reRender();

        return res;
    };

    return mapRef.current;
};
