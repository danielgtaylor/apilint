const {expect} = require('chai');
const {getIssues} = require('../util');

describe('URI template capitalization', () => {
  it('Exposes issue when using wrong casing', () => {
    const apiDescription = JSON.stringify({
      swagger: '2.0',
      info: {
        title: 'My API',
        version: '1.0.0'
      },
      paths: {
        '/myResources': {}
      }
    });

    return getIssues('uriTemplateCapitalization', apiDescription).then((issues) => {
      expect(issues).to.have.length(1);
    });
  });

  it('Exposes issue when nesting resources', () => {
    const apiDescription = JSON.stringify({
      swagger: '2.0',
      info: {
        title: 'My API',
        version: '1.0.0'
      },
      paths: {
        '/myResources/{id}/properly_cased/{another_id}': {}
      }
    });

    return getIssues('uriTemplateCapitalization', apiDescription).then((issues) => {
      expect(issues).to.have.length(1);
    });
  });

  it('Exposes issue when action overrides URI template', () => {
    const apiDescription = `# API Title

## Resources [/resources]

### Get a resource [GET /resources/SomeWeirdSubresource/{id}]

+ Response 200 (text/plain)

        Hello, world
`;

    return getIssues('uriTemplateCapitalization', apiDescription).then((issues) => {
      expect(issues).to.have.length(1);
    });
  });

  it('Ignores version component', () => {
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

    return getIssues('uriTemplateCapitalization', apiDescription).then((issues) => {
      expect(issues).to.have.length(0);
    });
  });

  it('Ignores variable names (checked elsewhere)', () => {
    const apiDescription = JSON.stringify({
      swagger: '2.0',
      info: {
        title: 'My API',
        version: '1.0.0'
      },
      paths: {
        '/v1/Resources/{resourceId}/Users': {}
      }
    });

    return getIssues('uriTemplateCapitalization', apiDescription, {
      style: 'camel-case'
    }).then((issues) => {
      expect(issues).to.have.length(0);
    });
  });

  it('Passes when using correct casing', () => {
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

    return getIssues('uriTemplateCapitalization', apiDescription).then((issues) => {
      expect(issues).to.have.length(0);
    });
  });
});
