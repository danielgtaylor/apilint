const {recase} = require('../util');
const yaml = require('js-yaml');

/*
  Check each item of the array for arrays or objects.
*/
function checkArray(errors, style, obj) {
  for (const item of obj) {
    if (item instanceof Array) {
      checkArray(errors, style, item);
    } else if (item instanceof Object) {
      checkObject(errors, style, item);
    }
  }
}

/*
  Check each property of the object for casing, then recurse if any
  of the property values are arrays or objects.
*/
function checkObject(errors, style, obj) {
  for (const key of Object.keys(obj)) {
    const expected = recase(key, style);

    if (key !== expected) {
      errors.push({
        property: key,
        expected
      });
    }

    if (obj[key] instanceof Array) {
      checkArray(errors, style, obj[key]);
    } else if (obj[key] instanceof Object) {
      checkObject(errors, style, obj[key]);
    }
  }
}

/*
  Parse the body and recursively generate a list of errors for any
  misnamed properties.
*/
function getBodyErrors(style, body) {
  const errors = [];
  let parsed;

  try {
    parsed = yaml.safeLoad(body);
  } catch (err) {
    // Body can't be parsed, but this will be reported elsewhere.
  }

  if (parsed) {
    if (parsed instanceof Array) {
      checkArray(errors, style, parsed);
    } else if (parsed instanceof Object) {
      checkObject(errors, style, parsed);
    }
  }

  return errors;
}

module.exports = function *bodyCapitalization(api, linter, config) {
  let style = config.style;

  if (!style) {
    style = 'snake-case';
  }

  for (const example of api.examples()) {
    for (const prop of ['request', 'response']) {
      const element = example[prop];
      if (element.body) {
        const errors = getBodyErrors(style, element.body);

        for (const error of errors) {
          yield linter.issue(
            `${prop[0].toUpperCase() + prop.substr(1)} body property '${error.property}' should be cased like '${error.expected}'`,
            element.bodySourcemap || element
          );
        }
      }
    }
  }
};
