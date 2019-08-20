import { generateId } from '../utils';

describe('generateId', () => {
  test('returns a string 36 characters long', () => {
    const result = generateId();
    expect(typeof result).toBe('string');
    expect(result).toHaveLength(36);
  });
});
