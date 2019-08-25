<!-- markdownlint-disable -->

# Plain Tree

<img src="assets/plain-tree.png" title="Plain Tree" alt="Plain Tree logo" width="200">

---

[![Tests](https://img.shields.io/travis/lukeaus/plain-tree/master.svg)](https://travis-ci.org/lukeaus/plain-tree)
[![MIT License](https://img.shields.io/github/license/lukeaus/plain-tree.svg)](https://github.com/lukeaus/plain-tree/blob/master/LICENSE)
[![version](https://img.shields.io/npm/v/@lukeaus/plain-tree.svg)](https://www.npmjs.com/@lukeaus/plain-tree)
[![npm downloads](https://img.shields.io/npm/dm/@lukeaus/plain-tree.svg)](http://npm-stat.com/charts.html?package=@lukeaus/plain-tree&from=2019-08-20)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/lukeaus/plain-tree/issues)
[![Speed](https://img.shields.io/badge/speed-blazing%20🔥-brightgreen.svg)](https://twitter.com/captbaritone/status/999996177411133440)

## What

Performant tree and node utility library.

## Features

- Create trees
  - manually
  - from array
- Create nodes
  - manually
  - from array
  - from object
- Search
  - Find one
  - Find all
  - Some/Every
- Traverse (breath first and depth first)
- Nodes at height
- Nodes count
  - all
  - by height
- Width
- Height
- Depth
- Manipulate trees and nodes
- FlatMap
  - Into single array
  - Into array of arrays by height
- Convert to JSON
- ... and more (see below)

## Why

Tree and node tools all in one handy, well tested package.

## Install

```
npm i --save @lukeaus/plain-tree
```

## Usage

```javascript
import { Node, Tree } from '@lukeaus/plain-tree';

const rootNode = new Node('a');
const tree = new Tree(rootNode);
rootNode.addChild('b');

console.log(tree);
/*
Tree {
  root:
    Node {
      children: [ [Node] ],
      id: 'twsychkc3gdj7o30o3s3z6cb7vfpzb2xfgjl',
      parent: null,
      data: 'a'
    }
  }
*/
```

## API

### Creating a Tree

There are multiple ways to create a tree.

#### Manually via Declared Nodes

Assign nodes to variables then use `node.addChild`

```javascript
import { Node, Tree } from '@lukeaus/plain-tree';

const rootNode = new Node('a');
const tree = new Tree(rootNode);
const nodeB = rootNode.addChild('b');
const nodeC = nodeB.addChild('c');

/* Tree Outline:
 * a
 *   - b
 *     - c
 */
```

#### Manually via Children

Add nodes by accessing the root node's children (and their children, and their children's children etc.)

```javascript
import { Node, Tree } from '@lukeaus/plain-tree';

const rootNode = new Node('a');
const tree = new Tree(rootNode);
rootNode.addChild('b');
rootNode.children[0].addChild('c');

/* Tree Outline:
 * a
 *   - b
 *     - c
 */
```

#### `createTreeFromFlatArray(arr, ?opts)`

Create a tree from a flat array of objects.

Return: Tree instance

##### arr

Type: Array<Object>

Description: An array of objects. Object should have:

- id
- parent id (optional)
- children (optional)
- some other properties (all other properties will be converted to an object and will be available on node's `data` property )

##### opts

Type: Object

Description: Options for creation of tree

| Parameter   | Type   | Default    | Description                                       |
| ----------- | ------ | ---------- | ------------------------------------------------- |
| idKey       | String | 'id'       | Object's property whose value is each node's id   |
| parentIdKey | String | 'parentId' | Object's property whose value is parent node's id |
| childrenKey | String | 'children' | Object's property whose value is child objects    |

##### Example

```javascript
import { createTreeFromFlatArray } from '@lukeaus/plain-tree';

const arr = [
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

createTreeFromFlatArray(arr);

/* Tree Outline:
 * Sports
 *   - Ball
 *     - Tennis
 *   - Non Ball
 */
```

#### `createTreeFromTreeArray(arr, ?opts)`

Create a tree from an array of nested objects.

Return: Tree instance

##### arr

Type: Array<Object>

Description: An array of objects. Object should have:

- id
- parent id (optional)
- children (optional)
- some other properties (all other properties will be converted to an object and will be available on node's `data` property )

##### opts

Type: Object

Description: Options for creation of tree

| Parameter   | Type   | Default    | Description                                       |
| ----------- | ------ | ---------- | ------------------------------------------------- |
| idKey       | String | 'id'       | Object's property whose value is each node's id   |
| parentIdKey | String | 'parentId' | Object's property whose value is parent node's id |
| childrenKey | String | 'children' | Object's property whose value is child objects    |

##### Example

```javascript
import { createTreeFromTreeArray } from '@lukeaus/plain-tree';

const arr = [
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
createTreeFromTreeArray(arr);

/* Tree Outline:
 * Sports
 *   - Ball
 *     - Tennis
 *   - Non Ball
 */
```

### Adding Additional Nodes to existing tree

#### Manually via Declared Nodes

Assign nodes to variables then use `node.addChild`

```javascript
import { Node } from '@lukeaus/plain-tree';

// find/use an existing node
const nodeB = node.addChild('b');
const nodeC = nodeB.addChild('c');
```

#### Manually via Children

Add nodes by accessinga node's children (and their children, and their children's children etc.)

```javascript
import { Node, Tree } from '@lukeaus/plain-tree';

// find/use an existing node
node.addChild('b');
node.children[0].addChild('c');
```

#### From Tree Array

**`createNodes(arr, ?parentNode, ?opts)`**

Create nodes from an array of nested objects

Return: void

##### arr

Type: Array<Object>

Description: An array of objects. Object should have:

- id
- parent id (optional)
- children (optional)
- some other properties (all other properties will be converted to an object and will be available on node's `data` property )

##### parentNode

Type: Node | null

Description: Parent node for nodes in array

##### opts

Type: Object

Description: Options for creation of tree

| Parameter   | Type   | Default    | Description                                       |
| ----------- | ------ | ---------- | ------------------------------------------------- |
| idKey       | String | 'id'       | Object's property whose value is each node's id   |
| parentIdKey | String | 'parentId' | Object's property whose value is parent node's id |
| childrenKey | String | 'children' | Object's property whose value is child objects    |

##### Example

```javascript
import { createNodes } from '@lukeaus/plain-tree';

const parentNode = new Node('a'));
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
```

### Tree

#### `constructor(root)`

Creates and returns the tree

##### root

Type: Node or null

Default: null

Description: The tree root

#### `traverseBreathFirst(fn)`

Traverse every node in the tree breath first

##### fn

Type: Function

| Parameter | Type         | Description    |
| --------- | ------------ | -------------- |
| 1         | Node \| null | A Node or null |

#### `traverseDepthFirst(fn)`

Traverse every node in the tree depth first

##### fn

Type: Function

| Parameter | Type         | Description    |
| --------- | ------------ | -------------- |
| 1         | Node \| null | A Node or null |

#### `findOneBreathFirst(fn)`

Traverse nodes in the tree breath first. Returns the first matching Node or null.

Return: Node | null

##### fn

Type: Function

| Parameter | Type         | Description    |
| --------- | ------------ | -------------- |
| 1         | Node \| null | A Node or null |

#### `findOneDepthFirst(fn)`

Traverse nodes in the tree depth first. Returns the first matching Node or null.

Return: Node | null

##### fn

Type: Function

| Parameter | Type         | Description    |
| --------- | ------------ | -------------- |
| 1         | Node \| null | A Node or null |

#### `findAllBreathFirst(fn)`

Traverse nodes in the tree breath first. Returns an array containing all matching Nodes.

Return: Array<Node>

##### fn

Type: Function

| Parameter | Type         | Description    |
| --------- | ------------ | -------------- |
| 1         | Node \| null | A Node or null |

#### `findAllDepthFirst(fn)`

Traverse nodes in the tree depth first. Returns an array containing all matching Nodes.

Return: Array<Node>

##### fn

Type: Function

| Parameter | Type         | Description    |
| --------- | ------------ | -------------- |
| 1         | Node \| null | A Node or null |

#### `someBreathFirst(fn)`

Traverse nodes in the tree breath first. Return true if a single node is truthy for fn, else return false. Breaks on first truthy for performance.

Return: Boolean

##### fn

Type: Function

| Parameter | Type         | Description    |
| --------- | ------------ | -------------- |
| 1         | Node \| null | A Node or null |

#### `someDepthFirst(fn)`

Traverse nodes in the tree depth first. Return true if a single node is truthy for fn, else return false. Breaks on first truthy for performance.

Return: Boolean

##### fn

Type: Function

| Parameter | Type         | Description    |
| --------- | ------------ | -------------- |
| 1         | Node \| null | A Node or null |

#### `everyBreathFirst(fn)`

Traverse every node in the tree breath first. Return true if every node is truthy for fn, else return false. Breaks on first falsey for performance.

Return: Boolean

##### fn

Type: Function

| Parameter | Type         | Description    |
| --------- | ------------ | -------------- |
| 1         | Node \| null | A Node or null |

#### `everyDepthFirst(fn)`

Traverse every node in the tree depth first. Return true if every node is truthy for fn, else return false. Breaks on first falsey for performance.

Return: Boolean

##### fn

Type: Function

| Parameter | Type         | Description    |
| --------- | ------------ | -------------- |
| 1         | Node \| null | A Node or null |

#### `flatMap(?fn)`

Traverse every node in the tree breath first and flatten the tree into a single array.

Return: Array<Node|null>

##### fn

Type: Function

Default: null (if null, flatten will push the node into the array)

| Parameter | Type         | Description    |
| --------- | ------------ | -------------- |
| 1         | Node \| null | A Node or null |

#### `flattenData()`

Traverse every node in the tree breath first and flatten the tree into a single array. Extract the 'data' property of each Node (if node is not null) and return an array of any. This is a helper method which is essentially `flatten(nodeData)`;

Return: Array<any>

#### `flattenByHeight(?fn)`

Traverse every node in the tree breath first and flatten the tree into an array of arrays, where each array is for each height level in the tree.

Return: Array<Array<Node|null>>

##### fn

Type: Function

Default: null (if null, flatten will push the node into the array)

| Parameter | Type         | Description    |
| --------- | ------------ | -------------- |
| 1         | Node \| null | A Node or null |

##### Example

```javascript
import { Node, Tree } from '@lukeaus/plain-tree';

const nodeA = new Node('a');
const tree = new Tree(nodeA);
nodeA.addChild('b');
const nodeC = nodeA.addChild('c');
nodeC.addChild('d');

tree.flattenByHeight(nodeData)
/* Output
[['a'], ['b', 'c'], ['d']];
*.
```

#### `flattenDataByHeight()`

Traverse every node in the tree breath first and flatten the tree into an array of arrays, where each array is for each height level in the tree. Extract the 'data' property of each Node (if node is not null). This is a helper method which is essentially `flattenByHeight(nodeData)`;

Return: Array<Array<Node|null>>

#### `widthsByHeight()`

Return the width of children at each height

##### Example

```javascript
import { Tree, Node, hasChildren, nodeData } from '@lukeaus/plain-tree';

const nodeA = new Node('a');
const tree = new Tree(nodeA);
nodeA.addChild('b');
nodeA.addChild('c');
nodeA.children[0].addChild('d');

tree.widthsByHeight(); // [1, 2 , 1]
```

#### `nodesAtHeight(number)`

Return all the nodes at that height (root is at height 0)

Return: Array<Node|null>

##### number

Type: Number

Description: Number indicating the tree height at which you want to obtain all nodes

#### `maxWidth()`

Return the maximum width of any height level in the tree

Return: Number

#### `height()`

Return the height of the tree. Equivalent to height of root node. A tree with only root will be height 0.

Return: Number

#### `countNodes()`

Return the number of nodes in a tree. A tree with root of null will return 1.

Return: Number

#### `toJson()`

Stringify the tree. Due to circular dependencies, the `parent` property is dropped and replaced with property `parentId` (type String | null) which is the id of the parent (if it exists) else null.

If root is null, an empty string is returned.

Return: String

### Node

#### `constructor(data, ?opts)`

Create a new Node instance

Return: Node

#### `data`

The node's data (excluding interal node properties)

Type: any

#### `parent`

The node's parent node (if it exists, otherwise null)

Type: Node | null

##### opts

| Parameter | Type         | Description |
| --------- | ------------ | ----------- |
| id        | String       | id          |
| parent    | Node \| null | parent node |

#### `addChild(data)`

Add a child to this node. Return the newly created child Node instance.

Return: Node

##### data

Type: any

#### `removeChildren(fn)`

Remove all children where fn returns truthy. Use this where data is complex (e.g. data is an Object or Array). Returns removed children.

Return: Array<Node>

##### fn

| Parameter | Type         | Description           |
| --------- | ------------ | --------------------- |
| 1         | Node \| null | A child Node instance |

#### `removeChildrenByData(data)`

Remove all children where child's `data` property matches data. Use `removeChildren` where data is complex (e.g. data is an Object or Array). Returns removed children.

Return: Array<Node>

##### data

Type: any

#### `removeChildrenById(id)`

Remove all children where child's `id` property matches id. Use `removeChildren` where data is complex (e.g. data is an Object or Array). Returns removed children.

Return: Array<Node>

##### id

Type: String

#### `isLeaf()`

Returns a Boolean. False if this Node instance has children. True if it does have children.

Return: Boolean

#### `hasChildren()`

Returns a Boolean. True if this Node instance has children. False if it does have children.

Return: Boolean

#### `widthsByHeight()`

Return the width of children at each height

##### Example

```javascript
import { Tree, Node, hasChildren, nodeData } from '@lukeaus/plain-tree';

const nodeA = new Node('a');
nodeA.addChild('b');
nodeA.addChild('c');
nodeA.children[0].addChild('d');

nodeA.widthsByHeight(); // [1, 2 , 1]
```

#### `height()`

Return the height of the node.

Return: Number

#### `depth()`

Return the depth of the node.

Return: Number

### Utils

#### `nodeData(node)`

Return a nodes data. Safe function to protect against accessing `data` property on null.

Return: any

##### node

Type: Node | null

#### `nodesData(nodes)`

Convenience method to return all node data on an array of nodes.

Return: Array<any>

##### nodes

Type: Array<Node|null>

#### `hasChildren(node)`

Return `true` if node has children. Return `false` if no children.

Return: boolean

##### node

Type: Node | null

#### `toJson()`

Stringify the node. Due to circular dependencies, parent property is dropped and replaced with parentId (type String | null).

Return: String

## Contributing

Contributions are welcomed. How to make a contribution:

- Create an issue on Github
- Fork project
- Make changes
- Test changes `npm run test`
- Use `npm run commit` to commit
- Create a pull request
