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

// A fresh store per test isolates zoomAtom: PreviewCanvas's auto-fit effect only
// calls setZoom when the container is narrower than the paper, so without a
// per-test store, a "wide enough" case run after a "narrow" case would inherit
// the previous test's zoom instead of the default 100%.
function renderWithStore(store: ReturnType<typeof createStore>) {
  return render(
    <Provider store={store}>
      <PreviewCanvas />
    </Provider>,
  );
}

describe('PreviewCanvas auto-fit zoom', () => {
  afterEach(() => {
    // Restore jsdom's default so this stub doesn't leak into later test files.
    stubClientWidth(0);
  });

  it('shrinks the zoom to fit when the container is narrower than the paper', () => {
    stubClientWidth(390);
    renderWithStore(createStore());

    expect(screen.getByText('49%')).toBeInTheDocument();
  });

  it('leaves the zoom at 100% when the container is wide enough for the paper', () => {
    stubClientWidth(1200);
    renderWithStore(createStore());

    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('recomputes the fit-to-width value on orientationchange, just like resize', () => {
    stubClientWidth(1200);
    renderWithStore(createStore());
    expect(screen.getByText('100%')).toBeInTheDocument();

    stubClientWidth(390);
    fireEvent(window, new Event('orientationchange'));

    expect(screen.getByText('49%')).toBeInTheDocument();
  });

  it('Fit recomputes the real fit-to-width value instead of resetting to 100%', () => {
    stubClientWidth(390);
    renderWithStore(createStore());
    expect(screen.getByText('49%')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Zoom in' }));
    expect(screen.getByText('59%')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Fit' }));
    expect(screen.getByText('49%')).toBeInTheDocument();
  });
});
