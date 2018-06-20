const path = require('path');
const assert = require('assert');

/** Parses the commands of the config file,
 * validates them and provide them with defaults
 * @param {Object} config the config file
 * @returns commands
 */
function parseCommands({ commands, srcDir, craftDir }) {
	return commands.map(
		({
			from,
			to,
			extensions,
			includeSourceMaps,
			includeSubDirs,
			removeSrcFiles,
			removeDistFiles,
			includeInAssetJson,
		}) => {
			return {
				from:
					typeof from === 'string'
						? path.join(srcDir, from)
						: assert.fail(
								typeof from,
								'string',
								'Wrong data type for config key "from"'
						  ),
				to:
					typeof to === 'string'
						? path.join(craftDir, to)
						: assert.fail(
								typeof from,
								'string',
								'Wrong data type for config key "to"'
						  ),
				extensions: Array.isArray(extensions)
					? extensions
					: assert.fail(
							typeof extensions,
							'Array',
							'Wrong data type for config key "extensions"'
					  ),
				includeSourceMaps:
					typeof includeSourceMaps === 'boolean'
						? includeSourceMaps
						: true,
				includeSubDirs:
					typeof includeSubDirs === 'boolean'
						? includeSubDirs
						: false,
				removeSrcFiles:
					typeof removeSrcFiles === 'boolean'
						? removeSrcFiles
						: false,
				removeDistFiles:
					typeof removeDistFiles === 'boolean'
						? removeDistFiles
						: false,
				includeInAssetJson:
					typeof includeInAssetJson === 'boolean'
						? includeInAssetJson
						: false,
			};
		}
	);
}

function parseConfig(config) {
	return {
		allowForceRemove:
			typeof config.allowForceRemove === 'boolean'
				? config.allowForceRemove
				: false,
		dryRun: typeof config.dryRun === 'boolean' ? config.dryRun : true,
		srcDir:
			typeof config.srcDir === 'string'
				? config.srcDir
				: assert.fail(
						typeof config.srcDir,
						'string',
						'Wrong data type for config key "srcDir"'
				  ),
		craftDir:
			typeof config.craftDir === 'string'
				? config.craftDir
				: assert.fail(
						typeof config.craftDir,
						'string',
						'Wrong data type for config key "craftDir"'
				  ),
		commands: parseCommands(config),
	};
}

module.exports = parseConfig;
