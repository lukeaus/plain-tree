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
  describe('parent', () => {
    test('is null be default', () => {
      const node = new Node('a');
      expect(node.parent).toBe(null);
    });
    test('is created on new node', () => {
      const node = new Node('a');
      const nodeB = node.addChild('b');
      expect(nodeB.parent).toBe(node);
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
    test('returns removed children', () => {
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
    test('returns removed children', () => {
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
    test('leaf no children', () => {
      const node = new Node('a');
      const nodeB = node.addChild('b');
      expect(nodeB.isLeaf()).toBe(true);
    });
    test('root no children', () => {
      const node = new Node('a');
      expect(node.isLeaf()).toBe(false);
    });
    test('root 1 child', () => {
      const node = new Node('a');
      node.addChild('b');
      expect(node.isLeaf()).toBe(false);
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
  describe('toJson', () => {
    test('works on a single node', () => {
      const node = new Node('a', { id: 'id_a' });
      expect(node.toJson()).toBe(
        '{"data":"a","children":[],"id":"id_a","parentId":null}'
      );
    });
    test('works on parent with child', () => {
      const node = new Node('a', { id: 'id_a' });
      node.addChild('b', { id: 'id_b' });
      expect(node.toJson()).toBe(
        '{"data":"a","children":[{"data":"b","children":[],"id":"id_b","parentId":"id_a"}],"id":"id_a","parentId":null}'
      );
    });
    test('works on parent with children', () => {
      const node = new Node('a', { id: 'id_a' });
      node.addChild('b', { id: 'id_b' });
      node.addChild('c', { id: 'id_c' });
      expect(node.toJson()).toBe(
        '{"data":"a","children":[{"data":"b","children":[],"id":"id_b","parentId":"id_a"},{"data":"c","children":[],"id":"id_c","parentId":"id_a"}],"id":"id_a","parentId":null}'
      );
    });
    test('works on child', () => {
      const node = new Node('a', { id: 'id_a' });
      const nodeB = node.addChild('b', { id: 'id_b' });
      expect(nodeB.toJson()).toBe(
        '{"data":"b","children":[],"id":"id_b","parentId":"id_a"}'
      );
    });
  });
  describe('depth', () => {
    test('node without parent should have depth 0', () => {
      const node = new Node(null);
      expect(node.depth()).toBe(0);
    });
    test('node with parent should have depth 1', () => {
      const node = new Node(null);
      const nodeChild = node.addChild(null);
      expect(nodeChild.depth()).toBe(1);
    });
    test('node with parent with parent should have depth 2', () => {
      const node = new Node(null);
      const nodeChild = node.addChild(null);
      const nodeChildChild = nodeChild.addChild(null);
      expect(nodeChildChild.depth()).toBe(2);
    });
  });
  describe('height', () => {
    test('node without children should have height 0', () => {
      const node = new Node(null);
      expect(node.height()).toBe(0);
    });
    test('node with single child with no children should have height 1', () => {
      const node = new Node(null);
      node.addChild(null);
      expect(node.height()).toBe(1);
    });
    test('node with single child with one child should have hieght 2', () => {
      const node = new Node(null);
      const nodeChild = node.addChild(null);
      nodeChild.addChild(null);
      expect(node.height()).toBe(2);
    });
    test('node with multiple children with one child should have hieght 2', () => {
      const node = new Node(null);
      node.addChild(null);
      const nodeChildB = node.addChild(null);
      nodeChildB.addChild(null);
      expect(node.height()).toBe(2);
    });
  });
  describe('widthsByHeight', () => {
    test('is a function', () => {
      const root = new Node('x');
      expect(typeof root.widthsByHeight).toEqual('function');
    });
    test('returns number of nodes at widest point', () => {
      const root = new Node(0);
      root.addChild(1);
      root.addChild(2);
      root.addChild(3);
      root.children[0].addChild(4);
      root.children[2].addChild(5);
      expect(root.widthsByHeight()).toEqual([1, 3, 2]);
    });
    test('returns number of nodes at widest point', () => {
      const root = new Node(0);
      root.addChild(1);
      root.children[0].addChild(2);
      root.children[0].addChild(3);
      root.children[0].children[0].addChild(4);
      expect(root.widthsByHeight()).toEqual([1, 1, 2, 1]);
    });
  });
});
describe('flattenByHeight', () => {
  test('node is not null', () => {
    const node = new Node('a');
    expect(node.flattenByHeight(nodeData)).toEqual([['a']]);
  });
  test('it works', () => {
    const nodeA = new Node('a');
    nodeA.addChild('b');
    const nodeC = nodeA.addChild('c');
    nodeC.addChild('d');
    expect(nodeA.flattenByHeight(nodeData)).toEqual([['a'], ['b', 'c'], ['d']]);
  });
});
