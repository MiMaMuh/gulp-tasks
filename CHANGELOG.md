# Changelog
All notable changes to this project will be documented in this file.

## [Unreleased]

## [2.2.0] - 2018-08-29
### Added
- `injectImportStatementsFactory(gulp, taskName, config)` to inject import statements of collected files into a specific summary file.

### Changed
- Error messages to catch more cases.
- Update example/gulpfile.js with new config

### Fix
- Issue with wrong error messages and missing error checking of all factories.


## [2.0.1] - 2018-06-27
### Fix
- Fixes [#2](https://github.com/MiMaMuh/gulp-tasks/issues/2) issue when `config.output.storeAssetsJsonTo` wasn't working

## [2.0.0] - 2018-06-21
### Changed
- Structure of the config so tasks are seperated now
- Tasks seperated as a node package


## [1.0.0] - 2018-02-03
### Added
- Initial setup

