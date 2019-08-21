import { generateId } from './utils';

class Node {
  data: Record<string, any>;
  children: Node[] = [];
  id: string;
  parentId: string;

  constructor(
    data: any,
    { id, parentId }: { id?: string; parentId?: string } = {}
  ) {
    this.id = id !== undefined ? id : generateId();
    this.parentId = parentId !== undefined ? parentId : null;
    this.data = data;
    this.children = [];
  }

  addChild(data: any): Node {
    const node = new Node(data, { parentId: this.id });
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
    return !Boolean(this.children.length);
  }

  hasChildren(): boolean {
    return Boolean(this.children.length);
  }
}

export default Node;
