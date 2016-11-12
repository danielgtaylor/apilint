const {expect} = require('chai');
const {getIssues} = require('../util');

describe('Update Resource', () => {
  it('Exposes issue when not returning location or body', () => {
    const apiDescription = JSON.stringify({
      swagger: '2.0',
      info: {
        title: 'My API',
        version: '1.0.0'
      },
      paths: {
        '/resources/{id}': {
          put: {
            parameters: [
              {
                name: 'id',
                in: 'path',
                type: 'string',
                required: true
              }
            ],
            responses: {
              '200': {
                description: ''
              }
            }
          }
        }
      }
    });

    return getIssues('updateResource', apiDescription).then((issues) => {
      expect(issues).to.have.length(1);
    });
  });

  it('Succeeds with response body', () => {
    const apiDescription = JSON.stringify({
      swagger: '2.0',
      info: {
        title: 'My API',
        version: '1.0.0'
      },
      paths: {
        '/resources/{id}': {
          put: {
            parameters: [
              {
                name: 'id',
                in: 'path',
                type: 'string',
                required: true
              }
            ],
            responses: {
              '200': {
                description: '',
                examples: {
                  'application/json': '{}'
                }
              }
            }
          }
        }
      }
    });

    return getIssues('updateResource', apiDescription).then((issues) => {
      expect(issues).to.have.length(0);
    });
  });

  it('Succeeds with 204 response and location header', () => {
    const apiDescription = JSON.stringify({
      swagger: '2.0',
      info: {
        title: 'My API',
        version: '1.0.0'
      },
      paths: {
        '/resources/{id}': {
          put: {
            parameters: [
              {
                name: 'id',
                in: 'path',
                type: 'string',
                required: true
              }
            ],
            responses: {
              '204': {
                description: '',
                headers: {
                  location: {
                    type: 'string',
                  }
                }
              }
            }
          }
        }
      }
    });

    return getIssues('updateResource', apiDescription).then((issues) => {
      expect(issues).to.have.length(0);
    });
  });
});
