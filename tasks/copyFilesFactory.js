/* eslint-disable no-console, import/no-extraneous-dependencies, compat/compat */
// const gulp = require('gulp');
const assert = require('assert');
const colors = require('colors/safe');
const { getGlobPath, removeFiles, parseConfig } = require('../utils/index');

function taskFactory(gulp, taskName, config) {
	// check if we got a valid name for our task
	assert.equal(
		typeof taskName,
		'string',
		'First parameter "taskName" hast to be a string.'
	);

	// check if we got a config object
	assert.equal(
		config instanceof Object,
		true,
		'Second parameter "config" is missing or it is not a Object.'
	);

	// parse config ...
	const { commands, allowForceRemove, dryRun } = parseConfig(config);

	/** This taks removes all old files from the craft project */
	function cleanDistFilesTask() {
		const removeGlobs = [];

		// looks in all commands if we should remove the old files
		// in our dist folders. then we create globs to find these files
		commands.forEach(
			({ removeDistFiles, to, extensions, includeSubDirs }) => {
				if (removeDistFiles) {
					const glob = getGlobPath(to, extensions, includeSubDirs);
					removeGlobs.push(glob);
				}
			}
		);

		// remove the old files which matched with our globs
		return removeFiles(removeGlobs, allowForceRemove, dryRun);
	}

	/** This task remove all old files from the frontend src folder */
	function cleanSrcFilesTask() {
		const removeGlobs = [];

		// looks in all commands if we should remove the old files
		// in our dist folders. then we create globs to find these files
		commands.forEach(
			({ removeSrcFiles, from, extensions, includeSubDirs }) => {
				if (removeSrcFiles) {
					const glob = getGlobPath(from, extensions, includeSubDirs);
					removeGlobs.push(glob);
				}
			}
		);

		// remove the old files which matched with our globs
		return removeFiles(removeGlobs, allowForceRemove, dryRun);
	}

	/** This taks copies the new files to the craft project */
	function copyFilesTask() {
		const promises = [];

		// read all commands ...
		commands.forEach(({ from, to, extensions, includeSubDirs }) => {
			// create glob pathes from 'from' and 'to'
			const fromGlob = getGlobPath(from, extensions, includeSubDirs);
			const toGlob = to;

			// start the copy command
			const promise = new Promise((resolve, reject) => {
				if (!dryRun) {
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
