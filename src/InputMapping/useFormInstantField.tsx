import { useCallback, useState } from 'react';
import { ParsedField } from './types';

export const useFormInstantField = <P extends ParsedField<unknown, string>>({
    fieldConfig,
    name,
    ...prop
}: P) => {
    const [fiends, setFiends] = useState(Object.values((prop.schema as P['schema']) || {}));

    const append = useCallback(() => {
        if (![fieldConfig?.max].includes(fiends.length)) setFiends((pre) => [...pre, pre[0]]);
    }, [fiends, fieldConfig?.max]);

    const remove = useCallback(
        (index: number) => {
            if (![fieldConfig?.min].includes(fiends.length))
                setFiends((pre) => pre.filter((_, i) => i !== index));
        },
        [fiends, fieldConfig?.min],
    );

    return { fiends, append, remove, setFiends, fieldConfig, name, ...prop };
};
