const {expect} = require('chai');
const {getIssues} = require('../util');

describe('Resource Noun', () => {
  it('Exposes issue when matching a verb exactly', () => {
    const apiDescription = JSON.stringify({
      swagger: '2.0',
      info: {
        title: 'My API',
        version: '1.0.0'
      },
      paths: {
        '/get': {}
      }
    });

    return getIssues('resourceNoun', apiDescription).then((issues) => {
      expect(issues).to.have.length(1);
    });
  });

  it('Exposes issue when matching a verb with noun', () => {
    const apiDescription = JSON.stringify({
      swagger: '2.0',
      info: {
        title: 'My API',
        version: '1.0.0'
      },
      paths: {
        '/getResources': {}
      }
    });

    return getIssues('resourceNoun', apiDescription).then((issues) => {
      expect(issues).to.have.length(1);
    });
  });

  it('Passes when start of word matches verb', () => {
    const apiDescription = JSON.stringify({
      swagger: '2.0',
      info: {
        title: 'My API',
        version: '1.0.0'
      },
      paths: {
        '/getter': {}
      }
    });

    return getIssues('resourceNoun', apiDescription).then((issues) => {
      expect(issues).to.have.length(0);
    });
  });

  it('Passes when no verb is present', () => {
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

    return getIssues('resourceNoun', apiDescription).then((issues) => {
      expect(issues).to.have.length(0);
    });
  });
});
