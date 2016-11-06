const Ajv = require('ajv');
const yaml = require('js-yaml');

module.exports = function *contentType(api, linter, config) {
  if (!config.mimetypes || !config.mimetypes.length) {
    config.mimetypes = ['application/json'];
  }

  const seenSchemas = {};

  for (const example of api.examples()) {
    let body;

    for (const prop of ['request', 'response']) {
      const element = example[prop];

      if (element.body) {
        if (!config.mimetypes.includes(element.contentType)) {
          yield linter.issue(
            `Content type '${element.contentType}' should be one of '${config.mimetypes.join('\', \'')}'`,
            element.contentTypeSourcemap || element
          );
        } else {
          // Mimetype is correct, but does the body parse?
          if (element.contentType === 'application/json') {
            try {
              body = JSON.parse(element.body);
            } catch (err) {
              yield linter.issue(
                `JSON body does not parse correctly! ${err}`,
                element.bodySourcemap || element
              );
            }
          } else if (element.contentType === 'application/yaml') {
            try {
              body = yaml.safeLoad(element.body);
            } catch (err) {
              yield linter.issue(
                `YAML body does not parse correctly! ${err}`,
                element.bodySourcemap || element
              );
            }
          }

          // TODO: Attempt to load XML bodies?

          // Body has parsed, but does it match the schema?
          if (body && element.bodySchema) {
            let schema;

            if (seenSchemas[element.bodySchema] !== undefined) {
              schema = seenSchemas[element.bodySchema];
            } else {
              seenSchemas[element.bodySchema] = null;

              try {
                schema = JSON.parse(element.bodySchema);
                seenSchemas[element.bodySchema] = schema;
              } catch (err) {
                yield linter.issue(
                  `Schema does not parse correctly! ${err}`,
                  element.bodySchemaSourcemap || element
                );
              }
            }

            if (!schema) {
              continue;
            }

            let ajv = new Ajv();
            let valid = ajv.validate(schema, body);

            if (!valid) {
              yield linter.issue(
                `element body does not match schema! 'body${ajv.errors[0].dataPath}' ${ajv.errors[0].message}`,
                element.bodySourcemap || element
              );
            }
          }
        }
      }
    }
  }
};
