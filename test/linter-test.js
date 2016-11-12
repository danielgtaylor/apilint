const {expect} = require('chai');
const {ApiLinter} = require('../src/index');

describe('API Linter', () => {
  it('starts with no rules configured', () => {
    const linter = new ApiLinter();

    expect(linter.checks).to.be.empty;
  });

  it('can set defaults', () => {
    const linter = new ApiLinter();
    linter.useDefaults();

    expect(linter.checks).to.not.be.empty;
  });
});
