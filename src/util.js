/*
  Split a string on words in a smart way. For example, given
  `someString-with_wordsABCTest` you would get an array of `some`, `String`,
  `with`, `words`, `ABC`, `Test` as a result.
*/
function smartSplit(input) {
  // Split on multiple capitals, camel cased words or certain separators.
  // Filters out undefined or blank matches before returning.
  return input.split(/([A-Z]+(?=[A-Z][a-z])+|[A-Z][a-z]+)|[-_]+/)
    .filter(Boolean);
}

/*
  Change the casing of an input string to match one of the following styles:

  1. camel-case (e.g. `MyObject`)
  2. lower-camel-case (e.g. `myObject`)
  3. snake-case (e.g. `my_object`)
  4. dash-case (e.g. `my-object`)

  Note: Consecutive capital letters are not round-trip safe. E.g. converting
  the string `APITest` to dash-case and back to CamelCase would result in
  the modified string `ApiTest`. Otherwise, transformations are round-trip
  safe.

  Limitation: this obviously cannot determine where to split words, so
  something like `myobject` is already e.g. snake cased, but it does a good
  job of detecting wrong casing with enough input samples!
*/
function recase(input, style) {
  const pieces = smartSplit(input);
  let expected = '';

  if (style === 'lower-camel-case' || style === 'camel-case') {
    expected = pieces.map((piece, i) => {
      const direction = (i > 0 || style === 'camel-case') ? 'Upper' : 'Lower';
      if (piece.match(/^[A-Z]+$/)) {
        // All capitals, so treat them as one single entity.
        return piece[`to${direction}Case`]();
      }
      // Capitalize each word, except first word for lower camel.
      return piece[0][`to${direction}Case`]() + piece.slice(1).toLowerCase();
    }).join('');
  } else if (style === 'dash-case' || style === 'snake-case') {
    // Lowercase each piece and join with the appropriate character.
    expected = pieces
      .map(piece => piece.toLowerCase())
      .join(style === 'snake-case' ? '_' : '-');
  }

  return expected;
}

module.exports = {
  smartSplit, recase
};
