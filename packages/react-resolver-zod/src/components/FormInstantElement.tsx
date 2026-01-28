import { Fragment, useId } from 'react';
import { ElementMapping } from '@form-instant/react-input-mapping';
import { useFields } from './FormInstantProvider';

export type NestedKeys<T> = {
	[K in keyof T]: T[K] extends Record<string, any>
		? K | `${K & string}.${keyof T[K] & string}`
		: K;
}[keyof T];

export interface ElementProps<S extends Record<string, any>> {
	name: NestedKeys<S>;
}

export const FormInstantElement = <S extends Record<string, any>>({ name }: ElementProps<S>) => {
	const field = useFields({ key: name });

	const id = useId();

	if (!['object'].includes(field.fieldType)) return <ElementMapping formProps={field as any} />;

	return (
		<>
			{Object.values(field.schema || {}).map((props: any) => {
				return (
					<Fragment key={`${id}-${props.name?.history || ''}`}>
						<ElementMapping formProps={props} />
					</Fragment>
				);
			})}
		</>
	);
};
