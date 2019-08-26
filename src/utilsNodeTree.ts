/*
 * Common Node and Tree utilities
 */
import { NodeOrNull, SerializedNode } from './types';
import { hasChildren } from './utils';
import Node from './Node';

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

export const flattenByHeight = (
  node: NodeOrNull,
  fn: Function | null = null
): any[][] => {
  let currentQueue = [node];
  let nextQueue: NodeOrNull[] = [];
  const result = [[fn(node)]];
  do {
    while (currentQueue.length) {
      const node = currentQueue.pop();
      hasChildren(node) && nextQueue.push(...node.children);
    }
    if (nextQueue.length) {
      // explicit argument passing to fn to placate TypeScript
      if (fn) {
        result[result.length] = nextQueue.map(node => fn(node));
      } else {
        result[result.length] = nextQueue;
      }
    }
    [nextQueue, currentQueue] = [currentQueue, nextQueue];
  } while (currentQueue.length);
  return result;
};
