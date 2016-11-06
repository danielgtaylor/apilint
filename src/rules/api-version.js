module.exports = function *apiVersion(api, linter) {
  for (const server of api.servers) {
    if (server.uriTemplate.toLowerCase().match(/v[0-9]+/)) {
      return;
    }
  }

  for (const element of api.uriTemplateElements()) {
    if (element.uriTemplate.toLowerCase().match(/v[0-9]+/)) {
      return;
    }
  }

  for (const example of api.examples()) {
    for (const prop of ['request', 'response']) {
      const element = example[prop];

      if (element.headers) {
        for (const header of element.headers) {
          if (header.name.toLowerCase().match(/version/)) {
            return;
          }
        }
      }
    }
  }

  yield linter.issue(
    'API should contain a version, either as a subdomain, path component, or HTTP header',
    (api.servers && api.servers[0]) || api
  );
};
