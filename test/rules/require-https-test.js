const {expect} = require('chai');
const {getIssues} = require('../util');

describe('Require HTTPS', () => {
  it('Exposes issue when using HTTP', () => {
    const apiDescription = JSON.stringify({
      swagger: '2.0',
      info: {
        title: 'My API',
        version: '1.0.0'
      },
      schemes: ['http'],
      host: 'api.example.com'
    });

    return getIssues('requireHttps', apiDescription).then((issues) => {
      expect(issues).to.have.length(1);
    });
  });

  it('Exposes issue when missing host', () => {
    const apiDescription = JSON.stringify({
      swagger: '2.0',
      info: {
        title: 'My API',
        version: '1.0.0'
      }
    });

    return getIssues('requireHttps', apiDescription).then((issues) => {
      expect(issues).to.have.length(1);
    });
  });

  it('Passes when using HTTPS', () => {
    const apiDescription = JSON.stringify({
      swagger: '2.0',
      info: {
        title: 'My API',
        version: '1.0.0'
      },
      schemes: ['https'],
      host: 'api.example.com'
    });

    return getIssues('requireHttps', apiDescription).then((issues) => {
      expect(issues).to.have.length(0);
    });
  });
});
