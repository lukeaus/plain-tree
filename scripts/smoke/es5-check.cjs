const { Linter } = require('eslint');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const linter = new Linter();
const baseDir = process.env.CONSUMER_DIR
  ? path.join(
      process.env.CONSUMER_DIR,
      'node_modules/@lukeaus/plain-tree/build'
    )
  : 'build';
// ponytail: one explicit temp path; pack.sh exports the same var so read == write.
const esmConverted = process.env.ESM_CONVERTED_PATH || '/tmp/esm-converted.cjs';

function check(target, sourceType) {
  const code = fs.readFileSync(target, 'utf8');
  const diags = linter.verify(code, {
    languageOptions: { ecmaVersion: 5, sourceType }
  });
  assert.deepStrictEqual(
    diags,
    [],
    `${target} has non-ES5 syntax: ${JSON.stringify(diags)}`
  );
}

// Script bundles: pure ES5
check(path.join(baseDir, 'index.js'), 'script');
check(path.join(baseDir, 'index.umd.js'), 'script');
// ESM bundle converted to CJS with ES5 generated code (pack.sh runs the conversion)
check(esmConverted, 'script');

console.log('ES5 syntax OK');
