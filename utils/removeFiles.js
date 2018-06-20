const del = require('del');
const colors = require('colors/safe');

/** Removes files from the filesystem based on the specified glob
 * @param {string|Array<string>} globs
 * @param {boolean} force
 * @returns Promise
 */
function removeFiles(globs, force = false, dryRun = false) {
	// now we remove the old files.
	// NOTE: with 'force:true' we allow deleting stuff
	// outside of our root directory!!
	return del(globs, {
		force,
		dryRun,
	}).then(files => {
		const dryRunLabel = dryRun ? '[dry run] ' : '';
		console.log(
			colors.blue(
				`\t${dryRunLabel}Files and folders which got removed:\n\t`
			),
			files.join('\n\t')
		);
		return files;
	});
}

module.exports = removeFiles;
