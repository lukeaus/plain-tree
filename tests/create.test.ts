import {
  createTreeFromFlatArray,
  createTreeFromTreeArray,
  createTreeArrayFromFlatArray,
  objectToNode,
  createNodes
} from '../src/create';
import Tree from '../src/Tree';
import Node from '../src/Node';
import { ObjectAnyProperties } from '../src/types';
import { testDataComplex } from './data';

describe('objectToNode', () => {
  describe('no parent', () => {
    test('it returns node instance', () => {
      const result = objectToNode({
        id: 'sports',
        name: 'Sports'
      });
      expect(result instanceof Node).toBe(true);
    });
    test('it returns node correctly', () => {
      const result = objectToNode({
        id: 'sports',
        name: 'Sports'
      });
      expect(result.id).toBe('sports');
      expect(result.data).toEqual({ name: 'Sports' });
    });
  });
  describe('with parent', () => {
    test('it returns node with parent', () => {
      const parentNode = new Node('a');
      const result = objectToNode(
        {
          id: 'sports',
          name: 'Sports'
        },
        parentNode
      );
      expect(result.parent.data).toBe('a');
      expect(result.parent instanceof Node).toBe(true);
    });
  });
});

describe('createTreeArrayFromFlatArray', () => {
  describe('default options', () => {
    let expected: any[];
    beforeAll(() => {
      expected = [
        {
          id: 'sports',
          name: 'Sports',
          parentId: null,
          children: [
            {
              id: 'ball',
              name: 'Ball',
              parentId: 'sports',
              children: [
                {
                  id: 'tennis',
                  name: 'Tennis',
                  parentId: 'ball',
                  children: []
                }
              ]
            },
            {
              id: 'non-ball',
              name: 'Non Ball',
              parentId: 'sports',
              children: []
            }
          ]
        }
      ];
    });
    test('empty array returns empty array', () => {
      const res = createTreeArrayFromFlatArray([]);
      expect(res).toEqual([]);
    });
    test('parents before children', () => {
      const res = createTreeArrayFromFlatArray([
        {
          id: 'sports',
          name: 'Sports',
          parentId: null
        },
        {
          id: 'ball',
          name: 'Ball',
          parentId: 'sports'
        },
        {
          id: 'non-ball',
          name: 'Non Ball',
          parentId: 'sports'
        },
        {
          id: 'tennis',
          name: 'Tennis',
          parentId: 'ball'
        }
      ]);
      expect(JSON.stringify(res)).toEqual(JSON.stringify(expected));
    });
    test('children before parents', () => {
      const res = createTreeArrayFromFlatArray([
        {
          id: 'tennis',
          name: 'Tennis',
          parentId: 'ball'
        },
        {
          id: 'ball',
          name: 'Ball',
          parentId: 'sports'
        },
        {
          id: 'non-ball',
          name: 'Non Ball',
          parentId: 'sports'
        },
        {
          id: 'sports',
          name: 'Sports',
          parentId: null
        }
      ]);
      expect(JSON.stringify(res)).toEqual(JSON.stringify(expected));
    });
  });
  test('custom options', () => {
    const res = createTreeArrayFromFlatArray(
      [
        {
          _id: 'sports',
          _name: 'Sports',
          _parentId: null
        },
        {
          _id: 'ball',
          _name: 'Ball',
          _parentId: 'sports'
        },
        {
          _id: 'non-ball',
          _name: 'Non Ball',
          _parentId: 'sports'
        },
        {
          _id: 'tennis',
          _name: 'Tennis',
          _parentId: 'ball'
        }
      ],
      { idKey: '_id', parentIdKey: '_parentId' }
    );
    const expected: any[] = [
      {
        _id: 'sports',
        _name: 'Sports',
        _parentId: null,
        children: [
          {
            _id: 'ball',
            _name: 'Ball',
            _parentId: 'sports',
            children: [
              {
                _id: 'tennis',
                _name: 'Tennis',
                _parentId: 'ball',
                children: []
              }
            ]
          },
          {
            _id: 'non-ball',
            _name: 'Non Ball',
            _parentId: 'sports',
            children: []
          }
        ]
      }
    ];
    expect(JSON.stringify(res)).toEqual(JSON.stringify(expected));
  });
});

