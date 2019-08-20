import Node from '../Node';
import { nodeData } from '../utils';

describe('Node', () => {
  describe('data', () => {
    test('has data property', () => {
      const node = new Node('x');
      expect(node.data).toEqual('x');
    });
  });
  describe('children', () => {
    test('has children property', () => {
      const node = new Node('x');
      expect('children' in node).toBe(true);
      expect(node.children.length).toEqual(0);
    });
  });
  describe('addChild', () => {
    test('can add a child', () => {
      const node = new Node('x');
      node.addChild('b');
      expect(node.children.length).toEqual(1);
      expect(node.children[0].children).toEqual([]);
    });
    test('returns node', () => {
      const nodeA = new Node('x');
      const nodeB = nodeA.addChild('b');
      expect(nodeB instanceof Node).toBe(true);
      expect(typeof nodeB).toBe('object');
    });
  });
  describe('removeChildrenByData', () => {
    test('can remove a child', () => {
      const node = new Node('x');
      node.addChild('b');
      expect(node.children.length).toEqual(1);
      node.removeChildrenByData('b');
      expect(node.children.length).toEqual(0);
    });
  });
  describe('removeChildren', () => {
    test('can remove a child', () => {
      const node = new Node('x');
      node.addChild('b');
      node.addChild('b');
      node.addChild('c');
      expect(node.children.length).toEqual(3);
      const fn = (node: Node): boolean => nodeData(node) === 'b';
      node.removeChildren(fn);
      expect(node.children.length).toEqual(1);
    });
  });
  describe('isLeaf', () => {
    test('no children', () => {
      const node = new Node('');
      expect(node.isLeaf()).toBe(false);
    });
  });
});
