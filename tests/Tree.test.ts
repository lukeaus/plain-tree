import { Tree, Node, nodesData, nodeData } from '../src';
import { NodeOrNull } from '../src/types';

describe('Tree', () => {
  describe('root', () => {
    test('can get root', () => {
      const root = new Node('a');
      const tree = new Tree(root);
      expect(tree.root.data).toBe('a');
    });
    test('is null if no root node passed', () => {
      const tree = new Tree();
      expect(tree.root).toEqual(null);
    });
  });
  describe('traverseBreathFirst', () => {
    test('it works', () => {
      const values: Array<NodeOrNull> = [];
      const tree = new Tree();
      tree.root = new Node(1);
      tree.root.addChild(2);
      tree.root.addChild(3);
      tree.root.children[0].addChild(4);
      tree.traverseBreathFirst((node: Node) => {
        values.push(node);
      });
      expect(nodesData(values)).toEqual([1, 2, 3, 4]);
    });
  });
  describe('traverseDepthFirst', () => {
    test('it works', () => {
      const values: Array<NodeOrNull> = [];
      const tree = new Tree();
      tree.root = new Node(1);
      tree.root.addChild(2);
      tree.root.addChild(4);
      tree.root.children[0].addChild(3);
      tree.traverseDepthFirst((node: Node) => {
        values.push(node);
      });
      expect(nodesData(values)).toEqual([1, 2, 3, 4]);
    });
  });
  describe('flatten', () => {
    test('it works', () => {
      const tree = new Tree();
      tree.root = new Node(1);
      tree.root.addChild(2);
      tree.root.addChild(3);
      tree.root.children[0].addChild(4);
      expect(tree.flatten(nodeData)).toEqual([1, 2, 3, 4]);
    });
  });
  describe('flattenByLevel', () => {
    test('root is null', () => {
      const tree = new Tree();
      expect(tree.flattenByLevel(nodeData)).toEqual([[null]]);
    });
    test('root is not null', () => {
      const node = new Node('a');
      const tree = new Tree(node);
      expect(tree.flattenByLevel(nodeData)).toEqual([['a']]);
    });
    test('it works', () => {
      const nodeA = new Node('a');
      const tree = new Tree(nodeA);
      nodeA.addChild('b');
      const nodeC = nodeA.addChild('c');
      nodeC.addChild('d');
      expect(tree.flattenByLevel(nodeData)).toEqual([['a'], ['b', 'c'], ['d']]);
    });
  });
  describe('flattenDataByLevel', () => {
    test('root is null', () => {
      const tree = new Tree();
      expect(tree.flattenDataByLevel()).toEqual([[null]]);
    });
    test('root is not null', () => {
      const node = new Node('a');
      const tree = new Tree(node);
      expect(tree.flattenDataByLevel()).toEqual([['a']]);
    });
    test('it works', () => {
      const nodeA = new Node('a');
      const tree = new Tree(nodeA);
      nodeA.addChild('b');
      const nodeC = nodeA.addChild('c');
      nodeC.addChild('d');
      expect(tree.flattenDataByLevel()).toEqual([['a'], ['b', 'c'], ['d']]);
    });
  });
  describe('flattenData', () => {
    test('it works', () => {
      const tree = new Tree();
      tree.root = new Node(1);
      tree.root.addChild(2);
      tree.root.addChild(3);
      tree.root.children[0].addChild(4);
      expect(tree.flattenData()).toEqual([1, 2, 3, 4]);
    });
  });
  describe('someBreathFirst', () => {
    describe('returns true', () => {
      test('1 node null', () => {
        const tree = new Tree();
        const fn = (): boolean => true;
        expect(tree.someBreathFirst(fn)).toBe(true);
      });
      test('1 node', () => {
        const root = new Node('x');
        const tree = new Tree(root);
        const fn = (node: NodeOrNull): boolean => nodeData(node) === 'x';
        expect(tree.someBreathFirst(fn)).toBe(true);
      });
      test('3 nodes', () => {
        const root = new Node('x');
        const tree = new Tree(root);
        root.addChild('y');
        root.addChild('z');
        const fn = (node: NodeOrNull): boolean => nodeData(node) === 'x';
        expect(tree.someBreathFirst(fn)).toBe(true);
      });
      test('3 nodes fn only called once', () => {
        const root = new Node('x');
        const tree = new Tree(root);
        root.addChild('y');
        root.addChild('z');
        const _fn = (node: NodeOrNull): boolean => nodeData(node) === 'x';
        const fn = jest.fn(_fn);
        expect(tree.someBreathFirst(fn)).toBe(true);
        expect(fn.mock.calls.length).toBe(1);
      });
    });
    describe('returns false', () => {
      test('1 node null', () => {
        const tree = new Tree();
        const fn = (): boolean => false;
        expect(tree.someBreathFirst(fn)).toBe(false);
      });
      test('1 node', () => {
        const root = new Node('x');
        const tree = new Tree(root);
        const fn = (node: NodeOrNull): boolean => nodeData(node) === 'a';
        expect(tree.someBreathFirst(fn)).toBe(false);
      });
      test('3 nodes', () => {
        const root = new Node('x');
        const tree = new Tree(root);
        root.addChild('y');
        root.addChild('z');
        const fn = (node: NodeOrNull): boolean => nodeData(node) === 'a';
        expect(tree.someBreathFirst(fn)).toBe(false);
      });
      test('3 nodes fn called correct number of times', () => {
        const root = new Node('x');
        const tree = new Tree(root);
        root.addChild('y');
        root.addChild('z');
        const _fn = (node: NodeOrNull): boolean => nodeData(node) === 'a';
        const fn = jest.fn(_fn);
        expect(tree.someBreathFirst(fn)).toBe(false);
        expect(fn.mock.calls.length).toBe(3);
      });
    });
  });
  describe('someDepthFirst', () => {
    describe('returns true', () => {
      test('1 node null', () => {
        const tree = new Tree();
        const fn = (): boolean => true;
        expect(tree.someDepthFirst(fn)).toBe(true);
      });
      test('1 node', () => {
        const root = new Node('x');
        const tree = new Tree(root);
        const fn = (node: NodeOrNull): boolean => nodeData(node) === 'x';
        expect(tree.someDepthFirst(fn)).toBe(true);
      });
      test('3 nodes', () => {
        const root = new Node('x');
        const tree = new Tree(root);
        root.addChild('y');
        root.addChild('z');
        const fn = (node: NodeOrNull): boolean => nodeData(node) === 'x';
        expect(tree.someDepthFirst(fn)).toBe(true);
      });
      test('3 nodes fn only called once', () => {
        const root = new Node('x');
        const tree = new Tree(root);
        root.addChild('y');
        root.addChild('z');
        const _fn = (node: NodeOrNull): boolean => nodeData(node) === 'x';
        const fn = jest.fn(_fn);
        expect(tree.someDepthFirst(fn)).toBe(true);
        expect(fn.mock.calls.length).toBe(1);
      });
    });
    describe('returns false', () => {
      test('1 node null', () => {
        const tree = new Tree();
        const fn = (): boolean => false;
        expect(tree.someDepthFirst(fn)).toBe(false);
      });
      test('1 node', () => {
        const root = new Node('x');
        const tree = new Tree(root);
        const fn = (node: NodeOrNull): boolean => nodeData(node) === 'a';
        expect(tree.someDepthFirst(fn)).toBe(false);
      });
      test('3 nodes', () => {
        const root = new Node('x');
        const tree = new Tree(root);
        root.addChild('y');
        root.addChild('z');
        const fn = (node: NodeOrNull): boolean => nodeData(node) === 'a';
        expect(tree.someDepthFirst(fn)).toBe(false);
      });
      test('3 nodes fn called correct number of times', () => {
        const root = new Node('x');
        const tree = new Tree(root);
        root.addChild('y');
        root.addChild('z');
        const _fn = (node: NodeOrNull): boolean => nodeData(node) === 'a';
        const fn = jest.fn(_fn);
        expect(tree.someDepthFirst(fn)).toBe(false);
        expect(fn.mock.calls.length).toBe(3);
      });
    });
  });
  describe('everyBreathFirst', () => {
    describe('returns true', () => {
      test('1 node null', () => {
        const tree = new Tree();
        expect(tree.everyBreathFirst((node: Node) => node === null)).toBe(true);
      });
      test('1 node', () => {
        const root = new Node('x');
        const tree = new Tree(root);
        expect(
          tree.everyBreathFirst((node: Node) => nodeData(node) === 'x')
        ).toBe(true);
      });
      test('3 nodes', () => {
        const root = new Node('x');
        const tree = new Tree(root);
        root.addChild('y');
        root.addChild('z');
        expect(
          tree.everyBreathFirst((node: Node) =>
            ['x', 'y', 'z'].includes(nodeData(node))
          )
        ).toBe(true);
      });
      test('3 nodes fn called correct number of times', () => {
        const root = new Node('x');
        const tree = new Tree(root);
        root.addChild('y');
        root.addChild('z');
        const _fn = (node: Node): boolean =>
          ['x', 'y', 'z'].includes(nodeData(node));
        const fn = jest.fn(_fn);
        expect(tree.everyBreathFirst(fn)).toBe(true);
        expect(fn.mock.calls.length).toBe(3);
      });
    });
    describe('returns false', () => {
      test('1 node null', () => {
        const tree = new Tree();
        expect(
          tree.everyBreathFirst((node: Node) => nodeData(node) === 'x')
        ).toBe(false);
      });
      test('1 node', () => {
        const root = new Node('x');
        const tree = new Tree(root);
        expect(
          tree.everyBreathFirst((node: Node) => nodeData(node) === 'a')
        ).toBe(false);
      });
      test('3 nodes', () => {
        const root = new Node('x');
        const tree = new Tree(root);
        root.addChild('y');
        root.addChild('z');
        expect(
          tree.everyBreathFirst((node: Node) => nodeData(node) === 'x')
        ).toBe(false);
      });
      test('breaks early', () => {
        const root = new Node('x');
        const tree = new Tree(root);
        root.addChild('y');
        const fn = jest.fn();
        expect(tree.everyBreathFirst(fn)).toBe(false);
        expect(fn.mock.calls.length).toBe(1);
      });
    });
  });
  describe('everyDepthFirst', () => {
    describe('returns true', () => {
      test('1 node', () => {
        const root = new Node('x');
        const tree = new Tree(root);
        expect(
          tree.everyDepthFirst((node: Node) => nodeData(node) === 'x')
        ).toBe(true);
      });
      test('3 nodes', () => {
        const root = new Node('x');
        const tree = new Tree(root);
        root.addChild('y');
        root.addChild('z');
        expect(
          tree.everyDepthFirst((node: Node) =>
            ['x', 'y', 'z'].includes(nodeData(node))
          )
        ).toBe(true);
      });
      test('3 nodes fn called correct number of times', () => {
        const root = new Node('x');
        const tree = new Tree(root);
        root.addChild('y');
        root.addChild('z');
        const _fn = (node: Node): boolean =>
          ['x', 'y', 'z'].includes(nodeData(node));
        const fn = jest.fn(_fn);
        expect(tree.everyDepthFirst(fn)).toBe(true);
        expect(fn.mock.calls.length).toBe(3);
      });
    });
    describe('returns false', () => {
      test('1 node', () => {
        const root = new Node('x');
        const tree = new Tree(root);
        expect(
          tree.everyDepthFirst((node: Node) => nodeData(node) === 'a')
        ).toBe(false);
      });
      test('3 nodes', () => {
        const root = new Node('x');
        const tree = new Tree(root);
        root.addChild('y');
        root.addChild('z');
        expect(
          tree.everyDepthFirst((node: Node) => nodeData(node) === 'x')
        ).toBe(false);
      });
      test('breaks early', () => {
        const root = new Node('x');
        const tree = new Tree(root);
        root.addChild('y');
        const fn = jest.fn();
        expect(tree.everyDepthFirst(fn)).toBe(false);
        expect(fn.mock.calls.length).toBe(1);
      });
    });
  });
  describe('findOneBreathFirst', () => {
    describe('returns one node', () => {
      test('1 node', () => {
        const root = new Node('x');
        const tree = new Tree(root);
        expect(
          tree.findOneBreathFirst((node: Node) => nodeData(node) === 'x')
        ).toBe(root);
      });
      test('3 nodes', () => {
        const root = new Node('x');
        const tree = new Tree(root);
        root.addChild('y');
        root.addChild('z');
        expect(
          tree.findOneBreathFirst((node: Node) =>
            ['x', 'y', 'z'].includes(nodeData(node))
          )
        ).toEqual(root);
      });
      test('3 nodes fn called correct number of times', () => {
        const root = new Node('x');
        const tree = new Tree(root);
        root.addChild('y');
        root.addChild('z');
        const _fn = (node: Node): boolean =>
          ['x', 'y', 'z'].includes(nodeData(node));
        const fn = jest.fn(_fn);
        expect(tree.findOneBreathFirst(fn)).toEqual(root);
        expect(fn.mock.calls.length).toBe(1);
      });
    });
    describe('returns null', () => {
      test('1 node', () => {
        const root = new Node('x');
        const tree = new Tree(root);
        expect(
          tree.findOneBreathFirst((node: Node) => nodeData(node) === 'a')
        ).toBe(null);
      });
      test('3 nodes', () => {
        const root = new Node('x');
        const tree = new Tree(root);
        root.addChild('y');
        root.addChild('z');
        expect(
          tree.findOneBreathFirst((node: Node) => nodeData(node) === 'x')
        ).toBe(root);
      });
      test('breaks early', () => {
        const root = new Node('x');
        const tree = new Tree(root);
        root.addChild('y');
        const fn = jest.fn();
        expect(tree.findOneBreathFirst(fn)).toBe(null);
        expect(fn.mock.calls.length).toBe(2);
      });
    });
  });
  describe('findOneDepthFirst', () => {
    describe('returns one node', () => {
      test('1 node', () => {
        const root = new Node('x');
        const tree = new Tree(root);
        expect(
          tree.findOneDepthFirst((node: Node) => nodeData(node) === 'x')
        ).toBe(root);
      });
      test('3 nodes', () => {
        const root = new Node('x');
        const tree = new Tree(root);
        root.addChild('y');
        root.addChild('z');
        expect(
          tree.findOneDepthFirst((node: Node) =>
            ['x', 'y', 'z'].includes(nodeData(node))
          )
        ).toEqual(root);
      });
      test('3 nodes fn called correct number of times', () => {
        const root = new Node('x');
        const tree = new Tree(root);
        root.addChild('y');
        root.addChild('z');
        const _fn = (node: Node): boolean =>
          ['x', 'y', 'z'].includes(nodeData(node));
        const fn = jest.fn(_fn);
        expect(tree.findOneDepthFirst(fn)).toEqual(root);
        expect(fn.mock.calls.length).toBe(1);
      });
    });
    describe('returns null', () => {
      test('1 node', () => {
        const root = new Node('x');
        const tree = new Tree(root);
        expect(
          tree.findOneDepthFirst((node: Node) => nodeData(node) === 'a')
        ).toBe(null);
      });
      test('3 nodes', () => {
        const root = new Node('x');
        const tree = new Tree(root);
        root.addChild('y');
        root.addChild('z');
        expect(
          tree.findOneDepthFirst((node: Node) => nodeData(node) === 'x')
        ).toBe(root);
      });
      test('breaks early', () => {
        const root = new Node('x');
        const tree = new Tree(root);
        root.addChild('y');
        const fn = jest.fn();
        expect(tree.findOneDepthFirst(fn)).toBe(null);
        expect(fn.mock.calls.length).toBe(2);
      });
    });
  });
  describe('findAllBreathFirst', () => {
    describe('returns array with nodes', () => {
      test('1 node null', () => {
        const tree = new Tree();
        expect(tree.findAllBreathFirst((node: Node) => node === null)).toEqual([
          null
        ]);
      });
      test('1 node', () => {
        const root = new Node('x');
        const tree = new Tree(root);
        expect(
          tree.findAllBreathFirst((node: Node) => nodeData(node) === 'x')
        ).toEqual([root]);
      });
      test('3 nodes', () => {
        const root = new Node('a');
        const tree = new Tree(root);
        const nodeB = root.addChild('b');
        const nodeC = root.addChild('c');
        const nodeD = nodeB.addChild('d');
        expect(
          tree.findAllBreathFirst((node: Node) =>
            ['a', 'b', 'c', 'd'].includes(nodeData(node))
          )
        ).toStrictEqual([root, nodeB, nodeC, nodeD]);
      });
    });
    describe('returns empty array', () => {
      test('1 node null', () => {
        const tree = new Tree();
        expect(
          tree.findAllBreathFirst((node: Node) => nodeData(node) === 'x')
        ).toEqual([]);
      });
      test('1 node', () => {
        const root = new Node('x');
        const tree = new Tree(root);
        expect(
          tree.findAllBreathFirst((node: Node) => nodeData(node) === 'a')
        ).toEqual([]);
      });
    });
  });
  describe('findAllDepthFirst', () => {
    describe('returns array with nodes', () => {
      test('1 node null', () => {
        const tree = new Tree();
        expect(tree.findAllDepthFirst((node: Node) => node === null)).toEqual([
          null
        ]);
      });
      test('1 node', () => {
        const root = new Node('x');
        const tree = new Tree(root);
        expect(
          tree.findAllDepthFirst((node: Node) => nodeData(node) === 'x')
        ).toEqual([root]);
      });
      test('3 nodes', () => {
        const root = new Node('a');
        const tree = new Tree(root);
        const nodeB = root.addChild('b');
        const nodeC = root.addChild('c');
        const nodeD = nodeB.addChild('d');
        expect(
          tree.findAllDepthFirst((node: Node) =>
            ['a', 'b', 'c', 'd'].includes(nodeData(node))
          )
        ).toStrictEqual([root, nodeB, nodeD, nodeC]);
      });
    });
    describe('returns empty array', () => {
      test('1 node null', () => {
        const tree = new Tree();
        expect(
          tree.findAllDepthFirst((node: Node) => nodeData(node) === 'x')
        ).toEqual([]);
      });
      test('1 node', () => {
        const root = new Node('x');
        const tree = new Tree(root);
        expect(
          tree.findAllDepthFirst((node: Node) => nodeData(node) === 'a')
        ).toEqual([]);
      });
    });
  });
  describe('widthsByHeight', () => {
    test('is a function', () => {
      const root = new Node('x');
      const tree = new Tree(root);
      expect(typeof tree.widthsByHeight).toEqual('function');
    });
    test('root is null', () => {
      const tree = new Tree();
      expect(tree.widthsByHeight()).toEqual([1]);
    });
    test('returns number of nodes at widest point', () => {
      const root = new Node(0);
      const tree = new Tree(root);
      root.addChild(1);
      root.addChild(2);
      root.addChild(3);
      root.children[0].addChild(4);
      root.children[2].addChild(5);
      expect(tree.widthsByHeight()).toEqual([1, 3, 2]);
    });
    test('returns number of nodes at widest point', () => {
      const root = new Node(0);
      const tree = new Tree(root);
      root.addChild(1);
      root.children[0].addChild(2);
      root.children[0].addChild(3);
      root.children[0].children[0].addChild(4);
      expect(tree.widthsByHeight()).toEqual([1, 1, 2, 1]);
    });
  });

  describe('atHeight', () => {
    test('root null, height 0', () => {
      const tree = new Tree(null);
      const result = tree.atHeight(0);
      expect(nodesData(result)).toEqual([null]);
    });
    test('height 2', () => {
      const root = new Node(0);
      const tree = new Tree(root);
      root.addChild(1);
      root.children[0].addChild(2);
      root.children[0].addChild(3);
      root.children[0].children[0].addChild(4);
      const result = tree.atHeight(2);
      expect(nodesData(result)).toEqual([2, 3]);
    });
    test('height 3', () => {
      const root = new Node(0);
      const tree = new Tree(root);
      root.addChild(1);
      root.children[0].addChild(2);
      root.children[0].addChild(3);
      root.children[0].children[0].addChild(4);
      const result = tree.atHeight(3);
      expect(nodesData(result)).toEqual([4]);
    });
    test('height greater than max height', () => {
      const height = 4;
      const root = new Node(0);
      const tree = new Tree(root);
      root.addChild(1);
      root.children[0].addChild(2);
      root.children[0].addChild(3);
      root.children[0].children[0].addChild(4);
      const result = tree.atHeight(height);
      expect(tree.height()).toBeLessThan(height);
      expect(nodesData(result)).toEqual([]);
    });
  });
  describe('maxWidth', () => {
    test('it works', () => {
      const root = new Node(0);
      const tree = new Tree(root);
      root.addChild(1);
      root.children[0].addChild(2);
      root.children[0].addChild(3);
      root.children[0].addChild(4);
      root.children[0].children[0].addChild(5);
      expect(tree.maxWidth()).toEqual(3);
    });
  });
  describe('height', () => {
    test('tree with root null has height 0', () => {
      const tree = new Tree();
      expect(tree.height()).toBe(0);
    });
    test('tree with one node height 0', () => {
      const root = new Node('x');
      const tree = new Tree(root);
      expect(tree.height()).toBe(0);
    });
    test('tree with height 2', () => {
      const root = new Node(0);
      const tree = new Tree(root);
      root.addChild(1);
      root.children[0].addChild(2);
      expect(tree.height()).toBe(2);
    });
  });
});
