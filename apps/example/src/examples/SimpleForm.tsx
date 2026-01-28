import { FormInstantProvider, FormInstantElement } from '@form-instant/react-resolver-zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/**
 * Simple form schema with basic field types
 */
const simpleFormSchema = z.object({
	name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
	email: z.string().email('Email inválido'),
	age: z.number().min(18, 'Debes ser mayor de 18 años').max(100, 'Edad inválida'),
	birthday: z.coerce.date(),
	bio: z.string().min(10, 'La biografía debe tener al menos 10 caracteres'),
	newsletter: z.boolean().default(false),
});

type SimpleFormType = z.infer<typeof simpleFormSchema>;

/**
 * Example: Simple Form with basic field types
 */
export function SimpleForm() {
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const data = Object.fromEntries(formData.entries());
		alert('Formulario enviado! Revisa la consola para ver los datos.');
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Formulario Simple</CardTitle>
				<CardDescription>
					Ejemplo de formulario con campos básicos: texto, email, número, fecha, textarea
					y checkbox
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<FormInstantProvider schema={simpleFormSchema}>
						<div className="space-y-4">
							<FormInstantElement<SimpleFormType> name="name" />
							<FormInstantElement<SimpleFormType> name="email" />
							<FormInstantElement<SimpleFormType> name="age" />
							<FormInstantElement<SimpleFormType> name="birthday" />
							<FormInstantElement<SimpleFormType> name="bio" />
							<FormInstantElement<SimpleFormType> name="newsletter" />
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
