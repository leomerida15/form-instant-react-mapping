import { useCallback, useState } from 'react';
import { ParsedField } from './types';

export const useFormInstantField = <P extends ParsedField<any, string>>({
    fieldConfig,
    name,
    ...prop
}: P) => {
    const [fiends, setFiends] = useState(Object.values(prop.schema || {}));

    const append = useCallback(() => {
        if (![fieldConfig?.max, fieldConfig?.maxLength].includes(fiends.length))
            setFiends((pre) => [...pre, pre[0]]);
    }, [fiends]);

    const remove = useCallback(
        (index: number) => {
            if (![fieldConfig?.min, fieldConfig?.minLength].includes(fiends.length))
                setFiends((pre) => pre.filter((_, i) => i !== index));
        },
        [fiends],
    );

    return { fiends, append, remove, setFiends, fieldConfig, name, ...prop };
};
