import {
	InputMappingStore,
	createFormInstantContainer,
	type ParsedField,
	type FieldConfig,
} from '@form-instant/react-input-mapping';
import type { FC } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export type MyInputs = {
	text: FieldConfig<{ placeholder?: string }>;
	number: FieldConfig<{ placeholder?: string }>;
	textarea: FieldConfig<{ placeholder?: string }>;
	date: FieldConfig;
	email: FieldConfig<{ placeholder?: string }>;
	password: FieldConfig<{ placeholder?: string }>;
	checkbox: FieldConfig;
	select: FieldConfig;
	fallback: FieldConfig;
};

const TextInput: FC<ParsedField<MyInputs['text']>> = ({
	name,
	fieldConfig,
	required,
	...props
}) => {
	const label = (fieldConfig as any)?.label || name.current;
	const placeholder = (fieldConfig as any)?.placeholder || '';

	return (
		<div className="space-y-2">
			<Label htmlFor={name.current}>
				{label}
				{required && <span className="text-red-500 ml-1">*</span>}
			</Label>
			<Input
				id={name.current}
				name={name.history}
				type="text"
				placeholder={placeholder}
				required={required}
				{...props}
			/>
		</div>
	);
};

const NumberInput: FC<ParsedField<MyInputs['number']>> = ({
	name,
	fieldConfig,
	required,
	...props
}) => {
	const label = (fieldConfig as any)?.label || name.current;
	const placeholder = (fieldConfig as any)?.placeholder || '';

	return (
		<div className="space-y-2">
			<Label htmlFor={name.current}>
				{label}
				{required && <span className="text-red-500 ml-1">*</span>}
			</Label>
			<Input
				id={name.current}
				name={name.history}
				type="number"
				placeholder={placeholder}
				required={required}
				min={fieldConfig?.min}
				max={fieldConfig?.max}
				{...props}
			/>
		</div>
	);
};

const TextareaInput: FC<ParsedField<MyInputs['textarea']>> = ({
	name,
	fieldConfig,
	required,
	...props
}) => {
	const label = (fieldConfig as any)?.label || name.current;
	const placeholder = (fieldConfig as any)?.placeholder || '';

	return (
		<div className="space-y-2">
			<Label htmlFor={name.current}>
				{label}
				{required && <span className="text-red-500 ml-1">*</span>}
			</Label>
			<Textarea
				id={name.current}
				name={name.history}
				placeholder={placeholder}
				required={required}
				{...props}
			/>
		</div>
	);
};

const DateInput: FC<ParsedField<MyInputs['date']>> = ({
	name,
	fieldConfig,
	required,
	...props
}) => {
	const label = (fieldConfig as any)?.label || name.current;

	return (
		<div className="space-y-2">
			<Label htmlFor={name.current}>
				{label}
				{required && <span className="text-red-500 ml-1">*</span>}
			</Label>
			<Input
				id={name.current}
				name={name.history}
				type="date"
				required={required}
				{...props}
			/>
		</div>
	);
};

const EmailInput: FC<ParsedField<MyInputs['email']>> = ({
	name,
	fieldConfig,
	required,
	...props
}) => {
	const label = (fieldConfig as any)?.label || name.current;
	const placeholder = (fieldConfig as any)?.placeholder || '';

	return (
		<div className="space-y-2">
			<Label htmlFor={name.current}>
				{label}
				{required && <span className="text-red-500 ml-1">*</span>}
			</Label>
			<Input
				id={name.current}
				name={name.history}
				type="email"
				placeholder={placeholder}
				required={required}
				{...props}
			/>
		</div>
	);
};

const PasswordInput: FC<ParsedField<MyInputs['password']>> = ({
	name,
	fieldConfig,
	required,
	...props
}) => {
	const label = (fieldConfig as any)?.label || name.current;
	const placeholder = (fieldConfig as any)?.placeholder || '';

	return (
		<div className="space-y-2">
			<Label htmlFor={name.current}>
				{label}
				{required && <span className="text-red-500 ml-1">*</span>}
			</Label>
			<Input
				id={name.current}
				name={name.history}
				type="password"
				placeholder={placeholder}
				required={required}
				{...props}
			/>
		</div>
	);
};

const CheckboxInput: FC<ParsedField<MyInputs['checkbox']>> = ({
	name,
	fieldConfig,
	required,
	default: defaultValue,
	...props
}) => {
	const label = (fieldConfig as any)?.label || name.current;

	return (
		<div className="flex items-center space-x-2">
			<input
				id={name.current}
				name={name.history}
				type="checkbox"
				defaultChecked={defaultValue as boolean}
				required={required}
				className="h-4 w-4 rounded border-gray-300"
				{...props}
			/>
			<Label htmlFor={name.current} className="cursor-pointer">
				{label}
				{required && <span className="text-red-500 ml-1">*</span>}
			</Label>
		</div>
	);
};

const SelectInput: FC<ParsedField<MyInputs['select']>> = ({
	name,
	fieldConfig,
	options,
	required,
	...props
}) => {
	const label = (fieldConfig as any)?.label || name.current;

	return (
		<div className="space-y-2">
			<Label htmlFor={name.current}>
				{label}
				{required && <span className="text-red-500 ml-1">*</span>}
			</Label>
			<select
				id={name.current}
				name={name.history}
				required={required}
				className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
				{...props}
			>
				<option value="">Selecciona una opción</option>
				{options?.map(([optValue, optLabel]) => (
					<option key={optValue} value={optValue}>
						{optLabel}
					</option>
				))}
			</select>
		</div>
	);
};

const FallbackInput: FC<ParsedField<MyInputs['fallback']>> = ({
	name,
	fieldConfig,
	required,
	...props
}) => {
	const label = (fieldConfig as any)?.label || name.current;

	return (
		<div className="space-y-2">
			<Label htmlFor={name.current}>
				{label}
				{required && <span className="text-red-500 ml-1">*</span>}
			</Label>
			<Input
				id={name.current}
				name={name.history}
				type="text"
				required={required}
				{...props}
			/>
		</div>
	);
};

export const inputMapping = new InputMappingStore<MyInputs>({
	text: TextInput,
	number: NumberInput,
	textarea: TextareaInput,
	date: DateInput,
	email: EmailInput,
	password: PasswordInput,
	checkbox: CheckboxInput,
	select: SelectInput,
	fallback: FallbackInput,
});

export const { FormInstantInputsProvider, useInputMapping } =
	createFormInstantContainer<MyInputs>(inputMapping);
