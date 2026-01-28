import { FormInstantProvider, FormInstantElement } from '@form-instant/react-resolver-zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const objectFormSchema = z.object({
	personalData: z.object({
		firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
		lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
		email: z.email('Email inválido'),
		phone: z.string().min(10, 'Teléfono inválido'),
	}),
	address: z.object({
		street: z.string().min(5, 'La calle debe tener al menos 5 caracteres'),
		city: z.string().min(2, 'La ciudad debe tener al menos 2 caracteres'),
		zipCode: z.string().min(5, 'Código postal inválido'),
		country: z.string().min(2, 'País inválido'),
	}),
	preferences: z.object({
		theme: z.enum(['light', 'dark', 'auto']).default('light'),
		language: z.enum(['es', 'en', 'fr']).default('es'),
		notifications: z.boolean().default(true),
	}),
});

type ObjectFormType = z.infer<typeof objectFormSchema>;

export function ObjectForm() {
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const data = Object.fromEntries(formData.entries());
		alert('Formulario enviado! Revisa la consola para ver los datos.');
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Formulario Tipo Objeto</CardTitle>
				<CardDescription>
					Ejemplo de formulario con objetos anidados: datos personales, dirección y
					preferencias
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-6">
					<FormInstantProvider schema={objectFormSchema}>
						<div className="space-y-6">
							<div className="space-y-4 border-b pb-4">
								<h3 className="text-lg font-semibold">Datos Personales</h3>
								<FormInstantElement<ObjectFormType> name="personalData" />
							</div>

							<div className="space-y-4 border-b pb-4">
								<h3 className="text-lg font-semibold">Dirección</h3>
								<FormInstantElement<ObjectFormType> name="address" />
							</div>

							<div className="space-y-4">
								<h3 className="text-lg font-semibold">Preferencias</h3>
								<FormInstantElement<ObjectFormType> name="preferences" />
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
