module.exports = function *requireNameDescription(api, linter, config) {
  if (config.names === undefined) {
    config.names = [];
  }

  if (config.descriptions === undefined) {
    config.descriptions = [];
  }

  if (config.names.includes('api') && !api.name) {
    yield linter.issue(
      'API requires name',
      api
    );
  }

  if (config.descriptions.includes('api') && !api.description) {
    yield linter.issue(
      'API requires description',
      api
    );
  }

  for (const tag of api.tags) {
    if (config.names.includes('tag') && !tag.name) {
      yield linter.issue(
        'Tag requires name',
        tag
      );
    }

    if (config.descriptions.includes('tag') && tag.name && !tag.description) {
      yield linter.issue(
        `Tag '${tag.id}' requires description`,
        tag
      );
    }
  }

  for (const resource of api.resources) {
    if (config.names.includes('resource') && !resource.name) {
      yield linter.issue(
        `Resource '${resource.id}' requires name`,
        resource
      );
    }

    if (config.descriptions.includes('resource') && !resource.description) {
      yield linter.issue(
        `Resource '${resource.id}' requires description`,
        resource
      );
    }

    for (const action of resource.actions) {
      if (config.names.includes('action') && !action.name) {
        yield linter.issue(
          `Action '${action.id}' requires name`,
          action
        );
      }

      if (config.descriptions.includes('action') && !action.description) {
        yield linter.issue(
          `Action '${action.id}' requires description`,
          action
        );
      }

      for (const example of action.examples) {
        if (config.names.includes('request') && !example.request.name) {
          yield linter.issue(
            `Request '${example.request.id}' requires name`,
            example.request
          );
        }

        if (config.descriptions.includes('request') && !example.request.description) {
          yield linter.issue(
            `Request '${example.request.id}' requires description`,
            example.request
          );
        }

        if (config.names.includes('response') && !example.response.name) {
          yield linter.issue(
            `Response ${example.response.id}' requires name`,
            example.response
          );
        }

        if (config.descriptions.includes('response') && !example.response.description) {
          yield linter.issue(
            `Response ${example.response.id}' requires description`,
            example.response
          );
        }
      }
    }
  }
};
