#!/usr/bin/env node
// ponytail: AST-based packed-declaration contract check. Uses the installed
// TypeScript compiler API (no grep, no new dependency). Asserts the first
// parameter of objectToNode (build/create.d.ts) and filterObject
// (build/utils.d.ts) is exactly `object` (ObjectKeyword). Formatting-independent:
// walks the parsed AST, not declaration text.
const assert = require('assert');
const { execSync } = require('child_process');
const ts = require('typescript');

const tarball = process.argv[2];
assert.ok(tarball, 'usage: decl-param-check.cjs <tarball>');

const targets = [
  { member: 'package/build/create.d.ts', fn: 'objectToNode' },
  { member: 'package/build/utils.d.ts', fn: 'filterObject' }
];

for (const { member, fn } of targets) {
  const src = execSync(
    `tar -xzOf ${JSON.stringify(tarball)} ${JSON.stringify(member)}`
  ).toString();
  const sf = ts.createSourceFile(
    member,
    src,
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TS
  );
  let found = false;
  sf.forEachChild(node => {
    if (!ts.isVariableStatement(node)) return;
    for (const decl of node.declarationList.declarations) {
      if (decl.name.getText(sf) !== fn) continue;
      found = true;
      // In a .d.ts the arrow signature is the variable's type annotation
      // (FunctionTypeNode), not an initializer.
      const typeNode = decl.type;
      assert.ok(
        typeNode && ts.isFunctionTypeNode(typeNode),
        `${fn}: declaration type must be a function type`
      );
      const params = typeNode.parameters;
      assert.ok(params && params.length >= 1, `${fn}: missing first parameter`);
      const firstParamType = params[0].type;
      assert.ok(
        firstParamType,
        `${fn}: first parameter has no type annotation`
      );
      assert.strictEqual(
        firstParamType.kind,
        ts.SyntaxKind.ObjectKeyword,
        `${fn}: first parameter must be object (ObjectKeyword), got ${ts.SyntaxKind[firstParamType.kind]}`
      );
    }
  });
  assert.ok(found, `${fn}: declaration not found in ${member}`);
}
console.log(
  'Packed declaration contract OK (objectToNode, filterObject: obj: object)'
);
