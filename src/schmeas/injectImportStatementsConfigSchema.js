// @flow
const yup = require('yup');

// Example setup for error outputs:
const EXAMPLE_SHAPE = {
	inject: './src/**/styles/*.scss',
	to: {
		file: './src/assets/scss/global.scss',
		between: {
			startTag: '/* inject:imports */',
			endTag: '/* endinject */',
		},
	},
	with: "@import '<%= path %>';",
};

const betweenSchemaErrors = {
	startTag:
		'"to.between.startTag" has to be an string value. Use "startTag" to specify between which start and end tag the import statements should be injected in your summary file.',
	endTag:
		'"to.between.endTag" has to be an string value. Use "endTag" to specify between which start and end tag the import statements should be injected in your summary file.',
};

const betweenSchema = yup.object().shape({
	startTag: yup
		.string()
		.required(betweenSchemaErrors.startTag)
		.typeError(betweenSchemaErrors.startTag),
	endTag: yup
		.string()
		.required(betweenSchemaErrors.endTag)
		.typeError(betweenSchemaErrors.endTag),
});

const toSchemaErrors = {
	file:
		'"to.file" has to be an string value. Use "to.file" to specify in which file you want to inject the import statements.',
	between: `"between" is a required field. Use "between" to specify between which start and end tag the import statements should be injected in your summary file using the following structure: \n\n${JSON.stringify(
		EXAMPLE_SHAPE.to.between,
		null,
		'  '
	)}\n`,
};
const toSchema = yup.object().shape({
	file: yup
		.string()
		.required(toSchemaErrors.to)
		.typeError(toSchemaErrors.to),
	between: betweenSchema
		.required(toSchemaErrors.between)
		.typeError(toSchemaErrors.between),
});

const schemaErrors = {
	inject:
		'"inject" has to be an Glob string value. Use "inject" to specify which files you want to be imported into your summary file.',
	to: `"to" is a required field. Use "to" to specify in which file you want to inject the import statements of the found files using the following structure: \n\n${JSON.stringify(
		EXAMPLE_SHAPE.to,
		null,
		'  '
	)}\n`,
	with:
		'"with" has to be an string value. Use "with" to define a template for your import statements using the underscore template syntax: https://lodash.com/docs/4.17.10#template.',
};
module.exports = yup.object().shape({
	// Glob string to find files to be
	// injected as import statements to your
	// summary file.
	inject: yup
		.string()
		.required(schemaErrors.inject)
		.typeError(schemaErrors.inject),

	// "copy" includes a array of copy instructions
	to: toSchema.required(schemaErrors.to).typeError(schemaErrors.to),

	// Template for the import statement.
	// It uses the lodash template syntax:
	// https://lodash.com/docs/4.17.10#template
	// Possible variables are:
	// <%= path %> 		'/home/user/dir/file.txt'
	// <%= base %> 		'file.txt'
	// <%= ext %> 		'.txt'
	// <%= dir %> 		'/home/user/dir'
	// <%= name %> 		'file'
	// <%= root %> 		'/'
	with: yup
		.string()
		.required(schemaErrors.with)
		.typeError(schemaErrors.with),
});
