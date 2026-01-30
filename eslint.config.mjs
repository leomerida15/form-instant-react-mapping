import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		rules: {
			// Desactivar regla de curly
			curly: 'off',
			'@typescript-eslint/no-explicit-any': 'off',
		},
	},
	{ ignores: ['**/*.{mjs,cjs,js,d.ts,d.mts}'] },
	{
		files: ['**/*.story.tsx'],
		rules: {
			'no-console': 'off',
			'object-curly-spacing': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
		},
	},
];
