module.exports = function *responseErrorBody(api, linter) {
  for (const response of api.responses()) {
    const code = response.statusCode;

    if (code >= 400 && code < 500 && !response.body && !response.bodySchema) {
      yield linter.issue(
        `Error response ${response.id} should include a descriptive body`,
        response
      );
    }
  }
};
