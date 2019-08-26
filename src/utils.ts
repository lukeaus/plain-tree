import { NodeOrNull } from './types';

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
