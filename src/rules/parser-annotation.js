module.exports = function *parserAnnotation(api, linter) {
  // Exposes parser annotations as linter issues.
  for (const annotation of api.annotations) {
    yield linter.issue(
      annotation.message, annotation.sourcemap, annotation.severity
    );
  }
};
