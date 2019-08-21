import { Node, nodeData } from '../src/index';

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
      const node = new Node('a');
      node.addChild('b');
      expect(node.children.length).toEqual(1);
      expect(node.children[0].children).toEqual([]);
    });
    test('returns node', () => {
      const nodeA = new Node('a');
      const nodeB = nodeA.addChild('b');
      expect(nodeB instanceof Node).toBe(true);
      expect(typeof nodeB).toBe('object');
    });
  });
  describe('removeChildrenByData', () => {
    test('can remove a child', () => {
      const node = new Node('a');
      node.addChild('b');
      expect(node.children.length).toEqual(1);
      node.removeChildrenByData('b');
      expect(node.children.length).toEqual(0);
    });
    test.only('returns removed children', () => {
      const node = new Node('a');
      node.addChild('b');
      node.addChild('b');
      node.addChild('c');
      expect(node.children.length).toEqual(3);
      const result = node.removeChildrenByData('b');
      expect(result.length).toBe(2);
      result.forEach(r => {
        expect(r instanceof Node).toBe(true);
      });
    });
  });
  describe('removeChildrenById', () => {
    test('can remove a child', () => {
      const node = new Node('a');
      const nodeB = node.addChild('b');
      expect(node.children.length).toEqual(1);
      node.removeChildrenById(nodeB.id);
      expect(node.children.length).toEqual(0);
    });
    test.only('returns removed children', () => {
      const node = new Node('a');
      const nodeB = node.addChild('b');
      node.addChild('b');
      node.addChild('c');
      expect(node.children.length).toEqual(3);
      const result = node.removeChildrenById(nodeB.id);
      expect(result.length).toBe(1);
      expect(result[0] instanceof Node).toBe(true);
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
    test('returns removed children', () => {
      const node = new Node('x');
      node.addChild('b');
      node.addChild('b');
      node.addChild('c');
      expect(node.children.length).toEqual(3);
      const fn = (node: Node): boolean => nodeData(node) === 'b';
      const result = node.removeChildren(fn);
      expect(result.length).toBe(2);
      result.forEach(r => {
        expect(r instanceof Node).toBe(true);
      });
    });
  });
  describe('isLeaf', () => {
    test('no children', () => {
      const node = new Node('a');
      expect(node.isLeaf()).toBe(true);
    });
    test('1 child', () => {
      const node = new Node('a');
      node.addChild('b');
      expect(node.isLeaf()).toBe(false);
    });
  });
  describe('hasChildren', () => {
    test('no children', () => {
      const node = new Node('a');
      expect(node.hasChildren()).toBe(false);
    });
    test('1 child', () => {
      const node = new Node('a');
      node.addChild('b');
      expect(node.hasChildren()).toBe(true);
    });
  });
});
