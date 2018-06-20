const gulp = require('gulp');
const { copyBundlesToCraftFactory } = require('./../../gulp-tasks/');

// config to copy asset bundles from our frontend
// project to culp and generating the assets.json
// which could be used with the Craft Rev plugin
// plugin: https://github.com/clubstudioltd/craft-asset-rev
const config = {
	// allow remove operations outside of our current
	// working directory. normally it is necessary as
	// we have a seperated folder for our frontend
	// and craft project and run these copy commands
	// from our frontend project. the 'del' library doesn't
	// access to parent folders without setting it to true.
	// depending on your project structure you may have to
	// set it to true
	allowForceRemove: true,
	// with dryRun: true you can simulate the execution of
	// the task without risking that files get incidently removed
	// due to a config misconfiguratiion
	dryRun: true,
	// path to the frontend folder from where you wanna copy files from
	srcDir: './dist/',
	// path to the craft root folder where we copy all files to
	craftDir: '../backend/',
	// array with copy commands ...
	// @from is the relative path from srcDir
	// @to is the relative path from craftDir
	// @extensions define with extensions which kind of files you wanna copy
	// @includeSubDirs defines if the task should include files in subdirs
	// @removeSrcFiles when set to true it removes all the copied files from the srcDir
	// @removeDistFiles when set to true it removes all files with the same extionsions from the craftDir befor copiing
	// @includeInAssetJson when set to true the assets of this command are included in the asset.json
	commands: [
		{
			from: './',
			to: './web',
			extensions: ['css'],
			includeSubDirs: false,
			removeSrcFiles: false,
			removeDistFiles: true,
			includeInAssetJson: true,
		},
		{
			from: './',
			to: './web',
			extensions: ['css.map'],
			includeSubDirs: false,
			removeSrcFiles: false,
			removeDistFiles: true,
			includeInAssetJson: false,
		},
		{
			from: './critical',
			to: './templates/critical',
			extensions: ['css'],
			includeSubDirs: false,
			removeSrcFiles: false,
			removeDistFiles: false,
			includeInAssetJson: false,
		},
		{
			from: './assets/js/',
			to: './web/assets/js/',
			extensions: ['js'],
			includeSubDirs: false,
			removeSrcFiles: false,
			removeDistFiles: true,
			includeInAssetJson: true,
		},
		{
			from: './assets/js/',
			to: './web/assets/js/',
			extensions: ['js.map'],
			includeSubDirs: false,
			removeSrcFiles: false,
			removeDistFiles: true,
			includeInAssetJson: false,
		},
	],
};

// our final task which copies all bundles from our frontend
// project to our craft project and creates a fresh assets.json
copyBundlesToCraftFactory(gulp, 'copy-bundles', config);
