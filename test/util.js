const {ApiLinter} = require('../src/index');
const Mateo = require('mateo');

// Return a promise which resolves to a list of issues given
// a rule name and API description.
exports.getIssues = function getIssues(ruleName, apiDescription) {
  return new Promise((resolve, reject) => {
    const linter = new ApiLinter();

    linter[ruleName]('error');

    Mateo.parse(apiDescription, (err, api) => {
      if (err) {
        return reject(err);
      }

      resolve([...linter.lint(api)]);
    });
  });
};