describe('createTreeFromFlatArray', () => {
  describe('default object properties', () => {
    describe('simple tree', () => {
      test('empty array returns a tree whose root is null', () => {
        const tree = createTreeFromFlatArray([]);
        expect(tree instanceof Tree).toBe(true);
        expect(tree.root).toBe(null);
      });
      test('returns a tree', () => {
        const tree = createTreeFromFlatArray([
          {
            id: 'abc',
            name: 'World',
            parentId: null
          }
        ]);
        expect(tree instanceof Tree).toEqual(true);
      });
      test('from array with 1 root', () => {
        const list: Array<ObjectAnyProperties> = [
          {
            id: 'abc',
            name: 'World',
            parentId: null
          }
        ];
        const result = createTreeFromFlatArray(list);
        expect(result.root.data.name).toBe(list[0].name);
        expect(result.root.id).toBe(list[0].id);
        expect(result.root.children).toEqual([]);
      });
      test('from array with 1 root and 1 child', () => {
        const list: Array<ObjectAnyProperties> = [
          {
            id: 'abc',
            name: 'World',
            parentId: null
          },
          {
            id: 'def',
            name: 'World',
            parentId: 'abc'
          }
        ];
        const result = createTreeFromFlatArray(list);
        const listRoot = list[0];
        const listChild = list[1];
        const treeRoot = result.root;
        const treeChild = result.root.children[0];
        expect(treeRoot.data.name).toBe(listRoot.name);
        expect(treeRoot.id).toBe(listRoot.id);
        expect(treeChild.data.name).toEqual(listChild.name);
        expect(treeChild.id).toEqual(listChild.id);
      });
      test('from array with 1 root and 1 child', () => {
        const list: Array<ObjectAnyProperties> = [
          {
            id: 'abc',
            name: 'World',
            parentId: null
          },
          {
            id: 'def',
            name: 'Australia',
            parentId: 'abc'
          }
        ];
        const result = createTreeFromFlatArray(list);
        const listRoot = list[0];
        const listChild = list[1];
        const treeRoot = result.root;
        const treeChild = result.root.children[0];
        expect(treeRoot.data.name).toBe(listRoot.name);
        expect(treeRoot.id).toBe(listRoot.id);
        expect(treeChild.data.name).toEqual(listChild.name);
        expect(treeChild.id).toEqual(listChild.id);
      });
      test('from array with 1 root and 1 child with 1 child', () => {
        const list: Array<ObjectAnyProperties> = [
          {
            id: 'sports',
            name: 'Sports',
            parentId: null
          },
          {
            id: 'ball',
            name: 'Ball',
            parentId: 'sports'
          },
          {
            id: 'non-ball',
            name: 'Non Ball',
            parentId: 'sports'
          },
          {
            id: 'tennis',
            name: 'Tennis',
            parentId: 'ball'
          }
        ];
        const result = createTreeFromFlatArray(list);
        const listRoot = list[0];
        const treeRoot = result.root;
        expect(treeRoot.data.name).toBe(listRoot.name);
        expect(treeRoot.id).toBe(listRoot.id);
        const listChildA = list[1];
        const treeChildA = result.root.children[0];
        expect(treeChildA.data.name).toEqual(listChildA.name);
        expect(treeChildA.id).toEqual(listChildA.id);
        const listChildB = list[2];
        const treeChildB = result.root.children[1];
        expect(treeChildB.data.name).toEqual(listChildB.name);
        expect(treeChildB.id).toEqual(listChildB.id);
        const listChildAChild = list[3];
        const treeChildAChild = result.root.children[0].children[0];
        expect(treeChildAChild.data.name).toEqual(listChildAChild.name);
        expect(treeChildAChild.id).toEqual(listChildAChild.id);
      });
    });
    describe('complex tree', () => {
      test('tree has correct number of nodes', () => {
        const tree = createTreeFromFlatArray(testDataComplex);
        expect(tree.countNodes()).toBe(testDataComplex.length);
      });
      test('tree has correct height', () => {
        const tree = createTreeFromFlatArray(testDataComplex);
        expect(tree.height()).toBe(3);
      });
      test('tree has correct widths', () => {
        const tree = createTreeFromFlatArray(testDataComplex);
        expect(tree.widthsByHeight()).toEqual([1, 2, 5, 2]);
      });
      test('tree has the expected minimum number of children at height 2', () => {
        const tree = createTreeFromFlatArray(testDataComplex);
        expect(tree.root.children.length).toBe(2);
      });
      test('tree is correct', () => {
        const tree = createTreeFromFlatArray(testDataComplex);
        expect(tree.toJson()).toBe(
          '{"data":{"name":"World"},"children":[{"data":{"name":"North America"},"children":[{"data":{"name":"Mexico"},"children":[],"id":"id_mex","parentId":"id_na"},{"data":{"name":"Canada"},"children":[],"id":"id_can","parentId":"id_na"},{"data":{"name":"USA"},"children":[{"data":{"name":"Ohio"},"children":[],"id":"id_oh","parentId":"id_usa"},{"data":{"name":"North Dakota"},"children":[],"id":"id_nd","parentId":"id_usa"}],"id":"id_usa","parentId":"id_na"}],"id":"id_na","parentId":"id_world"},{"data":{"name":"Pacific"},"children":[{"data":{"name":"Australia"},"children":[],"id":"id_aus","parentId":"id_pac"},{"data":{"name":"New Zealand"},"children":[],"id":"id_nz","parentId":"id_pac"}],"id":"id_pac","parentId":"id_world"}],"id":"id_world","parentId":null}'
        );
      });
    });
  });
  describe('custom object properties', () => {
    test('from array with 1 root', () => {
      const list: Array<ObjectAnyProperties> = [
        {
          _id: 'abc',
          name: 'World',
          _parentId: null
        }
      ];
      const opts = {
        idKey: '_id',
        parentIdKey: '_parentId'
      };
      const result = createTreeFromFlatArray(list, opts);
      expect(result.root.data.name).toBe(list[0].name);
      expect(result.root.id).toBe(list[0]._id);
      expect(result.root.children).toEqual([]);
    });
    test('from array with 1 root and 1 child', () => {
      const list: Array<ObjectAnyProperties> = [
        {
          _id: 'abc',
          name: 'World',
          _parentId: null
        },
        {
          _id: 'def',
          name: 'World',
          _parentId: 'abc'
        }
      ];
      const opts = {
        idKey: '_id',
        parentIdKey: '_parentId'
      };
      const result = createTreeFromFlatArray(list, opts);
      const listRoot = list[0];
      const listChild = list[1];
      const treeRoot = result.root;
      const treeChild = result.root.children[0];
      expect(treeRoot.data.name).toBe(listRoot.name);
      expect(treeRoot.id).toBe(listRoot._id);
      expect(treeChild.data.name).toEqual(listChild.name);
      expect(treeChild.id).toEqual(listChild._id);
    });
  });
  describe('createTreeFromTreeArray', () => {
    describe('default options', () => {
      test('empty array returns a tree with root null', () => {
        const result = createTreeFromTreeArray([]);
        expect(result instanceof Tree).toBe(true);
        expect(result.root).toBe(null);
      });
      test('returns Tree instance', () => {
        const arr: any = [
          {
            id: 'sports',
            name: 'Sports',
            parentId: null,
            children: []
          }
        ];
        expect(createTreeFromTreeArray(arr) instanceof Tree).toBe(true);
      });
      test('returns correct tree', () => {
        const arr: any = [
          {
            id: 'sports',
            name: 'Sports',
            parentId: null,
            children: [
              {
                id: 'ball',
                name: 'Ball',
                parentId: 'sports',
                children: [
                  {
                    id: 'tennis',
                    name: 'Tennis',
                    parentId: 'ball',
                    children: []
                  }
                ]
              },
              {
                id: 'non-ball',
                name: 'Non Ball',
                parentId: 'sports',
                children: []
              }
            ]
          }
        ];
        const tree = createTreeFromTreeArray(arr);
        expect(tree.root.data).toEqual({ name: 'Sports' });
        expect(tree.root.children[0] instanceof Node).toBe(true);
        expect(tree.root.children[0].data).toEqual({ name: 'Ball' });
        expect(tree.root.children[0].children[0].data).toEqual({
          name: 'Tennis'
        });
        expect(tree.root.children[1] instanceof Node).toBe(true);
        expect(tree.root.children[1].data).toEqual({ name: 'Non Ball' });
      });
    });
    describe('custom options', () => {
      test('returns correct tree', () => {
        const arr: any = [
          {
            _id: 'sports',
            name: 'Sports',
            _parentId: null,
            _children: [
              {
                _id: 'ball',
                name: 'Ball',
                _parentId: 'sports',
                _children: [
                  {
                    _id: 'tennis',
                    name: 'Tennis',
                    _parentId: 'ball',
                    _children: []
                  }
                ]
              },
              {
                _id: 'non-ball',
                name: 'Non Ball',
                _parentId: 'sports',
                _children: []
              }
            ]
          }
        ];
        const opts = {
          idKey: '_id',
          parentIdKey: '_parentId',
          childrenKey: '_children'
        };
        const tree = createTreeFromTreeArray(arr, opts);
        expect(tree.root.data).toEqual({ name: 'Sports' });
        expect(tree.root.children[0].data).toEqual({ name: 'Ball' });
        expect(tree.root.children[0].id).toEqual('ball');
        expect(tree.root.children[0].parent.data).toEqual({ name: 'Sports' });
        expect(tree.root.children[0].children[0].data).toEqual({
          name: 'Tennis'
        });
        expect(tree.root.children[0].children[0].id).toEqual('tennis');
        expect(tree.root.children[0].children[0].parent.data).toEqual({
          name: 'Ball'
        });
        expect(tree.root.children[1].data).toEqual({ name: 'Non Ball' });
        expect(tree.root.children[1].id).toEqual('non-ball');
        expect(tree.root.children[1].parent.data).toEqual({ name: 'Sports' });
      });
    });
  });
});

