const {expect} = require('chai');
const {getIssues} = require('../util');

const CONFIG = {
  mimetypes: ['application/json', 'application/yaml']
};

describe('Content Type', () => {
  it('Exposes issue when using invalid content type header', () => {
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
              '200': {
                description: '',
                examples: {
                  'text/plain': 'Hello, world!'
                }
              }
            }
          }
        }
      }
    });

    return getIssues('contentType', apiDescription, CONFIG).then((issues) => {
      expect(issues).to.have.length(1);
    });
  });

  it('Exposes issue when schema validation fails', () => {
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
              '200': {
                description: '',
                examples: {
                  'application/json': '{}'
                },
                schema: {
                  type: 'object',
                  properties: {
                    'id': {
                      type: 'string'
                    }
                  },
                  required: ['id']
                }
              }
            }
          }
        }
      }
    });

    return getIssues('contentType', apiDescription, CONFIG).then((issues) => {
      expect(issues).to.have.length(1);
    });
  });

  it('Passes when using valid JSON', () => {
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

    return getIssues('contentType', apiDescription, CONFIG).then((issues) => {
      expect(issues).to.have.length(0);
    });
  });

  it('Passes when using valid YAML + schema', () => {
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
              '200': {
                description: '',
                examples: {
                  'application/yaml': 'id: 123\ntest: ["foo"]\n'
                },
                schema: {
                  type: 'object',
                  properties: {
                    'id': {
                      type: 'number'
                    },
                    'test': {
                      type: 'array',
                      items: {
                        type: 'string'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    return getIssues('contentType', apiDescription, CONFIG).then((issues) => {
      expect(issues).to.have.length(0);
    });
  });
});
