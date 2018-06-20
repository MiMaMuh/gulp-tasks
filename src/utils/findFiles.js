// @flow
const glob = require('glob-promise');

/** Find files by one glob string or an array of
 * glob strings. Returning a promise which get
 * a array of file pathes of all found files. The
 * function removes duplicated pathes.
 * @param {string|Array<string>} globs glob string or array of globs strings
 * @returns Promise which get deduplicated array of file pathes
 */
function findFiles(globs) {
	const globArray = Array.isArray(globs) ? globs : [globs];

	return Promise.all(globArray.map(assetGlob => glob(assetGlob))).then(
		filesPerGlob => {
			console.log(globArray);

			// flatten arrays ...
			const flattedGlobs = [].concat(...filesPerGlob);
			// make shure we do not have path duplicates by transfering the values
			// to a Set and then back to an array ...
			const globsAsSet = new Set(flattedGlobs);
			// return set back to array and return it
			return Array.from(globsAsSet);
		}
	);
}

module.exports = findFiles;
