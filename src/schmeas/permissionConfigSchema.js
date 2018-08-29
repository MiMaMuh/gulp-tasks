// @flow
const yup = require('yup');

const schemaErrors = {
	allowForceRemove:
		'"allowForceRemove" has to be an boolean value. Use "allowForceRemove" to spedify that your gulp tasks are allowed to run outsite of the root folder gulp is executed in. Needed if you want to execute tasks outside of your project root folder. Be aware that it could ruin your computer if you are careless.',
	dryRun:
		'"dryRun" has to be an boolean value. Use "dryRun" to spedify if you want to run the gulp tasks without any transformative operations. Only the tasks of "gulp-tasks" may support this feature. On a dry run the tasks will log their output to your terminal.',
};
module.exports = yup.object().shape({
	allowForceRemove: yup
		.boolean()
		.default(false)
		.typeError(schemaErrors.allowForceRemove),
	dryRun: yup
		.boolean()
		.default(false)
		.typeError(schemaErrors.dryRun),
});
