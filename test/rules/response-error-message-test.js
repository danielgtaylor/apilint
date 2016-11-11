const {expect} = require('chai');
const {getIssues} = require('../util');

describe('Response Error Body', () => {
  it('Exposes issue when error is missing body', () => {
    const apiDescription = JSON.stringify({
      swagger: '2.0',
      info: {
        title: 'My API',
        version: '1.0.0'
      },
      paths: {
        '/resources': {
          get: {
            responses: {
              '400': {
                description: '',
              }
            }
          }
        }
      }
    });

    return getIssues('responseErrorBody', apiDescription).then((issues) => {
      expect(issues).to.have.length(1);
    });
  });

  it('Passes when error has a descriptive body', () => {
    const apiDescription = JSON.stringify({
      swagger: '2.0',
      info: {
        title: 'My API',
        version: '1.0.0'
      },
      paths: {
        '/resources': {
          get: {
            responses: {
              '400': {
                description: '',
                examples: {
                  'application/json': {
                    code: 123,
                    message: 'Parameter `foo` is not valid'
                  }
                }
              }
            }
          }
        }
      }
    });

    return getIssues('responseErrorBody', apiDescription).then((issues) => {
      expect(issues).to.have.length(0);
    });
  });
});
