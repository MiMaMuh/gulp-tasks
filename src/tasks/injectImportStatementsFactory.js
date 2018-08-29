// @flow
/* eslint-disable compat/compat */

const assert = require('assert');
const colors = require('colors/safe');
const template = require('lodash/template');
const inject = require('gulp-inject');
const path = require('path');

const configSchema = require('../schmeas/injectImportStatementsConfigSchema');

function taskFactory(gulp, taskName, config) {
	// check if we got the gulp dependency
	assert.equal(
		typeof gulp === 'object' &&
			!!gulp.task &&
			!!gulp.src &&
			!!gulp.dest &&
			!!gulp.series &&
			!!gulp.parallel,
		true,
		'First parameter "gulp" has to be the injected gulp dependency in version >=4.0.0.'
	);

	// check if we got an name
	assert.equal(
		typeof taskName,
		'string',
		'First parameter "taskName" hast to be a string.'
	);

	// check if we got an name
	assert.equal(
		typeof taskName,
		'string',
		'Second parameter "taskName" hast to be a string.'
	);

	// check if we got a config object
	assert.equal(
		config instanceof Object,
		true,
		'Third parameter "config" is missing or it is not a Object.'
	);

	// parse config ...
	const {
		inject: injectFrom,
		to: injectTo,
		with: injectWith,
	} = configSchema.validateSync(config);

	// prepare the template to render the import statements
	const renderTemplate = template(injectWith);

	const injectImportStatements = () =>
		new Promise(resolve => {
			const { dir: srcPath } = path.parse(injectTo.file);
			const source = [injectFrom, `!${injectTo.file}`];
			gulp.src(injectTo.file)
				.pipe(
					inject(gulp.src(source, { read: false }), {
						relative: true,
						starttag: injectTo.between.startTag,
						endtag: injectTo.between.endTag,
						transform: filePath => {
							const { base, ext, dir, name, root } = path.parse(
								filePath
							);
							// render template and provide basic infos to the
							// template as variables like the path of the file,
							// the extension, base, dir, ...
							return renderTemplate({
								path: filePath,
								base,
								ext,
								dir,
								name,
								root,
							});
						},
					})
				)
				.pipe(gulp.dest(srcPath))
				.on('end', () => {
					resolve();
					console.log(
						colors.green(
							`Finished injecting files into ${injectTo.file}`
						)
					);
				});
		});

	const injectWithErrorCatching = () => {
		return injectImportStatements().catch(error => {
			console.log(colors.red(error));
		});
	};

	gulp.task(taskName, injectWithErrorCatching);
}

module.exports = taskFactory;
