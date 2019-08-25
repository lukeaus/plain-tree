import {
  generateId,
  filterObject,
  nodeData,
  firstArrayElement
} from '../src/utils';
import Node from '../src/Node';

describe('nodeData', () => {
  test('returns null for null', () => {
    expect(nodeData(null)).toBe(null);
  });
  test('returns data for node', () => {
    expect(nodeData(new Node('a'))).toBe('a');
  });
});

describe('firstArrayElement', () => {
  test('returns null if null', () => {
    expect(firstArrayElement(null)).toBe(null);
  });
  test('returns first array element', () => {
    expect(firstArrayElement(['a', 'b'])).toBe('a');
  });
  test('returns null if empty array', () => {
    expect(firstArrayElement([])).toBe(null);
  });
});

describe('generateId', () => {
  test('returns a string 36 characters long', () => {
    const result = generateId();
    expect(typeof result).toBe('string');
    expect(result).toHaveLength(36);
  });
});

describe('filterObject', () => {
  test('it filters properties', () => {
    const obj = { a: 'aValue', b: 'bValue' };
    const result = filterObject(obj, { disallowedKeys: ['a'] });
    expect('a' in obj).toBe(true);
    expect('a' in result).toBe(false);
    expect('b' in obj).toBe(true);
    expect('b' in result).toBe(true);
  });
  test('should return a new object', () => {
    const obj = {};
    expect(filterObject(obj, { disallowedKeys: [] }) === obj).toBe(false);
  });
});
