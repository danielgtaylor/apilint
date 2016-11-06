const {recase} = require('../util');

module.exports = function *uriParameterCapitalization(api, linter, config) {
  let style = config.style;

  if (!style) {
    style = 'snake-case';
  }

  for (const parameter of api.uriParams()) {
    let expected = recase(parameter.name, style);

    if (parameter.name !== expected) {
      yield linter.issue(
        `URI template parameter '${parameter.name}' should be cased like '${expected}'`,
        parameter
      );
    }
  }
};
