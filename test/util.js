const {ApiLinter} = require('../src/index');
const Mateo = require('mateo');

// Return a promise which resolves to a list of issues given
// a rule name and API description.
exports.getIssues = function getIssues(ruleName, apiDescription, config={}) {
  const linter = new ApiLinter();

  if (config.severity === undefined) {
    config.severity = 'error';
  }

  linter[ruleName](config);

  return Mateo.parse(apiDescription).then((api) => {
    return [...linter.lint(api)];
  });
};
