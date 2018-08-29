// @flow

const copyFilesFactory = require('./tasks/copyFilesFactory');
const createAssetsJsonFactory = require('./tasks/createAssetsJsonFactory');
const injectImportStatementsFactory = require('./tasks/injectImportStatementsFactory');

module.exports = {
	copyFilesFactory,
	createAssetsJsonFactory,
	injectImportStatementsFactory,
};
