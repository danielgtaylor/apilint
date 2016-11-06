const inflection = require('inflection');

// A list of common top-level resources that should probably
// not be pluralized.
const EXCLUDES = [
  'me',
  'search'
];

module.exports = function *resourcePlural(api, linter) {
  const seen = {};

  for (const element of api.uriTemplateElements()) {
    const pieces = element.uriTemplate.replace(/\{.*\}/, '').split('/');
    let matched = false;

    for (let i = 0; i < pieces.length; i++) {
      const piece = pieces[i];

      if (!piece || seen[element.uriTemplateSourcemap]) {
        // Skip blank pieces
        continue;
      }

      if (piece.match(/v[0-9]+/)) {
        // Skip possible version component
        continue;
      }

      if (EXCLUDES.indexOf(piece) !== -1) {
        // Skip exluded piece names
        continue;
      }

      const plural = inflection.pluralize(piece);

      if (piece !== plural && !(matched && i === pieces.length - 1)) {
        yield linter.issue(
          `URI template '${element.uriTemplate}' resource name '${piece}' should be plural, e.g. '${plural}'`,
          element.uriTemplateSourcemap || element
        );
      } else {
        matched = true;
      }
    }

    seen[element.uriTemplateSourcemap] = true;
  }
};
