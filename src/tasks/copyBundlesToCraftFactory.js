/**
 * This generated task takes a config where you define which files
 * you wanna copy to your craft project and generate assets.json out of them
 * to be used with craft-asset-rev plugin.
 *
 * It is a combination of copyFiles and createAssetsJson task.
 */
const copyFilesFactory = require('./copyFilesFactory');
const createAssetsJsonFactory = require('./createAssetsJsonFactory');

/* eslint-disable no-console, import/no-extraneous-dependencies, compat/compat */

function taskFactory(gulp, taskName, config) {
	const taskNameCopyFiles = `${taskName}:copy`;
	const taskNameAssetsJson = `${taskName}:assets`;

	// create the copy task
	copyFilesFactory(gulp, taskNameCopyFiles, config);

	// create the assets task
	createAssetsJsonFactory(gulp, taskNameAssetsJson, config);

	// our final task which copies all bundles from our frontend
	// project to our craft project and creates a fresh assets.json
	gulp.task(taskName, gulp.series(taskNameCopyFiles, taskNameAssetsJson));
}

module.exports = taskFactory;
