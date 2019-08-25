import {
  NodeOrNull,
  CreateOptions,
  CreateOptionsWithCustomChildrenKey,
  ObjectAnyProperties
} from './types';
import Tree from './Tree';
import Node from './Node';
import { filterObject } from './utils';

const ID_KEY_DEFAULT = 'id';
const PARENT_ID_KEY_DEFAULT = 'parentId';
const CHILDREN_KEY_DEFAULT = 'children';

/*
 * Create an array of objects representing a tree
 * Return array (as tree may have multiple roots).
 * Takes a flat array that looks like this:
 * [
 *   {
 *     id: 'sports',
 *     name: 'Sports',
 *     parentId: null
 *   },
 *   {
 *     id: 'ball',
 *     name: 'Ball',
 *     parentId: 'sports'
 *   },
 *   {
 *     id: 'non-ball',
 *     name: 'Non Ball',
 *     parentId: 'sports'
 *   },
 *   {
 *     id: 'tennis',
 *     name: 'Tennis',
 *     parentId: 'ball'
 *   }
 * ];
 * Returns a tree array that looks like this
 * [
 *   {
 *     "id": "sports",
 *     "name": "Sports",
 *     "parentId": null,
 *     "children": [
 *       {
 *         "id": "ball",
 *         "name": "Ball",
 *         "parentId": "sports",
 *         "children": [
 *           {
 *             "id": "tennis",
 *             "name": "Tennis",
 *             "parentId": "ball",
 *             "children": []
 *           }
 *         ]
 *       },
 *       {
 *         "id": "non-ball",
 *         "name": "Non Ball",
 *         "parentId": "sports",
 *         "children": []
 *       }
 *     ]
 *   }
 * ]
 */
export const createTreeArrayFromFlatArray = (
  data: Array<ObjectAnyProperties>,
  {
    idKey = ID_KEY_DEFAULT,
    parentIdKey = PARENT_ID_KEY_DEFAULT,
    childrenKey = CHILDREN_KEY_DEFAULT
  }: CreateOptionsWithCustomChildrenKey = {}
): Array<ObjectAnyProperties> => {
  const treeArray: Array<ObjectAnyProperties> = [];
  const childrenOf = {};
  data.forEach((obj: any) => {
    const id = obj[idKey];
    const parentId = obj[parentIdKey];
    // obj may have children
    childrenOf[id] = childrenOf[id] || [];
    // init obj's children
    obj[childrenKey] = childrenOf[id];
    if (parentId) {
      // init obj's parent's children object
      childrenOf[parentId] = childrenOf[parentId] || [];
      // push obj into its parent's children object
      childrenOf[parentId].push(obj);
    } else {
      treeArray.push(obj);
    }
  });
  return treeArray;
};

/*
 * Take an object that looks like a node, and turn it into a node.
 * Take all properties from obj that aren't in disallowedKeys and set as
 * 'data' on the node.
 */
export const objectToNode = (
  obj: object,
  parent: NodeOrNull = null,
  {
    idKey = ID_KEY_DEFAULT,
    parentIdKey = PARENT_ID_KEY_DEFAULT,
    childrenKey = CHILDREN_KEY_DEFAULT
  }: CreateOptionsWithCustomChildrenKey = {}
): Node => {
  const disallowedKeys = [idKey, parentIdKey, childrenKey];
  const data = filterObject(obj, { disallowedKeys });
  if (parent) {
    return parent.addChild(data, { id: obj[idKey] });
  } else {
    return new Node(data, { id: obj[idKey] });
  }
};

/*
 * Create a node for each element in an array, then recursively create child nodes
 */
export const createNodes = (
  data: Array<ObjectAnyProperties>,
  parentNode: NodeOrNull = null,
  opts: CreateOptionsWithCustomChildrenKey = {}
): void => {
  if (!data.length) {
    return;
  }
  const { childrenKey = CHILDREN_KEY_DEFAULT } = opts;
  data.forEach(obj => {
    const node = objectToNode(obj, parentNode, opts);
    // create all the nodes for the children of this node, with this node as parent
    createNodes(obj[childrenKey], node, opts);
  });
};

/*
 * Tree array to supply (example):
 * [
 *   {
 *     "id": "sports",
 *     "name": "Sports",
 *     "parentId": null,
 *     "children": [
 *       {
 *         "id": "ball",
 *         "name": "Ball",
 *         "parentId": "sports",
 *         "children": [
 *           {
 *             "id": "tennis",
 *             "name": "Tennis",
 *             "parentId": "ball",
 *             "children": []
 *           }
 *         ]
 *       },
 *       {
 *         "id": "non-ball",
 *         "name": "Non Ball",
 *         "parentId": "sports",
 *         "children": []
 *       }
 *     ]
 *   }
 * ]
 * Return a Tree instance
 */
export const createTreeFromTreeArray = (
  data: Array<ObjectAnyProperties>,
  opts: CreateOptionsWithCustomChildrenKey = {}
): Tree => {
  if (!data.length) {
    return new Tree();
  } else if (data.length > 1) {
    // TODO: add this feature
    throw new Error(
      'Converting an array to tree only accepts an array with 0 or 1 node currently'
    );
  }
  const { childrenKey = CHILDREN_KEY_DEFAULT } = opts;
  const rootObj = data[0];
  const root = objectToNode(rootObj, null, opts);
  const tree = new Tree(root);
  createNodes(rootObj[childrenKey], root, opts);
  return tree;
};

/*
 * Map the supplied array of objects to what is required required for Node creation
 */
const mapFlatArray = (
  data: Array<ObjectAnyProperties>,
  { idKey, parentIdKey }: CreateOptions = {}
): Array<ObjectAnyProperties> => {
  if (idKey || parentIdKey) {
    const disallowedKeys = [
      ...(idKey ? [idKey] : []),
      ...(parentIdKey ? [parentIdKey] : [])
    ];
    return data.map(obj => {
      const newObj = filterObject(obj, { disallowedKeys });
      idKey && (newObj[ID_KEY_DEFAULT] = obj[idKey]);
      parentIdKey && (newObj[PARENT_ID_KEY_DEFAULT] = obj[parentIdKey]);
      return newObj;
    });
  }
  return data;
};

/*
 * Flat array to supply example:
 * [
 *   {
 *     id: 'sports',
 *     name: 'Sports',
 *     parentId: null
 *   },
 *   {
 *     id: 'ball',
 *     name: 'Ball',
 *     parentId: 'sports'
 *   },
 *   {
 *     id: 'non-ball',
 *     name: 'Non Ball',
 *     parentId: 'sports'
 *   },
 *   {
 *     id: 'tennis',
 *     name: 'Tennis',
 *     parentId: 'ball'
 *   }
 * ];
 */
export const createTreeFromFlatArray = (
  data: Array<ObjectAnyProperties>,
  opts: CreateOptions = {}
): any => {
  const mappedFlatArray = mapFlatArray(data, opts);
  const treeArray: Array<ObjectAnyProperties> = createTreeArrayFromFlatArray(
    mappedFlatArray
  );
  if (!treeArray.length) {
    return new Tree();
  } else if ((treeArray.length = 1)) {
    return createTreeFromTreeArray(treeArray);
  } else {
    // TODO: add functionality
    throw new Error(
      'Converting an array to tree only accepts an array with 0 or 1 node currently'
    );
  }
};
