import React, { FC } from 'react';
import { InputMapping } from '../src/InputMapping/class';
import { createFormInstantContainer } from '../src/InputMapping/provider';
import { ObBase, INPUT_COMPONENTS_KEYS } from '../src/InputMapping/types';

// 1. Define un tipo Ob personalizado que incluya todas las keys de INPUT_COMPONENTS_KEYS
export type MyInputs = {
    text: { label: string; value: string; onChange: (v: string) => void };
    number: { label: string; value: number; onChange: (v: number) => void };
    checkbox: { label: string; checked: boolean; onChange: (v: boolean) => void };
    date: { label: string; value: string; onChange: (v: string) => void };
    select: {
        label: string;
        value: string;
        options: [string, string][];
        onChange: (v: string) => void;
    };
    radio: {
        label: string;
        value: string;
        options: [string, string][];
        onChange: (v: string) => void;
    };
    switch: { label: string; checked: boolean; onChange: (v: boolean) => void };
    textarea: { label: string; value: string; onChange: (v: string) => void };
    file: { label: string; onChange: (f: FileList | null) => void };
    fallback: { label: string };
};

// 2. Crea componentes para cada tipo
const TextInput: FC<MyInputs['text']> = ({ label, value, onChange }) => (
    <label>
        {label}
        <input value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
);
const NumberInput: FC<MyInputs['number']> = ({ label, value, onChange }) => (
    <label>
        {label}
        <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
);
const CheckboxInput: FC<MyInputs['checkbox']> = ({ label, checked, onChange }) => (
    <label>
        {label}
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
);
const DateInput: FC<MyInputs['date']> = ({ label, value, onChange }) => (
    <label>
        {label}
        <input type="date" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
);
const SelectInput: FC<MyInputs['select']> = ({ label, value, options, onChange }) => (
    <label>
        {label}
        <select value={value} onChange={(e) => onChange(e.target.value)}>
            {options.map(([val, lab]) => (
                <option key={val} value={val}>
                    {lab}
                </option>
            ))}
        </select>
    </label>
);
const RadioInput: FC<MyInputs['radio']> = ({ label, value, options, onChange }) => (
    <fieldset>
        <legend>{label}</legend>
        {options.map(([val, lab]) => (
            <label key={val}>
                <input type="radio" checked={value === val} onChange={() => onChange(val)} />
                {lab}
            </label>
        ))}
    </fieldset>
);
const SwitchInput: FC<MyInputs['switch']> = ({ label, checked, onChange }) => (
    <label>
        {label}
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
);
const TextareaInput: FC<MyInputs['textarea']> = ({ label, value, onChange }) => (
    <label>
        {label}
        <textarea value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
);
const FileInput: FC<MyInputs['file']> = ({ label, onChange }) => (
    <label>
        {label}
        <input type="file" onChange={(e) => onChange(e.target.files)} />
    </label>
);
const FallbackInput: FC<MyInputs['fallback']> = ({ label }) => <span>{label} (no input)</span>;

// 3. Crea el InputMapping con todas las keys
const inputMapping = new InputMapping<MyInputs>({
    text: TextInput,
    number: NumberInput,
    checkbox: CheckboxInput,
    date: DateInput,
    select: SelectInput,
    radio: RadioInput,
    switch: SwitchInput,
    textarea: TextareaInput,
    file: FileInput,
    fallback: FallbackInput,
});

// 4. Crea el contenedor y el provider
const { FormInstantInputsProvider, useInputMapping } =
    createFormInstantContainer<MyInputs>(inputMapping);

// Helper para obtener el componente con tipado seguro
function getInput<K extends keyof MyInputs>(mapping: InputMapping<MyInputs>, key: K) {
    return mapping.get(key) as FC<MyInputs[K]>;
}

// 5. Ejemplo de uso en un formulario
const ExampleForm = () => {
    const mapping = useInputMapping();
    const [text, setText] = React.useState('');
    const [number, setNumber] = React.useState(0);
    const [checked, setChecked] = React.useState(false);

    const Text = getInput(mapping, 'text');
    const Number = getInput(mapping, 'number');
    const Checkbox = getInput(mapping, 'checkbox');

    return (
        <form>
            {Text && <Text label="Nombre" value={text} onChange={setText} />}
            {Number && <Number label="Edad" value={number} onChange={setNumber} />}
            {Checkbox && (
                <Checkbox label="Acepto términos" checked={checked} onChange={setChecked} />
            )}
        </form>
    );
};

// 6. App principal
const App = () => (
    <FormInstantInputsProvider>
        <ExampleForm />
    </FormInstantInputsProvider>
);

export default App;
