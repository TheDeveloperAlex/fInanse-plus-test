import { createStore } from 'jotai';
import { describe, expect, it } from 'vitest';
import { fieldOf, writable } from './lens';

describe('fieldOf', () => {
  it('reads the current value of the field', () => {
    const store = createStore();
    const parent = writable({ a: 1, b: 'x' });
    const a = fieldOf(parent, 'a');

    expect(store.get(a)).toBe(1);
  });

  it('writes back into the parent without touching sibling fields', () => {
    const store = createStore();
    const parent = writable({ a: 1, b: 'x' });
    const a = fieldOf(parent, 'a');

    store.set(a, 42);

    expect(store.get(parent)).toEqual({ a: 42, b: 'x' });
  });

  it('composes across nested lenses', () => {
    const store = createStore();
    const parent = writable({ nested: { value: 'start' } });
    const nested = fieldOf(parent, 'nested');
    const value = fieldOf(nested, 'value');

    store.set(value, 'updated');

    expect(store.get(parent)).toEqual({ nested: { value: 'updated' } });
  });
});
