import {
  Node,
  Tree,
  createNodes,
  createTreeArrayFromFlatArray,
  createTreeFromFlatArray,
  createTreeFromTreeArray,
  filterObject,
  firstArrayElement,
  generateId,
  hasChildren,
  nodeData,
  nodesData,
  objectToNode
} from '@lukeaus/plain-tree';

// --- Node construction & properties ---
const root = new Node('root', { id: 'r' });
const child = root.addChild('child', { id: 'c' });
root.addChild('child2');

const dataVal: string = root.data;
const childrenLen: number = root.children.length;
const rootId: string = root.id;
const childParent: Node | null = child.parent;
if (childParent !== null) {
  const isRoot: boolean = childParent === root;
}

// child-removal
const removed: Node[] = root.removeChildren((n: Node) => n.id === 'child2');
const removedByData: Node[] = root.removeChildrenByData('child');
root.addChild('child');
const removedById: Node[] = root.removeChildrenById('nope');

// predicates, serialization, metrics
const isLeaf: boolean = child.isLeaf();
const hasKids: boolean = root.hasChildren();
const json: string = root.toJson();
const depth: number = root.depth();
const widths: number[] = root.widthsByHeight();
const height: number = root.height();
const flatByHeight: any[][] = root.flattenByHeight();
const flatByHeightFn: any[][] = root.flattenByHeight((n: Node) => n.data);

// --- Tree ---
const tree = new Tree(root);
const treeRoot: Node | null = tree.root;
if (treeRoot !== null) {
  const rid: string = treeRoot.id;
}

tree.traverseBreathFirst((n: Node) => {
  /* visit */
});
tree.traverseDepthFirst((n: Node) => {
  /* visit */
});

const someB: boolean = tree.someBreathFirst((n: Node) => n.id === 'r');
const someD: boolean = tree.someDepthFirst((n: Node) => n.id === 'r');
const everyB: boolean = tree.everyBreathFirst((n: Node) => true);
const everyD: boolean = tree.everyDepthFirst((n: Node) => true);

const oneB: Node | null = tree.findOneBreathFirst((n: Node) => n.id === 'r');
const oneD: Node | null = tree.findOneDepthFirst((n: Node) => n.id === 'r');
const allB: Array<Node | null> = tree.findAllBreathFirst(
  (n: Node) => n.id === 'r'
);
const allD: Array<Node | null> = tree.findAllDepthFirst(
  (n: Node) => n.id === 'r'
);

const flatMapRes: any[] = tree.flatMap((n: Node) => n.data);
const flattenDataRes: any[] = tree.flattenData();
const treeFlatByHeight: any[][] = tree.flattenByHeight();
const treeFlatDataByHeight: any[][] = tree.flattenDataByHeight();
const treeWidths: number[] = tree.widthsByHeight();
const nodesAt: Array<Node | null> = tree.nodesAtHeight(0);
const count: number = tree.countNodes();
const maxWidth: number = tree.maxWidth();
const treeHeight: number = tree.height();
const treeJson: string = tree.toJson();

// --- creation functions ---
const flatArray = createTreeArrayFromFlatArray([
  { id: 'a', parentId: null },
  { id: 'b', parentId: 'a' }
]);
const builtTree: Tree = createTreeFromFlatArray([
  { id: 'x', parentId: null },
  { id: 'y', parentId: 'x' }
]);
const treeFromArray: Tree = createTreeFromTreeArray([
  { id: 'z', parentId: null, children: [] }
]);
const objNode: Node = objectToNode({ id: 'o', foo: 'bar' });
createNodes([{ id: 'n1', parentId: null, children: [] }]);

// --- utilities ---
const nd: any = nodeData({ data: 'v' });
const nds: any = nodesData([{ data: 1 }]);
const hc: boolean = hasChildren(root);
const fae: any = firstArrayElement([1, 2]);
const faeEmpty: any = firstArrayElement([]);
const gid: string = generateId();
const fo: { [key: string]: any } = filterObject(
  { a: 1, b: 2 },
  { disallowedKeys: ['b'] }
);

// --- scrutiny round 1 probes: named interface and class instance ---
// These compile only if objectToNode and filterObject accept `object`,
// not a string index-signature type. Object literals do not detect the
// narrowing; named interfaces and class instances do.
interface NamedItem {
  id: string;
  foo: string;
}
const namedItem: NamedItem = { id: 'ni', foo: 'bar' };
const nodeFromNamed: Node = objectToNode(namedItem);
const filteredNamed: { [key: string]: any } = filterObject(namedItem, {
  disallowedKeys: ['id']
});

class ClassItem {
  id = 'ci';
  foo = 'baz';
}
const classInstance = new ClassItem();
const nodeFromClass: Node = objectToNode(classInstance);
const filteredClass: { [key: string]: any } = filterObject(classInstance, {
  disallowedKeys: ['id']
});

console.log('Strict TS consumer OK');
