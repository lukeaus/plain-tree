import { Node, nodeData, hasChildren } from './index';
import { NodeOrNull } from './types';

type TraverseReturn = void | boolean;
type TraverseOptions = {
  forSome?: boolean;
  forEvery?: boolean;
};

class Tree {
  constructor(public root: NodeOrNull = null) {
    this.root = root;
  }

  private _traverse(
    fn: Function,
    { forSome, forEvery }: TraverseOptions = {},
    queueMethod: string
  ): TraverseReturn {
    const queue = [this.root];
    let didBreak = false;
    let lastResult: undefined | boolean;
    while (queue.length) {
      const node = queue.shift();
      hasChildren(node) && queue[queueMethod](...node.children);
      if (forSome || forEvery) {
        const result = fn(node);
        if ((forEvery && !result) || (forSome && result)) {
          didBreak = true;
          lastResult = result;
          break;
        }
      } else {
        fn(node);
      }
    }
    if (forEvery) {
      return !didBreak;
    } else if (forSome) {
      return Boolean(lastResult);
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
    return this._traverseBreathFirst(fn);
  }

  /*
   * Hit the bottom of the tree as fast as possible
   * Then go up and get parent's children, then go down again
   */
  traverseDepthFirst(fn: Function): TraverseReturn {
    return this._traverseDepthFirst(fn);
  }

  /*
   * Return true if a single node is truthy for fn, else false
   * exit early on first truthy value
   */
  someBreathFirst(fn: Function): boolean {
    return Boolean(
      this._traverseBreathFirst(fn, {
        forSome: true
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
        forSome: true
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
        forEvery: true
      })
    );
  }

  /*
   * Return true if result of function for every node is truthy
   * exit early on first function falsey value
   */
  everyDepthFirst(fn: Function): boolean {
    return Boolean(this._traverseDepthFirst(fn, { forEvery: true }));
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
