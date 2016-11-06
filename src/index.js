const {recase} = require('./util');
const requireDir = require('require-dir');

class ApiLinter {
  /*
    Load a set of custom rule modules at the given path. This also adds
    convenience methods to the linter object, e.g. for a rule name like
    `require-name` there will now be a method called `requireName` to
    quickly use the rule.
  */
  static load(path) {
    const rules = requireDir(path, {camelcase: true});

    Object.keys(rules).forEach((name) => {
      if (name.indexOf('-') !== -1) {
        // Skip non-camel-cased names
        return;
      }

      if (name === 'util') {
        // Skip utility methods
        return;
      }

      ApiLinter.prototype.ruleNames.push(name);

      ApiLinter.prototype[name] = function (config) {
        let realConfig = config;

        if (typeof config === 'string') {
          realConfig = {severity: config};
        }

        realConfig.id = recase(name, 'dash-case');

        this.use(realConfig, rules[name]);
      };
    });
  }

  constructor() {
    this.checks = [];
  }

  /*
    Use a custom rule function with the given configuration when linting.
  */
  use(config, rule) {
    this.checks.push([config, rule]);
  }

  /*
    Set the default rules / configuration. Useful when no user configuration
    is present.
  */
  useDefaults() {
    this.resourceNoun('warn');
    this.resourcePlural('warn');
    this.requireHttps('error');
    this.apiVersion('warn');
    this.updateResource('warn');
    this.responseErrorBody('error');
    this.requireNameDescription({
      severity: 'warn',
      names: ['action'],
      descriptions: ['api', 'tag', 'resource']
    });
    this.uriTemplateCapitalization({
      severity: 'error',
      style: 'snake-case'
    });
    this.uriParameterCapitalization({
      severity: 'error',
      style: 'snake-case'
    });
    this.bodyCapitalization({
      severity: 'error',
      style: 'snake-case'
    });
    this.contentType({
      severity: 'error',
      mimetypes: ['application/json']
    });
  }

  /*
    Lint a parsed API description. Returns an iterable of issues.
  */
  *lint(apiDescription) {
    for (const [config, check] of this.checks) {
      for (const issue of check(apiDescription, this, config)) {
        // Attach some metadata to the issue before yielding
        issue.ruleId = config.id;
        issue.severity = config.severity;
        yield issue;
      }
    }
  }

  /*
    Create a new issue. This is used by the rules to return issues.
  */
  issue(message, element) {
    return {message, element};
  }
}

// Create the static list of rule names
ApiLinter.prototype.ruleNames = [];

// Load the default rules
ApiLinter.load('./rules');

module.exports = {ApiLinter};
