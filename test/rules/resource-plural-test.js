const {expect} = require('chai');
const {getIssues} = require('../util');

describe('Resource Plural', () => {
  it('Exposes issue when singular (simple)', () => {
    const apiDescription = JSON.stringify({
      swagger: '2.0',
      info: {
        title: 'My API',
        version: '1.0.0'
      },
      paths: {
        '/resource': {}
      }
    });

    return getIssues('resourcePlural', apiDescription).then((issues) => {
      expect(issues).to.have.length(1);
    });
  });

  it('Exposes issue when singular (deep)', () => {
    const apiDescription = JSON.stringify({
      swagger: '2.0',
      info: {
        title: 'My API',
        version: '1.0.0'
      },
      paths: {
        '/resource/{resource_id}/items/{item_id}': {}
      }
    });

    return getIssues('resourcePlural', apiDescription).then((issues) => {
      expect(issues).to.have.length(1);
    });
  });

  it('Exposes issue when singular (complex)', () => {
    // This is the non-standard case where pluralizing something requires
    // more than just appending an `s` character.
    const apiDescription = JSON.stringify({
      swagger: '2.0',
      info: {
        title: 'My API',
        version: '1.0.0'
      },
      paths: {
        '/foot': {}
      }
    });

    return getIssues('resourcePlural', apiDescription).then((issues) => {
      expect(issues).to.have.length(1);
      expect(issues[0].message).to.contain('feet');
    });
  });

  it('Passes when plural', () => {
    const apiDescription = JSON.stringify({
      swagger: '2.0',
      info: {
        title: 'My API',
        version: '1.0.0'
      },
      paths: {
        '/resources': {}
      }
    });

    return getIssues('resourcePlural', apiDescription).then((issues) => {
      expect(issues).to.have.length(0);
    });
  });

  it('Passes when version component', () => {
    const apiDescription = JSON.stringify({
      swagger: '2.0',
      info: {
        title: 'My API',
        version: '1.0.0'
      },
      paths: {
        '/v1/resources': {}
      }
    });

    return getIssues('resourcePlural', apiDescription).then((issues) => {
      expect(issues).to.have.length(0);
    });
  });

  it('Passes when special excluded name', () => {
    const apiDescription = JSON.stringify({
      swagger: '2.0',
      info: {
        title: 'My API',
        version: '1.0.0'
      },
      paths: {
        '/v1/search': {}
      }
    });

    return getIssues('resourcePlural', apiDescription).then((issues) => {
      expect(issues).to.have.length(0);
    });
  });
});
