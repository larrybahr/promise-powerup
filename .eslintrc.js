const path = require('path');
module.exports = {
	parser: '@typescript-eslint/parser', // Specifies the ESLint parser
	plugins: [
		'@typescript-eslint',
	],
	env: {
		browser: true,
	},
	extends: [
		//'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
	],
	parserOptions: {
		project: path.resolve(__dirname, 'tsconfig.json'),
		tsconfigRootDir: __dirname,
		ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
		sourceType: 'module', // Allows for the use of imports
	},
	rules: {
		// Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
		// e.g. '@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/camelcase': 'off',
		'@typescript-eslint/indent': ['error', 'tab'],
		'@typescript-eslint/semi': ['error', 'always'],
		'quotes': ['error', 'single', { 'avoidEscape': true }],
		'comma-dangle': ['error', 'never'],
		'object-curly-spacing': ['error', 'always'],
		'arrow-parens': ['error', 'always'],
		'linebreak-style': ['error', 'unix'],
		'no-async-promise-executor': 'error',
		'no-dupe-args': 'error',
		'no-regex-spaces': 'error',
		'curly': ['error', 'all'],
		'no-floating-decimal': 'error',
		'no-multi-spaces': 'error',
		'eslint wrap-iife': ["error", "inside"],
		'yoda': ["error", "always"],
		'array-bracket-newline': ["error", "always"],
		'brace-style': ["error", "allman"],
		'comma-spacing': ["error", { "before": false, "after": true }]
	},
};