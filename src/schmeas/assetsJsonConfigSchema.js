// @flow
const yup = require('yup');
const permissionsSchema = require('./permissionConfigSchema');

// Example setup for error outputs:
const EXAMPLE_SHAPE = {
	projectRoot: './../backend/',
	output: {
		assetsShouldBeRelativeTo: './web/',
		storeAssetsJsonTo: './',
	},
	include: [
		{
			from: './web/',
			extensions: ['css', 'js'],
			includeSubDirs: true,
		},
	],
};

const includeCommandSchema = yup.object().shape({
	from: yup
		.string()
		.required()
		.typeError(
			'"from" has to be an string value. Use "from" to specify from where you want to include assets to your assets.json.'
		),

	extensions: yup
		.array()
		.of(
			yup
				.string()
				.typeError(
					'"extensions" has to be an string value. Use "extensions" to specify which files should be included in your assets.json based on their extension.'
				)
		)
		.required()
		.min(1)
		.ensure(),

	includeSubDirs: yup
		.boolean()
		.default(false)
		.typeError(
			'"includeSubDirs" has to be a boolean value. Use "includeSubDirs" to spedify if files from subdirectories should be included. Defaults to "false".'
		),
});

const outputSchema = yup.object().shape({
	assetsShouldBeRelativeTo: yup
		.string()
		.default('/')
		.required()
		.typeError(
			'"assetsShouldBeRelativeTo" has to be a string value. Use "assetsShouldBeRelativeTo" to specify to which folder the assets in your assets.json file should be relative to. "assetsShouldBeRelativeTo" should be relative to "projectRoot".'
		),
	storeAssetsJsonTo: yup
		.string()
		.default('/')
		.required()
		.typeError(
			'"storeAssetsJsonTo" has to be a string value. Use "storeAssetsJsonTo" to specify where you want to store your assets.json file relative to "projectRoot".'
		),
});

module.exports = yup.object().shape({
	// some permissions concerning all tasks like
	// if the tasks are allowed to run outside of the
	// root directory or if the execution should be
	// a dry run for testing, ...
	permissions: permissionsSchema,
	projectRoot: yup
		.string()
		.required()
		.typeError(
			'"config.projectRoot" is a required field. Use "projectRoot" to specify where your project is located relative to your gulpfile.js'
		),
	output: outputSchema,
	// include is an array of objects which define
	// which files you wanna include in your assets.json
	include: yup
		.array()
		.of(includeCommandSchema)
		.required(
			`"config.include" is a required field. Use it to specify which files you want to include in your assets.json relative to "projectRoot", like: \n\n${JSON.stringify(
				EXAMPLE_SHAPE,
				null,
				'  '
			)}\n`
		)
		.ensure()
		.typeError(
			'"include" has to be an array. Use it to specify which files you want to include in your assets.json relative to "projectRoot".'
		),
});
