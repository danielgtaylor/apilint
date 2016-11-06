#!/usr/bin/env node

const {ApiLinter} = require('../src/index');
const clc = require('cli-color');
const fs = require('fs');
const Mateo = require('mateo');
const pad = require('pad');
const path = require('path');
const {recase} = require('../src/util');
const wrap = require('wordwrap');

const parser = require('yargs')
  .usage('Usage: $0 api-description-file')
  .example('$0 example.yaml', 'Lint a Swagger 2.0 document')
  .example('$0 example.apib', 'Lint an API Blueprint document')
  .example('$0 --list-rules', 'List configurable rule names')
  .options('l', {
    alias: 'list-rules',
    describe: 'List available rules',
    default: false
  })
  .options('v', {
    alias: 'version',
    describe: 'Display version number',
    default: false
  })
  .epilog('See https://github.com/danielgtaylor/apilint#readme for more information');
const {argv} = parser;

const WIDTH = clc.windowSize.width;

function getLineInfo(source, position) {
  let number = 1;
  let remainder = position;
  let lines = [''];

  for (let i = 0; i < position; i++) {
    lines[lines.length - 1] += source[i];

    if (source[i] === '\n') {
      number++;
      remainder = position - i;
      lines.push('');

      while (lines.length > 3) {
        lines.shift();
      }
    }
  }

  for (let i = position; i < source.length; i++) {
    lines[lines.length - 1] += source[i];

    if (source[i] === '\n') {
      if (lines.length == 5) {
        break;
      }

      lines.push('');
    }
  }

  return {number, remainder, lines};
}

function getSourcemap(element) {
  let current = element;

  while (current && (!current.sourcemap || current.sourcemap.length < 1) && current.parent) {
    current = current.parent;
  }

  if (current instanceof Array) {
    return current;
  }

  return current && current.sourcemap;
}

if (argv.version) {
  console.log(`apilint ${require('../package.json').version}`);
  process.exit(0);
}

if (argv.listRules) {
  const linter = new ApiLinter();
  console.log(linter.ruleNames
    .map(item => recase(item, 'dash-case'))
    .join('\n'));
  process.exit(0);
}

if (argv._.length !== 1) {
  parser.showHelp();
  process.exit(255);
}

const linter = new ApiLinter();

if (fs.existsSync('.apilint.json')) {
  const apiLintConfig = JSON.parse(fs.readFileSync('.apilint.json', 'utf8'));

  if (apiLintConfig.load) {
    ApiLinter.load(path.resolve(apiLintConfig.load));
  }

  for (const name in apiLintConfig.config || {}) {
    const ruleConfig = apiLintConfig.config[name];

    linter[recase(name, 'lower-camel-case')](ruleConfig);
  }
} else {
  linter.useDefaults();
}

fs.readFile(argv._[0], 'utf8', (err, source) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  Mateo.parse(source, (parseErr, parsed) => {
    if (parseErr) {
      console.log(parseErr);
      process.exit(1);
    }

    let counts = {
      error: 0,
      warn: 0
    };

    const issues = [...linter.lint(parsed, source)];

    // Sort by sourcemap starting character
    issues.sort((a, b) => {
      as = getSourcemap(a.element);
      bs = getSourcemap(b.element);

      if (!(as && bs)) {
        return 1;
      }

      return as[0][0] - bs[0][0];
    });

    for (const issue of issues) {
      let msg = '';
      let severityColor = clc.xterm(32);

      if (issue.severity === 'error') {
        severityColor = clc.red;
      } else if (issue.severity === 'warn') {
        severityColor = clc.yellow;
      }

      if (counts[issue.severity] === undefined) {
        counts[issue.severity] = 0;
      }

      counts[issue.severity]++;

      const sourcemap = getSourcemap(issue.element);

      let info = {number: '?', remainder: '?', lines: []};

      if (sourcemap) {
        info = getLineInfo(source, sourcemap[0][0]);
      }

      msg += clc.xterm(32)(pad(5, info.number)) + clc.xterm(240)(':') + clc.xterm(25)(info.remainder);

      msg += severityColor(` ${issue.severity} `);

      msg += wrap(clc.getStrippedLength(msg), WIDTH - 1)(issue.message +
        ' ' + clc.xterm(240)(issue.ruleId)).trim() + '\n\n';

      let minPrePadding = null;
      for (let line of info.lines) {
        try {
          const prePadding = line.match(/^ */)[0].length;
          if (minPrePadding === null || prePadding < minPrePadding) {
            minPrePadding = prePadding;
          }
        } catch (err) {}
      }

      if (minPrePadding === null) {
        minPrePadding = 0;
      }

      for (let i = 0; i < info.lines.length; i++) {
        let line = info.lines[i].substr(minPrePadding, WIDTH - 10 - 1);

        if (line[line.length - 1] !== '\n') {
          line += '\n';
        }

        if (i == 2) {
          msg += `        ${clc.xterm(245)('|')} ${clc.xterm(250)(line)}`;
        } else {
          msg += `        ${clc.xterm(235)('|')} ${clc.xterm(240)(line)}`;
        }
      }

      console.log(msg);
    }

    console.log(clc.red(`${counts['error'] || 0} Error${counts['error'] === 1 ? '' : 's'}`) + ' ' + clc.yellow(`${counts['warn'] || 0} Warning${counts['warn'] === 1 ? '' : 's'}`));

    process.exit(counts['error'] + counts['warn'] > 0 ? 1 : 0);
  });
});
