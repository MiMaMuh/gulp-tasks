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

const includeCommandSchemaErrors = {
	from:
		'"from" has to be an string value. Use "from" to specify from where you want to include assets to your assets.json.',
	extensions:
		'"extensions" has to be an string value. Use "extensions" to specify which files should be included in your assets.json based on their extension.',
	includeSubDirs:
		'"includeSubDirs" has to be a boolean value. Use "includeSubDirs" to spedify if files from subdirectories should be included. Defaults to "false".',
};
const includeCommandSchema = yup.object().shape({
	from: yup
		.string()
		.required(includeCommandSchemaErrors.from)
		.typeError(includeCommandSchemaErrors.from),

	extensions: yup
		.array()
		.of(yup.string().typeError(includeCommandSchemaErrors.extensions))
		.required(includeCommandSchemaErrors.extensions)
		.min(1)
		.ensure(),

	includeSubDirs: yup
		.boolean()
		.default(false)
		.typeError(includeCommandSchemaErrors.includeSubDirs),
});

const outputSchemaErrors = {
	assetsShouldBeRelativeTo:
		'"assetsShouldBeRelativeTo" has to be a string value. Use "assetsShouldBeRelativeTo" to specify to which folder the assets in your assets.json file should be relative to. "assetsShouldBeRelativeTo" should be relative to "projectRoot".',
	storeAssetsJsonTo:
		'"storeAssetsJsonTo" has to be a string value. Use "storeAssetsJsonTo" to specify where you want to store your assets.json file relative to "projectRoot".',
};
const outputSchema = yup.object().shape({
	assetsShouldBeRelativeTo: yup
		.string()
		.default('/')
		.required(outputSchemaErrors.assetsShouldBeRelativeTo)
		.typeError(outputSchemaErrors.assetsShouldBeRelativeTo),
	storeAssetsJsonTo: yup
		.string()
		.default('/')
		.required(outputSchemaErrors.storeAssetsJsonTo)
		.typeError(outputSchemaErrors.storeAssetsJsonTo),
});

const schemaErrors = {
	projectRoot:
		'"config.projectRoot" is a required field. Use "projectRoot" to specify where your project is located relative to your gulpfile.js',
	output: `"config.output" is a required field. Use it to specify how your assets.json output should look like. It has a form like: \n\n${JSON.stringify(
		EXAMPLE_SHAPE.output,
		null,
		'  '
	)}\n`,
	include: `"config.include" is a required field. Use it to specify which files you want to include in your assets.json relative to "projectRoot", like: \n\n${JSON.stringify(
		EXAMPLE_SHAPE.include,
		null,
		'  '
	)}\n`,
};
module.exports = yup.object().shape({
	// some permissions concerning all tasks like
	// if the tasks are allowed to run outside of the
	// root directory or if the execution should be
	// a dry run for testing, ...
	permissions: permissionsSchema,
	// Use "projectRoot" to specify where your project is
	// located relative to your gulpfile.js
	projectRoot: yup
		.string()
		.required(schemaErrors.projectRoot)
		.typeError(schemaErrors.projectRoot),
	// specify output options ...
	output: outputSchema
		.required(schemaErrors.output)
		.typeError(schemaErrors.output),
	// include is an array of objects which define
	// which files you wanna include in your assets.json
	include: yup
		.array()
		.of(includeCommandSchema)
		.required(schemaErrors.include)
		.ensure()
		.typeError(schemaErrors.include),
});
