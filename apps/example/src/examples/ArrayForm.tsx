import {
	FormInstantElement,
	FormInstantProvider,
	useFields,
} from '@form-instant/react-resolver-zod';
import { ElementMapping, useInputArray } from '@form-instant/react-input-mapping';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Fragment, useId, type FormEvent } from 'react';

/**
 * Array form schema with dynamic arrays
 */
const arrayFormSchema = z.object({
	items: z
		.array(
			z.object({
				name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
				quantity: z.number().min(1, 'La cantidad debe ser al menos 1'),
				price: z.number().min(0, 'El precio debe ser positivo'),
			}),
		)
		.min(1, 'Debe haber al menos un item')
		.max(10, 'Máximo 10 items'),
	skills: z
		.array(
			z.object({
				name: z
					.string()
					.min(2, 'El nombre de la habilidad debe tener al menos 2 caracteres'),
				level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
				years: z.number().min(0, 'Los años deben ser positivos'),
			}),
		)
		.min(1, 'Debe haber al menos una habilidad'),
});

/**
 * Custom component for array fields using useInputArray
 */
function ArrayFieldComponent({ name }: { name: 'items' | 'skills' }) {
	const field = useFields({ key: name });
	const { inputs, append, remove, fieldConfig } = useInputArray(field);
	const id = useId();

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center mb-2">
				<h4 className="font-medium">Items ({inputs.length})</h4>
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={append}
					disabled={inputs.length >= (fieldConfig?.max || 10)}
				>
					+ Agregar
				</Button>
			</div>
			{inputs.map((inputFields, index) => (
				<Fragment key={`${id}-${index}`}>
					<div className="border rounded-lg p-4 space-y-2">
						<div className="flex justify-between items-center mb-2">
							<span className="text-sm font-medium">Item #{index + 1}</span>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => remove(index)}
								disabled={inputs.length <= (fieldConfig?.min || 1)}
							>
								Eliminar
							</Button>
						</div>
						{Object.entries(inputFields).map(([key, value]) => (
							<ElementMapping formProps={value} />
						))}
					</div>
				</Fragment>
			))}
		</div>
	);
}

/**
 * Example: Array Form with dynamic arrays
 */
export function ArrayForm() {
	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const data = Object.fromEntries(formData.entries());
		alert('Formulario enviado! Revisa la consola para ver los datos.');
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Formulario Tipo Arreglo</CardTitle>
				<CardDescription>
					Ejemplo de formulario con arrays dinámicos: items de compra y habilidades.
					Puedes agregar y eliminar elementos.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-6">
					<FormInstantProvider schema={arrayFormSchema}>
						<div className="space-y-6">
							<div className="space-y-4">
								<h3 className="text-lg font-semibold">Items de Compra</h3>
								<ArrayFieldComponent name="items" />
							</div>

							<div className="space-y-4">
								<h3 className="text-lg font-semibold">Habilidades</h3>
								<ArrayFieldComponent name="skills" />
							</div>
						</div>
						<div className="mt-6">
							<Button type="submit">Enviar</Button>
						</div>
					</FormInstantProvider>
				</form>
			</CardContent>
		</Card>
	);
}
