import { generateId, nodeData } from './utils';

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

  removeChildren(fn: Function): void {
    this.children = this.children.filter(node => !fn(node));
  }

  removeChildrenByData(data: any): void {
    this.children = this.children.filter(node => nodeData(node) != data);
  }

  removeChildrenById(id: string): void {
    this.children = this.children.filter(node => node && node.id != id);
  }

  isLeaf(): boolean {
    return Boolean(this.children.length);
  }
}

export default Node;
