# API Lint

A linting utility for API descriptions that allows you to set rules for API design, similar to how e.g. ESLint works to enforce good practices when writing Javascript. API Lint can be configured to run on CI hosts and fail any build which does not pass the configured rules, allowing it to be deployed organization-wide to enforce design guidelines.

Rules are easy to define and built on [Mateo](https://github.com/danielgtaylor/mateo#mateo-api-description-library), an abstraction library for API description formats. Each rule has an associated severity (`info`, `warn`, or `error`) that allows you to set suggestions or hard limits that will cause the `apilint` utility to return an error.

## Supported API Description Formats

* [Swagger 2.0](http://swagger.io/specification/)
* [API Blueprint](https://apiblueprint.org/)

## Usage

Make sure you have Node.js (version 6.x or higher).

```sh
# Install the utility
sudo npm install -g apilint

# Use the utility
apilint MyGreatAPI.yaml
apilint AnotherAPI.apib
```

For browser use or to support older versions of Node, you'll have to first use Babel to transform to ES5, e.g. through Webpack.

## Default Settings

API Lint tries to use sane defaults which you are welcome to override with a configuration file or your own custom rules (pull requests welcome). The defaults are based on the following guidelines:

- [Vinay Sahni's Best Practices for RESTful APIs](http://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api)
- [Whitehouse.gov Standards for API Design](https://github.com/WhiteHouse/api-standards#white-house-web-api-standards)
- [Microsoft REST API Guidelines](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md)
- [10 Design Tips for APIs](https://phraseapp.com/blog/posts/best-practice-10-design-tips-for-apis/)

Additionally, the following well-designed APIs were used for real-world examples of the above guidelines (and their exceptions) in action:

- [GitHub API Documentation](https://developer.github.com/v3/)
- [Stripe API Documentation](https://stripe.com/docs/api)

### Default Checks

The following checks are executed by default.

- Resources should be nouns
- Resources should be plural with the exception of:
  - A few special cases (e.g. a top level `/search` resource)
  - The last subresource in a resource chain, which is commonly used for convenience when typical CRUD operations don't map well (e.g. POSTing to `/gists/{id}/star` to star a GitHub Gist).
- API URLs should use HTTPS
- The API should be versioned via one of:
  - Path version component, e.g. `/v1`
  - Header version, e.g. `X-Version`
- Resource creation and updates should either:
  - Respond with HTTP `201` or `204` and include a `Location` header to the resource
  - Respond with the resource in the body
- Actions on a resource should have descriptive names
- The API, any tags/groups, and resources should have descriptions
- 400-level errors should include a descriptive body
- URI template components, URI template parameters, and request/response body properties should use `snake_casing`.
- Request/response bodies should use JSON, and JSON examples should validate against any defined schemas.

## Configuration

By default no configuration is needed. However, if you wish to set your own rules and severity levels you may do so via a configuration file located in the project root called `.apilint.json`. It consists of a set of rule configurations and an optional path to additional rules.

```json
{
  "load": "./custom-api-rules",
  "config": {
    "api-version": "error",
    "resource-noun": "info",
    "uri-parameter-capitalization": {
      "severity": "error",
      "style": "camel-case"
    }
  }
}
```

The `load` directive should be a path to a directory that contains Javascript files. Each file should export a single rule function, similar to how the built-in rules work.

The `config` directive is an object where the keys are the rule name and the value is an object with configuration for the rule. As a shorthand, the value may also be a string severity, e.g. `error` which would be shorthand for `{"severity": "error"}`. See the documentation for individual rules for a list of things which can be configured, such as the capitalization `style` for URI parameters in the example above.

### Writing Custom Rules

Custom rules are just a simple function that takes in a parsed API, the associated `ApiLinter` instance, and the rule's configuration. The rule function is expected to return an iterable of issues. For example, to write a basic rule which requires the API to have a name:

```js
module.exports = function apiName(api, linter, config) {
  const issues = [];

  if (!api.name) {
    issues.push(linter.issue('API must have a name', api);
  }

  return issues;
}
```

It's also possible to write the same rule using a generator function:

```js
module.exports = function *apiName(api, linter, config) {
  if (!api.name) {
    yield linter.issue('API must have a name', api);
  }
}
```

When reporting an issue, you must provide a message (the first argument to `linter.issue`) and can optionally provide an API element or sourcemap to pinpoint where in the source API description file the issue occurred.

Save this rule as `./custom-api-rules/api-name.js` and use the following `.apilint.json` file to test:

```json
{
  "load": "./custom-api-rules",
  "config": {
    "api-name": "error"
  }
}
```

Keep in mind that rule names need to be unique, so e.g. prefixing custom rules with your organization name can help to prevent conflicts.

# Customization & Reference

It is also possible to customize the linter in other ways. For example, you can programmatically create new rules via `linter.use(config, func)`. In this way you can build a customized module for linting.

```js
const {ApiLinter} = require('apilint');

const linter = new ApiLinter();

// Assign a new rule with configuration programmatically.
linter.use({
  id: 'my-check',
  severity: 'error'
}, function *myCheck(api, linter, config) {
  yield linter.issue('Just a test', api);
});

for (const issue of linter.lint('API description content')) {
  console.log(issue.message);
}
```

More customization is planned, particularly around reporting of issue output.

# License

https://dgt.mit-license.org/
