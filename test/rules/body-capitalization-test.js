const {expect} = require('chai');
const {getIssues} = require('../util');

describe('Body capitalization', () => {
  it('Exposes issue when cased incorrectly', () => {
    const apiDescription = JSON.stringify({
      swagger: '2.0',
      info: {
        title: 'My API',
        version: '1.0.0'
      },
      paths: {
        '/resource': {
          get: {
            responses: {
              '200': {
                description: '',
                examples: {
                  'application/json': {
                    lowerCamelCase: 'foo',
                    okay: {
                      deepProblem: true
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    return getIssues('bodyCapitalization', apiDescription).then((issues) => {
      expect(issues).to.have.length(2);
    });
  });

  it('Passes when cased correctly', () => {
    const apiDescription = JSON.stringify({
      swagger: '2.0',
      info: {
        title: 'My API',
        version: '1.0.0'
      },
      paths: {
        '/resource': {
          get: {
            responses: {
              '200': {
                description: '',
                examples: {
                  'application/json': {
                    lower_camel_case: 'foo',
                    okay: {
                      deep_problem: true
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    return getIssues('bodyCapitalization', apiDescription).then((issues) => {
      expect(issues).to.have.length(0);
    });
  });
});
