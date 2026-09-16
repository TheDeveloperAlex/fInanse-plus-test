import { fireEvent, render, screen } from '@testing-library/react';
import { Provider, createStore } from 'jotai';
import { afterEach, describe, expect, it } from 'vitest';
import { PreviewCanvas } from './PreviewCanvas';

function stubClientWidth(width: number) {
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    value: width,
  });
}

function renderWithStore(store: ReturnType<typeof createStore>) {
  return render(
    <Provider store={store}>
      <PreviewCanvas />
    </Provider>,
  );
}

describe('PreviewCanvas zoom', () => {
  afterEach(() => {
    // Restore jsdom's default so this stub doesn't leak into later test files.
    stubClientWidth(0);
  });

  it('defaults to 100% zoom regardless of container width', () => {
    stubClientWidth(390);
    renderWithStore(createStore());

    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('does not change zoom when the window resizes', () => {
    stubClientWidth(1200);
    renderWithStore(createStore());
    expect(screen.getByText('100%')).toBeInTheDocument();

    stubClientWidth(390);
    fireEvent(window, new Event('resize'));

    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('Fit click sets zoom to the container fit ratio via the toolbar clamp', () => {
    // 700 / 794 = 0.881... -> clampZoom rounds to 0.88, within [0.5, 1.5].
    stubClientWidth(700);
    renderWithStore(createStore());
    expect(screen.getByText('100%')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Fit' }));

    expect(screen.getByText('88%')).toBeInTheDocument();
  });

  it('Fit click floors at the toolbar minimum zoom, not a separate 30% floor', () => {
    // 200 / 794 = 0.25 -> below MIN_ZOOM (0.5), so clampZoom raises it to 0.5.
    stubClientWidth(200);
    renderWithStore(createStore());

    fireEvent.click(screen.getByRole('button', { name: 'Fit' }));

    expect(screen.getByText('50%')).toBeInTheDocument();
  });
});
