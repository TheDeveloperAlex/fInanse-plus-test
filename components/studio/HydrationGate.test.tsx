import { createStore, Provider } from 'jotai';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { canUndoAtom } from '@/lib/atoms/history';
import { isHydratedAtom, savedSettingsAtom } from '@/lib/atoms/saved';
import { nameAtom, settingsAtom } from '@/lib/atoms/settings';
import { HydrationGate } from './HydrationGate';

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
