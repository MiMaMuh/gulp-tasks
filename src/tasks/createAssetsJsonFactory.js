/**
 * Purpose: Gulp task for creating a assets.json which maps a the name
 * of a file to its path within the craft project relative to the
 * public web dir. The task expects a naming convention of the src files
 * of name-hash.extension
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
const {
	getGlobPath,
	removeFiles,
	findFiles,
	parseConfig,
} = require('../utils');

const CRAFT_PUBLIC_DIR = 'web';

// the path where our assets.json template file is
// located relative to our gulpfile.js
const PATH_ASSETS_JSON_TEMPLATE = 'gulpfiles/copy_bundles_to_craft/assets.json';

// possible seperators for our asset files
// we use this regex to trim the first word from
// all filenames which should be part of the assets.json
// to generate a unique key name for each entry in our
// assets.json
const FILENAME_SEPERATORS = /(\.|-|_)/g;

const ASSETS_JSON_TEMPLATE = `
{
  <% assets.forEach(function(asset, index) { %>"<%- asset.key %>": "<%- asset.value %>"<%- (assets.length === index + 1) ? '' : ',\\n\\t' %><% }); %>
}
`;

/**
 * Uses assets with path strings and map it to
 * data entries for our asset.json template
 * @param {Array<string>} assets pathes of assets which should be included in the asset.json
 * @param {string} craftDir root dir of the craft project - relative or absolute
 */
function getTemplateData(assets, craftDir) {
	const craftWebDir = path.join(craftDir, CRAFT_PUBLIC_DIR);
	return assets.map(asset => {
		// get name and the extension from path
		const { name, ext } = path.parse(asset);
		// ase base of our key-name we use only the first word
		// before sperated by one of: . - _
		const base = name.substr(0, name.search(FILENAME_SEPERATORS));
		// the public pass through which the asset is accessible
		// based from the rood domain.
		const publicPath = path.relative(craftWebDir, asset);
		// extension without .
		const cleanExt = ext.replace('.', '');
		return {
			key: `${cleanExt}/${base}`,
			value: `/${publicPath}`,
		};
	});
}

/**
 * Generates a glob string for our assets.json file
 * @param {sting} assetDir dir where the asset json should be generated
 */
function assetJsonGlob(assetDir) {
	const slash = assetDir.endsWith('/') ? '' : '/';
	return `${assetDir}${slash}assets.json`;
}

/**
 * Filters sourcemap extension from the passed
 * extension array: ['js', 'js.map'] => ['js']
 * @param {Array<string>} extensions
 */
// function withoutSourceMaps(extensions) {
// 	return extensions.filter(extension => !extension.endsWith('.map'));
// }

function taskFactory(gulp, taskName, config) {
	// check if we got an name
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
	const { commands, allowForceRemove, dryRun, craftDir } = parseConfig(
		config
	);

	/** Task removes the assets.json file */
	function removeAssetFile() {
		return removeFiles(assetJsonGlob(craftDir), allowForceRemove, dryRun);
	}

	/** Task creates the new assets.json file */
	function createAssetFile() {
		const assetGlobs = [];

		// Genertes the assetGlobs based on our commands
		// We use the assetGlobs to find all files we may
		// include in our assets.json
		commands.forEach(
			({ to, extensions, includeSubDirs, includeInAssetJson }) => {
				if (includeInAssetJson) {
					const globPath = getGlobPath(
						to,
						extensions,
						includeSubDirs
					);
					assetGlobs.push(globPath);
				}
			}
		);

		// find all the files by the generated globs array
		// and generate the assets.json from it
		return findFiles(assetGlobs).then(assetPathes => {
			// 1. generate the data for the assets.json template
			const templateData = {
				assets: getTemplateData(assetPathes, craftDir),
			};

			if (dryRun) {
				console.log(
					`\t${colors.blue(
						'[dry run] Create asset.json in'
					)} ${craftDir} ${colors.blue(
						'with these template data:'
					)} ${JSON.stringify(templateData, null, ' ')}`
				);

				return file('assets.json', ASSETS_JSON_TEMPLATE, {
					src: true,
				}).pipe(template(templateData));
			}

			// 2. inform terminal about generated assets.json
			console.log(
				`\t${colors.blue('Create assets.json in')} ${craftDir}`
			);

			// 3. fill template with data and store the assets.json
			// in the root dir of our craft project
			return file('assets.json', ASSETS_JSON_TEMPLATE, { src: true })
				.pipe(template(templateData))
				.pipe(gulp.dest(craftDir));
		});
	}

	gulp.task(taskName, gulp.series(removeAssetFile, createAssetFile));
}

module.exports = taskFactory;
