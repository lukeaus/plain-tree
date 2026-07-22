import {
  createTreeFromFlatArray,
  Node,
  Tree
} from '@lukeaus/plain-tree/build/index.mjs';
import * as ns from '@lukeaus/plain-tree/build/index.mjs';
import assert from 'node:assert/strict';

// VAL-PKG-010: thirteen-name set against the ESM namespace
assert.deepStrictEqual(Object.keys(ns).sort(), [
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

// VAL-PKG-008: createTreeFromFlatArray builds a two-node root/child tree
const tree = createTreeFromFlatArray([
  { id: 'root', name: 'Root', parentId: null },
  { id: 'child', name: 'Child', parentId: 'root' }
]);
assert.ok(tree instanceof Tree);
assert.strictEqual(tree.countNodes(), 2);
assert.strictEqual(tree.root.id, 'root');
assert.strictEqual(tree.root.children[0].id, 'child');

// touch the named imports so they are exercised
assert.ok(Node);
assert.ok(Tree);

console.log('ESM smoke OK');
