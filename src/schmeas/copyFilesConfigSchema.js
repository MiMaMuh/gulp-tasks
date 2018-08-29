// @flow
const yup = require('yup');
const permissionsSchema = require('./permissionConfigSchema');

// Example setup for error outputs:
const EXAMPLE_SHAPE = {
	copy: [
		{
			from: './dist/',
			to: './../backend/web',
			extensions: ['css', 'css.map'],
			includeSubDirs: false,
			removeSrcFiles: false,
			removeDistFiles: true,
		},
	],
};

const copyCommandSchemaErrors = {
	from:
		'"from" has to be an string value. Use "from" to specify from which folder you want to copy files.',
	to:
		'"to" has to be an string value. Use "to" to specify to which folder you want to copy the files.',
	extensions:
		'"extensions" has to be an string value. Use "extensions" to specify which files should be copied based on their extension.',
	includeSubDirs:
		'"includeSubDirs" has to be a boolean value. Use "includeSubDirs" when you also want to copy files from subdirectories. Defaults to "false". Files copied from subdirectories keep their folder structure.',
	removeSrcFiles:
		'"removeSrcFiles" has to be a boolean value. Use "removeSrcFiles" when source files should be deleted after they have been copied to their destination. Defaults to "false".',
	removeDistFiles:
		'"removeDistFiles" has to be a boolean value. Use "removeDistFiles" when files in the destination directory should be removed before new files will be copied there. It only removes files which match the same extension patterns like the source files. Defaults to "false".',
};
const copyCommandSchema = yup.object().shape({
	from: yup
		.string()
		.required(copyCommandSchemaErrors.from)
		.typeError(copyCommandSchemaErrors.from),

	to: yup
		.string()
		.required(copyCommandSchemaErrors.to)
		.typeError(copyCommandSchemaErrors.to),

	extensions: yup
		.array()
		.of(
			yup
				.string(copyCommandSchemaErrors.extensions)
				.typeError(copyCommandSchemaErrors.extensions)
		)
		.required()
		.min(1)
		.ensure(),

	includeSubDirs: yup
		.boolean()
		.default(false)
		.typeError(copyCommandSchemaErrors.includeSubDirs),

	removeSrcFiles: yup
		.boolean()
		.default(false)
		.typeError(copyCommandSchemaErrors.removeSrcFiles),

	removeDistFiles: yup
		.boolean()
		.default(false)
		.typeError(copyCommandSchemaErrors.removeDistFiles),
});

const schemaErrors = {
	copy: `"config.copy" is a required field. Use it to specify all your copy commands using the following structure: \n\n${JSON.stringify(
		EXAMPLE_SHAPE,
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
	// "copy" includes a array of copy instructions
	copy: yup
		.array()
		.of(copyCommandSchema)
		.required(schemaErrors.copy)
		.ensure()
		.typeError(schemaErrors.copy),
});