describe('create nodes', () => {
  let expected: string;
  beforeEach(() => {
    expected =
      '{"data":"parent","children":[{"data":{"name":"Sports"},"children":[{"data":{"name":"Ball"},"children":[{"data":{"name":"Tennis"},"children":[],"id":"tennis","parentId":"ball"}],"id":"ball","parentId":"sports"},{"data":{"name":"Non Ball"},"children":[],"id":"non-ball","parentId":"sports"}],"id":"sports","parentId":"id_parent"}],"id":"id_parent","parentId":null}';
  });
  describe('default options', () => {
    test('creates nodes', () => {
      const parentNode = new Node('parent', { id: 'id_parent' });
      const arr: any = [
        {
          id: 'sports',
          name: 'Sports',
          parentId: null,
          children: [
            {
              id: 'ball',
              name: 'Ball',
              parentId: 'sports',
              children: [
                {
                  id: 'tennis',
                  name: 'Tennis',
                  parentId: 'ball',
                  children: []
                }
              ]
            },
            {
              id: 'non-ball',
              name: 'Non Ball',
              parentId: 'sports',
              children: []
            }
          ]
        }
      ];
      createNodes(arr, parentNode);
      expect(parentNode.toJson()).toEqual(expected);
    });
  });
  describe('custom options', () => {
    test('creates nodes', () => {
      const parentNode = new Node('parent', { id: 'id_parent' });
      const arr: any = [
        {
          _id: 'sports',
          name: 'Sports',
          _parentId: null,
          _children: [
            {
              _id: 'ball',
              name: 'Ball',
              _parentId: 'sports',
              _children: [
                {
                  _id: 'tennis',
                  name: 'Tennis',
                  _parentId: 'ball',
                  _children: []
                }
              ]
            },
            {
              _id: 'non-ball',
              name: 'Non Ball',
              _parentId: 'sports',
              _children: []
            }
          ]
        }
      ];
      const opts = {
        idKey: '_id',
        parentIdKey: '_parentId',
        childrenKey: '_children'
      };
      createNodes(arr, parentNode, opts);
      expect(parentNode.toJson()).toEqual(expected);
    });
  });
});
