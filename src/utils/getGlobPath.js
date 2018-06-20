// @flow

/** Generates a glob path based on a file path,
 * one or more extensions and the option, if it
 * should include subdirs.
 *
 * @param {string} dir dir like 'my/path'
 * @param {Array} extensions array with file extensions
 * @param {boolean} includeSubDirs if it should find files in subdirs
 * @returns glob string
 */
function getGlobPath(dir, extensions, includeSubDirs = false) {
	// with subdirs: my/path/**/*.{js|css|html}
	// without subdirs: my/path/*.{js|css|html}
	const slash = dir.endsWith('/') ? '' : '/';
	const subdir = includeSubDirs ? '**/*' : '*';
	const ext =
		extensions.length > 1
			? `{${extensions.join(',')}}`
			: extensions.join('');
	return `${dir}${slash}${subdir}.${ext}`;
}

module.exports = getGlobPath;
