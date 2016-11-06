module.exports = function *responseErrorBody(api, linter) {
  for (const response of api.responses()) {
    const code = response.statusCode;

    if (code >= 400 && code < 500 && !response.body) {
      yield linter.issue(
        `Response ${response.id} should include a descriptive body`,
        response
      );
    }
  }
};
