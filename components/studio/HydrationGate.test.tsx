import { createStore, Provider } from 'jotai';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { DEFAULTS } from '@/lib/defaults';
import { canUndoAtom } from '@/lib/atoms/history';
import { isHydratedAtom, savedSettingsAtom } from '@/lib/atoms/saved';
import { nameAtom, settingsAtom, STORAGE_KEY } from '@/lib/atoms/settings';
import { HydrationGate } from './HydrationGate';
import { TopBar } from './TopBar';

describe('HydrationGate', () => {
  it('marks the draft as hydrated and resets the undo history on mount', () => {
    const store = createStore();

    // Diverge settingsAtom from savedSettingsAtom before mount. With both left
    // at DEFAULTS, markHydrated() and a mutant that deletes it are
    // indistinguishable — this gives the effect an observable job to do.
    store.set(nameAtom, 'Changed before hydration');

    // Dirty canUndo before mount too, so resetHistory()'s effect is also
    // observable. jotai-history's withUndoableHistory only flips canUndo once
    // the undo stack has grown past its first (baseline) entry, so the first
    // read just primes that baseline — the second read, after a further
    // committed change, is what actually marks it dirty.
    expect(store.get(canUndoAtom)).toBe(false);
    store.set(nameAtom, 'Changed again before hydration');
    expect(store.get(canUndoAtom)).toBe(true);

    render(
      <Provider store={store}>
        <HydrationGate>
          <p>Real content</p>
        </HydrationGate>
      </Provider>,
    );

    // markHydrated() ran: the draft is now the saved baseline.
    expect(store.get(savedSettingsAtom)).toEqual(store.get(settingsAtom));
    expect(store.get(isHydratedAtom)).toBe(true);
    // resetHistory() ran: the pre-mount undo stack was cleared.
    expect(store.get(canUndoAtom)).toBe(false);
  });

  it('renders children once hydrated', () => {
    const store = createStore();
    store.set(isHydratedAtom, true);

    render(
      <Provider store={store}>
        <HydrationGate>
          <p>Real content</p>
        </HydrationGate>
      </Provider>,
    );

    expect(screen.getByText('Real content')).toBeInTheDocument();
    expect(screen.queryByRole('status', { name: 'Loading template studio' })).not.toBeInTheDocument();
  });
});

describe('HydrationGate with a real persisted draft in localStorage', () => {
  afterEach(() => {
    // atomWithStorage's write path (settingsAtom -> storageAtom) writes through to
    // real localStorage even against a fresh createStore() — clean up so this seed
    // can't leak into other tests in this file.
    localStorage.removeItem(STORAGE_KEY);
  });

  it('adopts the persisted draft as the hydrated baseline instead of DEFAULTS', () => {
    // Seed localStorage directly (not via store.set) so the fresh store below has
    // never touched it in memory — settingsAtom's baseAtom starts at its initial
    // value (DEFAULTS) until atomWithStorage's onMount reads this back.
    const persisted = { ...DEFAULTS, name: 'Persisted draft' };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));

    const store = createStore();

    render(
      <Provider store={store}>
        <HydrationGate>
          <TopBar />
        </HydrationGate>
      </Provider>,
    );

    // The UI must show the real persisted draft, not DEFAULTS.name.
    expect(screen.getByRole('textbox', { name: 'Rename template' })).toHaveValue('Persisted draft');

    // And that persisted value — not DEFAULTS — must be the baseline HydrationGate
    // captured as "saved": isDirty depends on this being equal to settingsAtom.
    expect(store.get(settingsAtom).name).toBe('Persisted draft');
    expect(store.get(savedSettingsAtom)).toEqual(store.get(settingsAtom));
  });
});
