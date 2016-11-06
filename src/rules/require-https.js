module.exports = function *requireHttps(api, linter) {
  if (api.servers.length === 0) {
    yield linter.issue(
      'No API server hostname specified, please set one and use HTTPS',
      api
    );
  }

  for (const server of api.servers) {
    if (!server.uriTemplate.match(/^https/)) {
      yield linter.issue(
        `Server '${server.uriTemplate}' should use HTTPS`,
        server
      );
    }
  }
};
