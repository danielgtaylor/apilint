const METHODS = [
  'POST',
  'PUT',
  'PATCH'
];

module.exports = function *updateResource(api, linter) {
  for (const action of api.actions()) {
    if (METHODS.indexOf(action.method) !== -1) {
      for (let i = 0; i < action.examples.length; i++) {
        const response = action.examples[i].response;
        if (response.statusCode >= 200 && response.statusCode < 300) {
          if (response.statusCode !== 201 && response.statusCode !== 204) {
            // This response *should* include the resource information.
            if (!response.body) {
              yield linter.issue(
                `Response '${response.id}' should return the resource in the response body`,
                response.statusCodeSourcemap || action
              );
            }
          } else {
            // This response *should* include a `Location` header pointing
            // to the resource.
            const header = response.headers.filter(
              header => header.name.toLowerCase() === 'location')[0];

            if (!header) {
              yield linter.issue(
                `Response '${response.id}' should include a 'Location' header pointing to the resource`,
                response.statusCodeSourcemap || action
              );
            }
          }
        }
      }
    }
  }
};
