import { Node, nodeData, hasChildren, firstArrayElement } from './index';
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

  flatten(fn: Function | null = null): Array<any> {
    const acc: Array<any> = [];
    this._traverseBreathFirst((node: Node) => {
      (fn && acc.push(fn(node))) || acc.push(node);
    });
    return acc;
  }

  flattenData(): Array<any> {
    return this.flatten(nodeData);
  }

  /*
   * Get the width of each level of the tree from top to bottom
   */
  widthsByHeight(): Array<number> {
    const counter = [1];
    const queue1 = [this.root];
    const queue2: NodeOrNull[] = [];
    let currentQueue = queue1;
    let nextQueue = queue2;
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

  /*
   * Root has height 0
   */
  atHeight(height: number): Array<any> {
    const counter = this.root ? [1] : [];
    const queue1 = [this.root];
    let currentQueue = queue1;
    if (counter.length === height) {
      return currentQueue;
    }
    const queue2: NodeOrNull[] = [];
    let nextQueue = queue2;
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

  maxWidth(): number {
    return Math.max(...this.widthsByHeight());
  }

  // Root has height 0
  height(): number {
    return this.widthsByHeight().length - 1;
  }
}

export default Tree;
