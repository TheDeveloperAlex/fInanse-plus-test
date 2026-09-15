import { createStore, Provider } from 'jotai';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { isHydratedAtom, savedSettingsAtom } from '@/lib/atoms/saved';
import { settingsAtom } from '@/lib/atoms/settings';
import { HydrationGate } from './HydrationGate';

describe('HydrationGate', () => {
  it('marks the draft as hydrated and resets the baseline on mount', () => {
    const store = createStore();

    render(
      <Provider store={store}>
        <HydrationGate>
          <p>Real content</p>
        </HydrationGate>
      </Provider>,
    );

    expect(store.get(isHydratedAtom)).toBe(true);
    expect(store.get(savedSettingsAtom)).toEqual(store.get(settingsAtom));
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
