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

const generateChars = (num: number): string => {
  const random11Chars = (): string =>
    Math.random()
      .toString(36)
      .substring(2, 15);
  let chars = '';
  while (chars.length < num) {
    chars += random11Chars();
  }
  return chars.slice(0, num);
};

export const generateId = (): string => {
  return generateChars(36);
};
