// @flow

const findFiles = require('./findFiles');
const getGlobPath = require('./getGlobPath');
const parseConfig = require('./parseConfig');
const removeFiles = require('./removeFiles');

module.exports = {
	getGlobPath,
	removeFiles,
	parseConfig,
	findFiles,
};
