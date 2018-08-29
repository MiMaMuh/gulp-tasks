module.exports = {
	env: {
		browser: true,
		es6: true,
	},
	parser: 'babel-eslint',
	parserOptions: {
		ecmaVersion: 9, // equals 2018
		ecmaFeatures: {
			jsx: true,
		},
		sourceType: 'module',
	},
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:jest/recommended',
		'plugin:jsx-a11y/recommended',
		'plugin:import/warnings',
		'plugin:import/errors',
		'airbnb',
		'prettier',
		'prettier/flowtype',
		'prettier/react',
	],
	plugins: [
		'flowtype',
		'flowtype-errors',
		'import',
		'promise',
		'compat',
		'react',
		'jest',
		'jsx-a11y',
	],
	settings: {
		'import/resolver': {
			webpack: {
				config: 'webpack.config.renderer.dev.js',
			},
		},
	},
	rules: {
		'no-bitwise': ['error', { allow: ['~'] }],
		'no-plusplus': 0,
		quotes: ['error', 'single', { avoidEscape: true }],
		semi: ['error', 'always'],

		// compat plugin
		'compat/compat': 'error',

		// promise plugin
		'promise/param-names': 'error',
		'promise/always-return': 'error',
		'promise/catch-or-return': 'error',
		'promise/no-native': 'off',
		'react/jsx-filename-extension': [
			'error',
			{ extensions: ['.js', '.jsx'] },
		],
		'no-underscore-dangle': [
			'error',
			{ allowAfterThis: true, allow: ['_id'] },
		],

		// react plugin
		'react/sort-comp': [
			2,
			{
				order: [
					'type-annotations',
					'static-methods',
					'lifecycle',
					'render',
					'everything-else',
				],
			},
		],
	},
};
