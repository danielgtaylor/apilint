const {expect} = require('chai');
const {getIssues} = require('../util');

describe('API version', () => {
  it('Exposes issue', () => {
    const apiDescription = JSON.stringify({
      swagger: '2.0',
      info: {
        title: 'My API',
        version: '1.0.0'
      }
    });

    return getIssues('apiVersion', apiDescription).then((issues) => {
      expect(issues).to.have.length(1);
    });
  });

  it('Passes with version in path', () => {
    const apiDescription = JSON.stringify({
      swagger: '2.0',
      info: {
        title: 'My API',
        version: '1.0.0'
      },
      schemes: ['https'],
      host: 'api.example.com',
      paths: {
        '/v1/resource': {}
      }
    });

    return getIssues('apiVersion', apiDescription).then((issues) => {
      expect(issues).to.have.length(0);
    });
  });

  it('Passes with version in header', () => {
    const apiDescription = JSON.stringify({
      swagger: '2.0',
      info: {
        title: 'My API',
        version: '1.0.0'
      },
      schemes: ['https'],
      host: 'api.example.com',
      paths: {
        '/resource': {
          get: {
            responses: {
              200: {
                description: '',
                headers: {
                  'X-Version': {
                    type: 'string',
                    default: '1.0.0'
                  }
                }
              }
            }
          }
        }
      }
    });

    return getIssues('apiVersion', apiDescription).then((issues) => {
      expect(issues).to.have.length(0);
    });
  });
});
