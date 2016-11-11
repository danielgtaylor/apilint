const {expect} = require('chai');
const {getIssues} = require('../util');

describe('URI parameter capitalization', () => {
  it('Exposes issue when using wrong case', () => {
    const apiDescription = JSON.stringify({
      swagger: '2.0',
      info: {
        title: 'My API',
        version: '1.0.0'
      },
      paths: {
        '/resources': {
          get: {
            parameters: [
              {
                name: 'lowerCamelCase',
                in: 'query',
                type: 'string'
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

    return getIssues('uriParameterCapitalization', apiDescription).then((issues) => {
      expect(issues).to.have.length(1);
    });
  });

  it('Passes when using correct case', () => {
    const apiDescription = JSON.stringify({
      swagger: '2.0',
      info: {
        title: 'My API',
        version: '1.0.0'
      },
      paths: {
        '/resources': {
          get: {
            parameters: [
              {
                name: 'snake_case',
                in: 'query',
                type: 'string'
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

    return getIssues('uriParameterCapitalization', apiDescription).then((issues) => {
      expect(issues).to.have.length(0);
    });
  });
});
