# gulp-tasks

A small collectionn of factories to create gulp task with different purposes.

### There are tasks to:
* Copy files from one project to another with `copyFilesFactory`
* Create a `assets.json` file with `createAssetsJsonFactory`
* More to come ...


### How to install it?
You can install this task with npm:
```
npm install --save-dev @mimamuh/gulp-tasks
```
Or with yarn:
```
yarn add --dev @mimamuh/gulp-tasks
```

### Requirements
* Node.js >= 8.x
* Gulp >= 4.x




## Tasks

### copyFilesFactory(gulp, taskName, config)

Copies files from one project to another one.

#### Params:
* `gulp` - gulp instance
* `taskName` - unique name of the task
* `config` - configuration object

#### Example usage:
```js
// gulpfile.js
const gulp = require('gulp');
const { copyFilesFactory } = require('gulp-tasks');

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
copyFilesFactory(gulp, 'copy-bundles', copyConfig);
```



---------------------------------------------------------------




## createAssetsJsonFactory(gulp, taskName, config)

Create a `assets.json` file to be used with CraftCMS 3 [Rev plugin](https://github.com/clubstudioltd/craft-asset-rev) or similar. It parses folders for files with a specific extension and includes them in the `assets.json` file. It expects that the asset files follow a naming convention of: `[name]-[hash].[extension]`. It also works with underscore `_` or dot `.` as a seperator like: `[name]_[hash].[extension]`

The outputted `asset.json` file will have a structure of:
```json
{
	"css/main": "/main-23ds3nsx45.css",
	"js/home": "/assets/js/home-23ds3nsx45.js",
	"js/contact": "/assets/js/contact-23ds3nsx45.js"
}
```

#### Params:
* `gulp` - gulp instance
* `taskName` - unique name of the task
* `config` - configuration object

#### Example usage:
```js
// gulpfile.js
const gulp = require('gulp');
const { createAssetsJsonFactory } = require('gulp-tasks');

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
		storeAssetsJsonTo: './',
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
createAssetsJsonFactory(gulp, 'create-assets-json', assetsJsonConfig);
```
