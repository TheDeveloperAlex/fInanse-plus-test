import { createStore, Provider, useAtomValue } from 'jotai';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { themeAtom } from '@/lib/atoms/ui';
import { ThemeHydrator } from './ThemeHydrator';

function ThemeProbe() {
  const theme = useAtomValue(themeAtom);
  return <span>Current theme: {theme}</span>;
}

describe('ThemeHydrator', () => {
  it('seeds themeAtom with the server-read value on first render', () => {
    const store = createStore();

    render(
      <Provider store={store}>
        <ThemeHydrator theme="dark">
          <ThemeProbe />
        </ThemeHydrator>
      </Provider>,
    );

    expect(screen.getByText('Current theme: dark')).toBeInTheDocument();
  });

  it('renders its children', () => {
    const store = createStore();

    render(
      <Provider store={store}>
        <ThemeHydrator theme="light">
          <p>Studio content</p>
        </ThemeHydrator>
      </Provider>,
    );

    expect(screen.getByText('Studio content')).toBeInTheDocument();
  });
});
