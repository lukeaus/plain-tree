<!-- markdownlint-disable -->

# Plain Tree

<img src="assets/plain-tree.png" title="Plain Tree" alt="Plain Tree logo" width="200">

---

[![Tests](https://img.shields.io/travis/lukeaus/plain-tree/master.svg)](https://travis-ci.org/lukeaus/plain-tree)
[![MIT License](https://img.shields.io/github/license/lukeaus/plain-tree.svg)](https://img.shields.io/github/license/lukeaus/plain-tree.svg)
[![version](https://img.shields.io/npm/v/@lukeaus/plain-tree.svg)](https://www.npmjs.com/@lukeaus/plain-tree)
[![npm downloads](https://img.shields.io/npm/dm/@lukeaus/plain-tree.svg)](http://npm-stat.com/charts.html?package=@lukeaus/plain-tree&from=2019-08-20)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/dwyl/esta/issues)
[![Blazing](https://img.shields.io/badge/🔥-Blazing%20Fast-red.svg)](https://img.shields.io/badge/🔥-Blazing%20Fast-red.svg)

## What

Tree and node creation with a bunch of tools

## Why

Tree tools all in one handy repo

## Install

```
npm i -S @lukeaus/plain-tree
```

## Usage

```javascript
import { Node, Tree } from '@lukeaus/plain-tree';

const nodeA = new Node('a');
const tree = new Tree(node);
const nodeB = node.addChild('b');

console.log(nodeA);
/*
Node {
  children:
    [ Node {
        children: [],
        id: '5teklsxk3h9k1ta8ns1u8qyc0w6xxabj3sr2',
        parentId: 'y5c03ar51wcl46f92zbpc9dmj7t8ahuuphpy',
        data: 'b' } ],
  id: 'y5c03ar51wcl46f92zbpc9dmj7t8ahuuphpy',
  parentId: null,
  data: 'a' }
*/
```

## API

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

#### `flatten(fn?)`

Traverse every node in the tree breath first and flatten the tree into a single array.

Return: Array<Node|null>

##### fn

Type: Function

Default: null (if null, will push the node into the array)

| Parameter | Type         | Description    |
| --------- | ------------ | -------------- |
| 1         | Node \| null | A Node or null |

#### `flattenData()`

Traverse every node in the tree breath first and flatten the tree into a single array. Add the 'data' property of each Node (if node is not null) and return an array of any.

Return: Array<any>

#### `widthsByHeight()`

Return the width at each height

##### Example

```javascript
import { Tree, Node, hasChildren, nodeData } from '@lukeaus/plain-tree';

const nodeA = new Node('a');
const tree = new Tree(nodeA);
nodeA.addChild('b');
nodeA.addChild('c');
nodeA.children[0].addChild('d');

tree.widthsByHeight(); // [1, 2 , 1]
hasChildren(nodeA); // true
nodeData(nodeA); // 'a'
```

#### `atHeight(number)`

Return all the nodes at that height (root is at height 0)

Return: Array<Node|null>

##### number

Type: Number

Description: Number indicating the tree height at which you want to obtain all nodes

#### `maxWidth()`

Return the maximum width of any level in the tree

Return: Number

#### `height()`

Return the height of the tree. A tree with only root will be height 0.

Return: Number

### Node

#### `constructor(data, opts?)`

Create a new Node instance

Return: Node

##### data

Type: any

##### opts

| Parameter | Type   | Description       |
| --------- | ------ | ----------------- |
| id        | String | id                |
| parentId  | String | id of parent node |

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

## Contributing

Contributions are welcomed. How to make a contribution:

- Create an issue on Github
- Fork project
- Make changes
- Test changes `npm run test`
- Use `npm run commit` to commit
- Create a pull request
