/* eslint-disable no-console, import/no-extraneous-dependencies, compat/compat */
// const gulp = require('gulp');
const assert = require('assert');
const colors = require('colors/safe');
const configSchema = require('../schmeas/copyFilesConfigSchema');
const { getGlobPath, removeFiles } = require('../utils/index');

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

	// check if we got a valid name for our task
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
	const { copy, permissions } = configSchema.validateSync(config);

	/** This taks removes all old files from the dist project */
	function cleanDistFilesTask() {
		const removeGlobs = [];

		// looks in all commands if we should remove the old files
		// in our dist folders. then we create globs to find these files
		copy.forEach(({ removeDistFiles, to, extensions, includeSubDirs }) => {
			if (removeDistFiles) {
				const glob = getGlobPath(to, extensions, includeSubDirs);
				removeGlobs.push(glob);
			}
		});

		// remove the old files which matched with our globs
		return removeFiles(
			removeGlobs,
			permissions.allowForceRemove,
			permissions.dryRun
		);
	}

	/** This task remove all old files from the frontend src folder */
	function cleanSrcFilesTask() {
		const removeGlobs = [];

		// looks in all commands if we should remove the old files
		// in our dist folders. then we create globs to find these files
		copy.forEach(({ removeSrcFiles, from, extensions, includeSubDirs }) => {
			if (removeSrcFiles) {
				const glob = getGlobPath(from, extensions, includeSubDirs);
				removeGlobs.push(glob);
			}
		});

		// remove the old files which matched with our globs
		return removeFiles(
			removeGlobs,
			permissions.allowForceRemove,
			permissions.dryRun
		);
	}

	/** This taks copies the new files to the dist project */
	function copyFilesTask() {
		const promises = [];

		// read all commands ...
		copy.forEach(({ from, to, extensions, includeSubDirs }) => {
			// create glob pathes from 'from' and 'to'
			const fromGlob = getGlobPath(from, extensions, includeSubDirs);
			const toGlob = to;

			// start the copy command
			const promise = new Promise((resolve, reject) => {
				if (!permissions.dryRun) {
					console.log(
						`\t${colors.blue(
							'Copy files from'
						)} ${fromGlob} ${colors.blue('to')} ${toGlob}`
					);
					const stream = gulp.src(fromGlob).pipe(gulp.dest(toGlob));
					stream.on('end', resolve);
					stream.on('error', reject);
				} else {
					console.log(
						`\t${colors.blue(
							'[dry run] Copy files from'
						)} ${fromGlob} ${colors.blue('to')} ${toGlob}`
					);
					resolve();
				}
			});
			promises.push(promise);
		});
		return Promise.all(promises);
	}

	gulp.task(
		taskName,
		gulp.series(cleanDistFilesTask, copyFilesTask, cleanSrcFilesTask)
	);
}

module.exports = taskFactory;
