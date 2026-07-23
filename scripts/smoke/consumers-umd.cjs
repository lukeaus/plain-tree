const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const umdPath = path.join(
  process.env.CONSUMER_DIR || '.',
  'node_modules/@lukeaus/plain-tree/build/index.umd.js'
);
const code = fs.readFileSync(umdPath, 'utf8');
const ctx = vm.createContext({}); // fresh, no CJS/AMD loader
vm.runInContext(code, ctx);

assert.ok(ctx.plainTree, 'globalThis.plainTree missing'); // VAL-PKG-009
const { Node, Tree, createTreeFromFlatArray } = ctx.plainTree;

// VAL-PKG-010: exact export set on the UMD global
assert.deepStrictEqual(Object.keys(ctx.plainTree).sort(), [
  'Node',
  'Tree',
  'createNodes',
  'createTreeArrayFromFlatArray',
  'createTreeFromFlatArray',
  'createTreeFromTreeArray',
  'filterObject',
  'firstArrayElement',
  'generateId',
  'hasChildren',
  'nodeData',
  'nodesData',
  'objectToNode'
]);

const tree = createTreeFromFlatArray([
  { id: 'root', parentId: null },
  { id: 'child', parentId: 'root' }
]);
assert.ok(tree instanceof Tree);
assert.strictEqual(tree.countNodes(), 2);

console.log('UMD smoke OK');
