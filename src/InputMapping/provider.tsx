import { createElement } from 'react';
import { InputMapping } from './class';
import { InputMappingContext } from './context';
import { INPUT_COMPONENTS_KEYS, ParsedField } from './types';
import { useInputMapping } from './useInputMapping';

interface createFormInstantContainerRetuen<P = object, K extends string = INPUT_COMPONENTS_KEYS> {
    useInputMapping: () => InputMapping<P, K>;
    FormInstantInputsProvider: FCC;
}

export const createFormInstantContainer = <P = object, K extends string = INPUT_COMPONENTS_KEYS>(
    inputMapping: InputMapping<P, K>,
) => {
    const FormInstantInputsProvider: FCC = (props) =>
        createElement(InputMappingContext.Provider, {
            value: inputMapping as InputMapping,
            children: props.children,
        });

    return {
        FormInstantInputsProvider,
        useInputMapping,
    } as createFormInstantContainerRetuen<P, K>;
};

export const ElementMapping: FC<{ formProps: ParsedField<any, string> }> = ({ formProps }) => {
    const InputMapping = useInputMapping();

    const type = formProps.fieldConfig?.type || formProps.type;

    const Element = InputMapping.get(type);

    if (!Element) return null;

    return createElement(Element, formProps);
};
