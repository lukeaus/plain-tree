import Node from './Node';
import {
  nodeData,
  hasChildren,
  firstArrayElement,
  widthsByHeight
} from './utils';
import { NodeOrNull } from './types';

type TraverseReturn = void | boolean | Array<NodeOrNull>;
type TraverseOptions = {
  some?: boolean;
  every?: boolean;
  returnBoolean?: boolean;
  returnArray?: boolean;
};

class Tree {
  constructor(public root: NodeOrNull = null) {
    this.root = root;
  }

  private _traverse(
    fn: Function,
    { some, every, returnBoolean, returnArray }: TraverseOptions = {},
    queueMethod: string
  ): TraverseReturn {
    const queue = [this.root];
    const results: Array<NodeOrNull> = [];
    let didBreak = false;
    let lastResult: undefined | boolean;
    while (queue.length) {
      const node = queue.shift();
      hasChildren(node) && queue[queueMethod](...node.children);
      if (some || every) {
        const result = fn(node);
        if (result && returnArray) {
          results.push(node);
        }
        if ((every && !result) || (some && result)) {
          didBreak = true;
          lastResult = result;
          break;
        }
      } else {
        fn(node);
      }
    }
    if (every) {
      if (returnBoolean) {
        return !didBreak;
      } else if (returnArray) {
        return results;
      }
    } else if (some) {
      if (returnBoolean) {
        return Boolean(lastResult);
      } else if (returnArray) {
        return results;
      }
    }
  }

  private _traverseBreathFirst(
    fn: Function,
    opts?: TraverseOptions
  ): TraverseReturn {
    return this._traverse(fn, opts, 'push');
  }

  private _traverseDepthFirst(
    fn: Function,
    opts?: TraverseOptions
  ): TraverseReturn {
    return this._traverse(fn, opts, 'unshift');
  }

  traverseBreathFirst(fn: Function): TraverseReturn {
    this._traverseBreathFirst(fn);
  }

  /*
   * Hit the bottom of the tree as fast as possible
   * Then go up and get parent's children, then go down again
   */
  traverseDepthFirst(fn: Function): TraverseReturn {
    this._traverseDepthFirst(fn);
  }

  /*
   * Return true if a single node is truthy for fn, else false
   * exit early on first truthy value
   */
  someBreathFirst(fn: Function): boolean {
    return Boolean(
      this._traverseBreathFirst(fn, {
        some: true,
        returnBoolean: true
      })
    );
  }

  /*
   * Return true if a single node is truthy for fn, else false
   * exit early on first truthy value
   */
  someDepthFirst(fn: Function): boolean {
    return Boolean(
      this._traverseDepthFirst(fn, {
        some: true,
        returnBoolean: true
      })
    );
  }

  /*
   * Return true if result of function for every node is truthy
   * exit early on first function falsey value
   */
  everyBreathFirst(fn: Function): boolean {
    return Boolean(
      this._traverseDepthFirst(fn, {
        every: true,
        returnBoolean: true
      })
    );
  }

  /*
   * Return true if result of function for every node is truthy
   * exit early on first function falsey value
   */
  everyDepthFirst(fn: Function): boolean {
    return Boolean(
      this._traverseDepthFirst(fn, { every: true, returnBoolean: true })
    );
  }

  findOneBreathFirst(fn: Function): NodeOrNull {
    const result = this._traverseBreathFirst(fn, {
      some: true,
      returnArray: true
    });
    return firstArrayElement(result);
  }

  findOneDepthFirst(fn: Function): NodeOrNull {
    const result = this._traverseDepthFirst(fn, {
      some: true,
      returnArray: true
    });
    return firstArrayElement(result);
  }

  findAllBreathFirst(fn: Function): Array<NodeOrNull> {
    const result = this._traverseBreathFirst(fn, {
      every: true,
      returnArray: true
    });
    return Array.isArray(result) ? result : [];
  }

  findAllDepthFirst(fn: Function): Array<NodeOrNull> {
    const result = this._traverseDepthFirst(fn, {
      every: true,
      returnArray: true
    });
    return Array.isArray(result) ? result : [];
  }

  flatMap(fn: Function | null = null): Array<any> {
    const acc: Array<any> = [];
    this._traverseBreathFirst((node: Node) => {
      (fn && acc.push(fn(node))) || acc.push(node);
    });
    return acc;
  }

  flattenData(): Array<any> {
    return this.flatMap(nodeData);
  }

  flattenByHeight(fn: Function | null = null): NodeOrNull[][] {
    let currentQueue = [this.root];
    let nextQueue: NodeOrNull[] = [];
    const result = [[fn(this.root)]];
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
  }

  flattenDataByHeight(): NodeOrNull[][] {
    return this.flattenByHeight(nodeData);
  }

  /*
   * Get the width of each height of the tree from top to bottom
   */
  widthsByHeight(): Array<number> {
    return widthsByHeight(this.root);
  }

  /*
   * Root has height 0
   */
  nodesAtHeight(height: number): Array<NodeOrNull> {
    const counter = this.root ? [1] : [];
    let currentQueue = [this.root];
    if (counter.length === height) {
      return currentQueue;
    }
    let nextQueue: NodeOrNull[] = [];
    do {
      while (currentQueue.length) {
        const node = currentQueue.pop();
        hasChildren(node) && nextQueue.push(...node.children);
      }
      if (counter.length === height) {
        return nextQueue;
        break;
      } else {
        if (nextQueue.length) {
          counter[counter.length] = nextQueue.length;
        }
        [nextQueue, currentQueue] = [currentQueue, nextQueue];
      }
    } while (currentQueue.length);
    return [];
  }

  countNodes(): number {
    return this.widthsByHeight().reduce((acc, curr) => acc + curr, 0);
  }

  maxWidth(): number {
    return Math.max(...this.widthsByHeight());
  }

  height(): number {
    return this.root ? this.root.height() : 0;
  }

  toJson(): string {
    return this.root ? this.root.toJson() : '';
  }
}

export default Tree;
