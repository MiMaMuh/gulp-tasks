/**
 * Purpose: Gulp task for creating a assets.json which maps the name
 * of a asset to its path. The task expects a naming convention of
 * the src files of: name-hash.extension
 *
 * It generates a asset json like this:
 *
 * {
 *  "css/main": "/main-zzz.bundle.css",
 * 	"js/collection": "/assets/js/collection-zzz.bundle.js",
 * 	"js/collections": "/assets/js/collections-zzz.bundle.js"
 * }
 *
 * The assets.json is specifically made to work well with craft-asset-rev
 * plugin: https://github.com/clubstudioltd/craft-asset-rev
 *
 * The factory expects three params:
 * 	{Gulp} gulp - gulp instance to register the task to
 *  {String} taskName - unique name for the task
 *  {Object} config - a config file
 */

// @flow
/* eslint-disable no-console, import/no-extraneous-dependencies, compat/compat */
// const gulp = require('gulp');
const template = require('gulp-template');
const file = require('gulp-file');
const assert = require('assert');
const colors = require('colors/safe');
const path = require('path');
const configSchema = require('../schmeas/assetsJsonConfigSchema');
const { getGlobPath, removeFiles, findFiles } = require('../utils');

// name of the assets.json file
const ASSETS_JSON_FILE_NAME = 'assets.json';

// possible seperators for our asset files
// we use this regex to trim the first word from
// all filenames which should be part of the assets.json
// to generate a unique key name for each entry in our
// assets.json
const FILENAME_SEPERATORS = /(\.|-|_)/g;

// the lodash template to generate the assets.json
const ASSETS_JSON_TEMPLATE = `
{
  <% assets.forEach(function(asset, index) { %>"<%- asset.key %>": "<%- asset.value %>"<%- (assets.length === index + 1) ? '' : ',\\n\\t' %><% }); %>
}
`;

/**
 * Uses assets with path strings and map it to
 * data entries for our asset.json template
 * @param {Array<string>} assets pathes of assets which should be included in the asset.json
 * @param {string} assetsShouldBeRelativeTo to which project folder the asset files should be relative to
 */
function generateTemplateData(assets, assetsShouldBeRelativeTo) {
	return assets.map(asset => {
		// get name and the extension from path
		const { name, ext } = path.parse(asset);
		// ase base of our key-name we use only the first word
		// before sperated by one of: . - _
		const base = name.substr(0, name.search(FILENAME_SEPERATORS));
		// the public pass through which the asset is accessible
		// based from the rood domain.
		const publicPath = path.relative(assetsShouldBeRelativeTo, asset);
		// extension without .
		const cleanExt = ext.replace('.', '');
		return {
			key: `${cleanExt}/${base}`,
			value: `/${publicPath}`,
		};
	});
}

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
		include,
		permissions,
		projectRoot,
		output,
	} = configSchema.validateSync(config);

	/** Task removes the assets.json file */
	function removeAssetFile() {
		return removeFiles(
			path.join(
				projectRoot,
				output.storeAssetsJsonTo,
				ASSETS_JSON_FILE_NAME
			),
			permissions.allowForceRemove,
			permissions.dryRun
		);
	}

	/** Task creates the new assets.json file */
	function createAssetFile() {
		const assetGlobs = [];

		// Genertes the assetGlobs based on the includes
		// We use the assetGlobs to find all files we may
		// include in our assets.json
		include.forEach(({ from, extensions, includeSubDirs }) => {
			const globPath = getGlobPath(
				path.join(projectRoot, from),
				extensions,
				includeSubDirs
			);
			assetGlobs.push(globPath);
		});

		// find all the files by the generated globs array
		// and generate the assets.json from it
		return findFiles(assetGlobs).then(assetPathes => {
			// 1. generate the data for the assets.json template
			const templateData = {
				assets: generateTemplateData(
					assetPathes,
					path.join(projectRoot, output.assetsShouldBeRelativeTo)
				),
			};

			const assetJsonDestination = path.join(
				projectRoot,
				output.storeAssetsJsonTo
			);

			if (permissions.dryRun) {
				console.log(
					`\t${colors.blue(
						'[dry run] Create assets.json in'
					)} ${assetJsonDestination} ${colors.blue(
						'with these template data:'
					)} ${JSON.stringify(templateData, null, ' ')}`
				);

				return file(ASSETS_JSON_FILE_NAME, ASSETS_JSON_TEMPLATE, {
					src: true,
				}).pipe(template(templateData));
			}

			// 2. inform terminal about generated assets.json
			console.log(
				`\t${colors.blue(
					'Create assets.json in'
				)} ${assetJsonDestination}`
			);

			// 3. fill template with data and store the assets.json
			// in the root dir of our craft project
			return file(ASSETS_JSON_FILE_NAME, ASSETS_JSON_TEMPLATE, {
				src: true,
			})
				.pipe(template(templateData))
				.pipe(gulp.dest(assetJsonDestination));
		});
	}

	gulp.task(taskName, gulp.series(removeAssetFile, createAssetFile));
}

module.exports = taskFactory;
