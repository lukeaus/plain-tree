import { NodeOrNull, SerializedNode } from './types';
import Node from './Node';

export const nodeData = (node: NodeOrNull): any => {
  return node && 'data' in node ? node.data : node;
};

export const nodesData = (nodes: Array<NodeOrNull>): any => {
  return nodes.map(nodeData);
};

export const hasChildren = (node: NodeOrNull): boolean => {
  return Boolean(node && node.children && node.children.length);
};

const generateChars = (length: number): string => {
  const random11Chars = (): string =>
    Math.random()
      .toString(36)
      .substring(2, 15);
  let chars = '';
  while (chars.length < length) {
    chars += random11Chars();
  }
  return chars.slice(0, length);
};

export const generateId = (): string => {
  return generateChars(36);
};

export const firstArrayElement = (arr: any): any => {
  return Array.isArray(arr) && arr.length ? arr[0] : null;
};

/*
 * Return a new object without properties in disallowedKeys
 */
export const filterObject = (
  obj: object,
  { disallowedKeys = [] }: { disallowedKeys: Array<string> }
): object => {
  const filteredObj = Object.keys(obj)
    .filter(key => !disallowedKeys.includes(key))
    .reduce((o, key) => {
      o[key] = obj[key];
      return o;
    }, {});
  return filteredObj;
};

export const nodeToJsonFormatter = (node: Node): SerializedNode => {
  const { parent, data, children, id } = node;
  const obj: SerializedNode = {
    data,
    children,
    id,
    parentId: null
  };
  parent && (obj.parentId = parent.id);
  obj.children = (node.children as Node[]).map(
    (child: Node): SerializedNode => nodeToJsonFormatter(child)
  );
  return obj;
};

export const widthsByHeight = (node: NodeOrNull): Array<number> => {
  if (node === null) {
    return [1];
  } else {
    const counter = [1];
    let currentQueue = [node];
    let nextQueue: NodeOrNull[] = [];
    do {
      while (currentQueue.length) {
        const node = currentQueue.pop();
        hasChildren(node) && nextQueue.push(...node.children);
      }
      if (nextQueue.length) {
        counter[counter.length] = nextQueue.length;
      }
      [nextQueue, currentQueue] = [currentQueue, nextQueue];
    } while (currentQueue.length);
    return counter;
  }
};
