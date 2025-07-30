import { Context, createElement, FC, ReactNode, useContext } from 'react';
import { InputMapping } from './class';
import { InputMappingContext } from './context';
import { ObBase, ParsedField } from './types';

type FCC = React.FC<{ children: ReactNode }>;

interface createFormInstantContainerReturn<Ob extends Record<ObBase, any>> {
  useInputMapping: Context<InputMapping<Ob>>;
  FormInstantInputsProvider: FCC;
}

export const createFormInstantContainer = <Ob extends Record<any, any>>(
  inputMapping: InputMapping<Ob>
) => {
  const FormInstantInputsProvider: FCC = (props) =>
    createElement(InputMappingContext.Provider, {
      value: inputMapping,
      children: props.children,
    });

  const useInputMapping = () => useContext(InputMappingContext);

  return {
    FormInstantInputsProvider,
    useInputMapping,
  } as unknown as createFormInstantContainerReturn<Ob>;
};

export const ElementMapping: FC<{ formProps: ParsedField<any, string> }> = ({ formProps }) => {
  if (!InputMappingContext) return null;

  const InputMapping = useContext(InputMappingContext);

  const type = formProps.fieldType;

  const Element = InputMapping.get(type);

  if (!Element) return null;

  return createElement(Element, formProps);
};
