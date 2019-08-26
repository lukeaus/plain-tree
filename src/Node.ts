import { generateId } from './utils';
import {
  nodeToJsonFormatter,
  widthsByHeight,
  flattenByHeight
} from './utilsNodeTree';
import { NodeOrNull } from './types';

class Node {
  data: any;
  children: Node[] = [];
  id: string;
  parent: NodeOrNull;

  constructor(
    data: any,
    { id, parent }: { id?: string; parent?: NodeOrNull } = {}
  ) {
    this.id = id !== undefined ? id : generateId();
    this.parent = parent || null;
    this.data = data;
    this.children = [];
  }

  addChild(data: any, { id }: { id?: string } = {}): Node {
    const node = new Node(data, { id, parent: this });
    this.children.push(node);
    return node;
  }

  private _removeChildren(fn: Function): Array<Node> {
    const removedChildren: Array<Node> = [];
    this.children = this.children.filter(node => {
      if (fn(node)) {
        removedChildren.push(node);
        return false;
      }
      return true;
    });
    return removedChildren;
  }

  removeChildren(fn: Function): Array<Node> {
    return this._removeChildren(fn);
  }

  removeChildrenByData(data: any): Array<Node> {
    const fn: Function = (node: Node) => node.data === data;
    return this._removeChildren(fn);
  }

  removeChildrenById(id: string): Array<Node> {
    const fn: Function = (node: Node) => node.id === id;
    return this._removeChildren(fn);
  }

  isLeaf(): boolean {
    return this.parent !== null && !Boolean(this.children.length);
  }

  hasChildren(): boolean {
    return Boolean(this.children.length);
  }

  toJson(): string {
    const objectToSerialize = nodeToJsonFormatter(this);
    return JSON.stringify(objectToSerialize);
  }

  depth(): number {
    if (!this.parent) {
      return 0;
    } else {
      let depth = 0;
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      let currentNode: Node = this;
      while (currentNode.parent) {
        depth += 1;
        currentNode = currentNode.parent;
      }
      return depth;
    }
  }

  widthsByHeight(): Array<number> {
    return widthsByHeight(this);
  }

  height(): number {
    return this.widthsByHeight().length - 1;
  }

  flattenByHeight(fn: Function | null = null): any[][] {
    return flattenByHeight(this, fn);
  }
}

export default Node;
