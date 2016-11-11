const {expect} = require('chai');
const {getIssues} = require('../util');

const CONFIG = {
  names: ['resource'],
  descriptions: ['api']
};

describe('Require HTTPS', () => {
  it('Exposes issue when missing resource name', () => {
    const apiDescription = JSON.stringify({
      swagger: '2.0',
      info: {
        title: 'My API',
        description: 'description',
        version: '1.0.0'
      },
      paths: {
        '/resource': {
          get: {
            responses: {
              '200': {
                description: ''
              }
            }
          }
        }
      }
    });

    return getIssues('requireNameDescription', apiDescription, CONFIG).then((issues) => {
      expect(issues).to.have.length(1);
    });
  });

  it('Exposes issue when missing API description', () => {
    const apiDescription = JSON.stringify({
      swagger: '2.0',
      info: {
        title: 'My API',
        version: '1.0.0'
      }
    });

    return getIssues('requireNameDescription', apiDescription, CONFIG).then((issues) => {
      expect(issues).to.have.length(1);
    });
  });

  it('Passes when given name/description', () => {
    const apiDescription = JSON.stringify({
      swagger: '2.0',
      info: {
        title: 'My API',
        description: 'description',
        version: '1.0.0'
      }
    });

    return getIssues('requireNameDescription', apiDescription, CONFIG).then((issues) => {
      expect(issues).to.have.length(0);
    });
  });
});
