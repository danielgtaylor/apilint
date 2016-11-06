const VERBS = [
  'allow',
  'create',
  'make',
  'open',
  'begin',
  'write',
  'convert',
  'put',
  'set',
  'read',
  'get',
  'fetch',
  'take',
  'give',
  'find',
  'delete',
  'close'
];

module.exports = function *resourceNoun(api, linter) {
  const seen = {};

  for (const element of api.uriTemplateElements()) {
    if (seen[element.uriTemplateSourcemap]) {
      continue;
    }

    for (const piece of element.uriTemplate.split(/[/{}]/)) {
      for (const verb of VERBS) {
        if ((piece.length === verb.length && piece.toLowerCase() === verb)
            || (piece.substr(0, verb.length).toLowerCase() === verb
            && piece[verb.length].match(/[ -_A-Z]/))) {
          yield linter.issue(
            `URI template '${element.uriTemplate}' piece '${piece}' should be a noun but starts with the verb '${verb}'`,
            element.uriTemplateSourcemap || element
          );
        }
      }
    }

    seen[element.uriTemplateSourcemap] = true;
  }
};
