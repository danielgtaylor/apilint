const {recase} = require('../util');

module.exports = function *uriTemplateCapitalization(api, linter, config) {
  let style = config.style;

  if (!style) {
    style = 'snake-case';
  }

  for (const resource of api.resources) {
    const template = resource.uriTemplate;

    for (const piece of template.split('/')) {
      const cleaned = piece.replace(/\{.*\}/g, '');
      const expected = recase(cleaned, style);

      if (cleaned !== expected) {
        yield linter.issue(
          `Resource URI template piece '${cleaned}' should be cased like '${expected}'`,
          resource.uriTemplateSourcemap
        );
      }
    }

    for (const action of resource.actions) {
      if (action.hasOwnUriTemplate) {
        const actionTemplate = resource.uriTemplate;

        for (const actionPiece of actionTemplate.split('/')) {
          const actionCleaned = actionPiece.replace(/\{.*\}/g, '');
          const actionExpected = recase(actionCleaned, style);

          if (actionPiece !== actionExpected) {
            yield linter.issue(
              `Action URI template piece '${actionCleaned}' should be cased like '${actionExpected}'`,
              action.uriTemplateSourcemap
            );
          }
        }
      }
    }
  }
};
