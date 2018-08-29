const gulp = require('gulp');
const {
	copyFilesFactory,
	createAssetsJsonFactory,
	injectImportStatementsFactory,
} = require('./../../gulp-tasks');

const taskName = 'bundles-to-backend';
const taskNameCopyFiles = `${taskName}:copy`;
const taskNameAssetsJson = `${taskName}:assets.json`;

// Permission settings for specific tasks.
// They may not apply to all tasks!!!
const permissionsConfig = {
	// Use "allowForceRemove" to spedify that your gulp tasks
	// are allowed to run outsite of the root folder gulp is
	// executed in. Needed if you want to execute tasks outside
	// of your project root folder. Be aware that it could ruin
	// your computer if you are careless.
	allowForceRemove: true,
	// Use "dryRun" to spedify if you want to run the gulp tasks
	// without any transformative operations. Only the tasks of
	// "gulp-tasks" may support this feature. On a dry run the
	// tasks will log their output to your terminal
	dryRun: false,
};

// Config to copy asset from one project to another
const copyConfig = {
	permissions: permissionsConfig,
	// Array with copy commands ...
	// @from: Use "from" to specify from which folder you want to copy files.
	// @to: Use "to" to specify to which folder you want to copy the files.
	// @extensions: Use "extensions" to specify which files should be copied based on their extension.
	// @includeSubDirs: Use "includeSubDirs" when you also want to copy files from subdirectories. Defaults to "false". Files copied from subdirectories keep their folder structure.
	// @removeSrcFiles: Use "removeSrcFiles" when source files should be deleted after they have been copied to their destination. Defaults to "false".
	// @removeDistFiles: Use "removeDistFiles" when files in the destination directory should be removed before new files will be copied there. It only removes files which match the same extension patterns like the source files. Defaults to "false".
	copy: [
		{
			from: './dist/',
			to: './../backend/web',
			extensions: ['css', 'css.map'],
			includeSubDirs: false,
			removeSrcFiles: false,
			removeDistFiles: true,
		},
		{
			from: './dist/critical',
			to: './../backend/templates/critical',
			extensions: ['css'],
			includeSubDirs: false,
			removeSrcFiles: false,
			removeDistFiles: false,
		},
		{
			from: './dist/assets/js/',
			to: './../backend/web/assets/js/',
			extensions: ['js', 'js.map'],
			includeSubDirs: false,
			removeSrcFiles: false,
			removeDistFiles: true,
		},
	],
};

// Create the copy task
copyFilesFactory(gulp, taskNameCopyFiles, copyConfig);

// Config create a assets.json which could be used with
// the Craft Rev plugin: https://github.com/clubstudioltd/craft-asset-rev
const assetsJsonConfig = {
	// Specify permission options ...
	permissions: permissionsConfig,
	// Use "projectRoot" to specify where your project is
	// located relative to your gulpfile.js
	projectRoot: './../backend/',
	// specify output options ...
	output: {
		// Use "assetsShouldBeRelativeTo" to specify to which folder
		// the assets in your assets.json file should be relative to.
		// "assetsShouldBeRelativeTo" should be relative to "projectRoot".
		assetsShouldBeRelativeTo: './web/',
		// Use "storeAssetsJsonTo" to specify where you want to store
		// your assets.json file relative to "projectRoot".
		storeAssetsJsonTo: './web/',
	},
	// Array with include commands ...
	// @from: Use "from" to specify from where you want to include assets to your assets.json.
	// @extensions: Use "extensions" to specify which files should be included in your assets.json based on their extension.
	// @includeSubDirs: Use "includeSubDirs" to spedify if files from subdirectories should be included. Defaults to "false".
	include: [
		{
			from: './web',
			extensions: ['css'],
			includeSubDirs: false,
		},
		{
			from: './web/assets/js/',
			extensions: ['js'],
			includeSubDirs: false,
		},
	],
};

// Create the generate assets.json task
createAssetsJsonFactory(gulp, taskNameAssetsJson, assetsJsonConfig);

// Finally we combine the copy task and the assets.json task to one task
gulp.task(taskName, gulp.series(taskNameCopyFiles, taskNameAssetsJson));

// Inject scss dependencies to a global.scss file
const injectScssConfig = {
	// Glob string to find files to be
	// injected as import statements to your
	// summary file.
	inject: './src/**/styles/*.scss',
	to: {
		// File in which we inject the found files
		// as a import statement
		file: './src/assets/scss/global.scss',
		// Inject import statements between the following
		// tags. Make sure to have them written in your file!
		between: {
			startTag: '/* inject:imports */',
			endTag: '/* endinject */',
		},
	},
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
	with: "@import '<%= dir %>/<%= name %>';",
};

injectImportStatementsFactory(gulp, 'inject-scss', injectScssConfig);
