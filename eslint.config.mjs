// Importar los plugins
import tseslint from 'typescript-eslint';

export default tseslint.defineConfig(
	// Configuración para los plugins
	{
		rules: {
			// Desactivar regla de curly
			curly: 'off',
		},
	},
	{ ignores: ['**/*.{mjs,cjs,js,d.ts,d.mts}'] },
	{
		files: ['**/*.story.tsx'],
		rules: {
			'no-console': 'off',
			'object-curly-spacing': 'off',
			// Desactivar reglas específicas para stories
			'@next/next/no-html-link-for-pages': 'off',
		},
	},
);
