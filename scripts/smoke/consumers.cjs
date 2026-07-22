const pkg = require('@lukeaus/plain-tree');
const assert = require('assert');

// VAL-PKG-010: exact export set
assert.deepStrictEqual(Object.keys(pkg).sort(), [
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

// VAL-PKG-007: construct root, add child, construct Tree, observe relationships
const root = new pkg.Node('root');
const child = root.addChild('child');
const tree = new pkg.Tree(root);
assert.strictEqual(child.parent, root);
assert.strictEqual(root.children[0], child);
assert.strictEqual(tree.countNodes(), 2);

// VAL-PKG-014: utilities callable and correct, no input mutation
assert.strictEqual(pkg.nodeData({ data: 'x' }), 'x');
assert.deepStrictEqual(pkg.nodesData([{ data: 1 }, { data: 2 }]), [1, 2]);
assert.strictEqual(pkg.hasChildren(root), true);
assert.strictEqual(pkg.firstArrayElement([9, 8]), 9);
assert.strictEqual(pkg.firstArrayElement([]), null);
const src = { a: 1, b: 2 };
const filtered = pkg.filterObject(src, { disallowedKeys: ['b'] });
assert.deepStrictEqual(filtered, { a: 1 });
assert.deepStrictEqual(src, { a: 1, b: 2 }); // not mutated
assert.strictEqual(typeof pkg.generateId(), 'string');
assert.ok(pkg.generateId().length > 0);

console.log('CJS smoke OK');
