import { createStore } from 'jotai';
import { describe, expect, it } from 'vitest';
import { DEFAULTS } from '../defaults';
import { cancelAtom, isDirtyAtom, isHydratedAtom, saveAtom, savedSettingsAtom } from './saved';
import { nameAtom, settingsAtom } from './settings';

describe('Save/Cancel baseline (ADR-12)', () => {
  it('is not dirty before any edits', () => {
    const store = createStore();
    store.set(savedSettingsAtom, DEFAULTS);

    expect(store.get(isDirtyAtom)).toBe(false);
  });

  it('becomes dirty after an edit and clean again after Save', () => {
    const store = createStore();
    store.set(savedSettingsAtom, DEFAULTS);

    store.set(nameAtom, 'Acme');
    expect(store.get(isDirtyAtom)).toBe(true);

    store.set(saveAtom);
    expect(store.get(isDirtyAtom)).toBe(false);
    expect(store.get(savedSettingsAtom).name).toBe('Acme');
  });

  it('Cancel discards the draft back to the last saved baseline', () => {
    const store = createStore();
    store.set(savedSettingsAtom, DEFAULTS);

    store.set(nameAtom, 'Acme');
    store.set(saveAtom);

    store.set(nameAtom, 'Unsaved change');
    expect(store.get(isDirtyAtom)).toBe(true);

    store.set(cancelAtom);
    expect(store.get(settingsAtom).name).toBe('Acme');
    expect(store.get(isDirtyAtom)).toBe(false);
  });
});

describe('isHydratedAtom', () => {
  it('starts false', () => {
    const store = createStore();

    expect(store.get(isHydratedAtom)).toBe(false);
  });
});
