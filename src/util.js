/*
  Change the casing of an input string to match one of the following styles:

  1. camel-case (e.g. `MyObject`)
  2. lower-camel-case (e.g. `myObject`)
  3. snake-case (e.g. `my_object`)
  4. dash-case (e.g. `my-object`)

  Limitation: this obviously cannot determine where to split words, so
  something like `myobject` is already e.g. snake cased, but it does a good
  job of detecting wrong casing with enough input samples!
*/
function recase(input, style) {
  let expected = '';

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (style === 'lower-camel-case' || style === 'camel-case') {
      if (char === '_' || char === '-') {
        // Ignore this character, capitalize the next one, and move on.
        if (i < input.length - 1) {
          expected += input[i + 1].toUpperCase();
        }
        i++;
        continue;
      } else {
        expected += char;
      }

      if (expected.length === 1) {
        if (style === 'lower-camel-case') {
          // Lower case the first latter!
          expected = expected.toLowerCase();
        } else {
          expected = expected.toUpperCase();
        }
      }
    } else if (style === 'snake-case' || style === 'dash-case') {
      const separator = (style === 'snake-case') ? '_' : '-';

      if (char === '-' || char === '_') {
        expected += separator;
      } else if (char.match(/[A-Z]/)) {
        expected += `${separator}${char.toLowerCase()}`;
      } else {
        expected += char;
      }
    } else {
      throw new Error(`Unknown capitalization style '${style}'`);
    }
  }

  return expected;
}

module.exports = {
  recase
};
