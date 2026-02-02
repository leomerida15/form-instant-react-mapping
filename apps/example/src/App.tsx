import { FormInstantInputsProvider } from '@/providers/input-mapping';
import { SimpleForm } from '@/examples/SimpleForm';
import { ObjectForm } from '@/examples/ObjectForm';
import { ArrayForm } from '@/examples/ArrayForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import './index.css';

export function App() {
	return (
		<FormInstantInputsProvider>
			<div className="container mx-auto p-8 space-y-8">
				<Card>
					<CardHeader className="text-center">
						<CardTitle className="text-4xl font-bold">Form Instant Examples</CardTitle>
						<CardDescription className="text-lg">
							Ejemplos de uso de @form-instant/react-input-mapping y
							@form-instant/react-resolver-zod
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-center text-muted-foreground">
							Explora los diferentes tipos de formularios: simples, objetos anidados y
							arrays dinámicos. Todos con renderizado granular optimizado.
						</p>
					</CardContent>
				</Card>

				<SimpleForm />
				<ObjectForm />
				<ArrayForm />
			</div>
		</FormInstantInputsProvider>
	);
}

export default App;
