import { render } from '@testing-library/react';
import { Provider, createStore } from 'jotai';
import { afterEach, describe, expect, it } from 'vitest';
import { zoomAtom } from '@/lib/atoms/ui';
import { InvoicePaper } from './InvoicePaper';

function stubOffsetHeight(height: number) {
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
    configurable: true,
    value: height,
  });
}

function renderWithZoom(zoom: number) {
  const store = createStore();
  store.set(zoomAtom, zoom);
  return render(
    <Provider store={store}>
      <InvoicePaper />
    </Provider>,
  );
}

describe('InvoicePaper zoom viewport', () => {
  afterEach(() => {
    // Restore jsdom's default so this stub doesn't leak into later test files.
    stubOffsetHeight(0);
  });

  it("shrinks the viewport wrapper to the paper's scaled size, not its natural 794px", () => {
    stubOffsetHeight(1000);
    const { container } = renderWithZoom(0.5);

    const viewport = container.querySelector('[class*="paperViewport"]') as HTMLElement;
    expect(viewport.style.width).toBe('397px');
    expect(viewport.style.height).toBe('500px');
  });

  it('matches the natural size 1:1 at 100% zoom', () => {
    stubOffsetHeight(1000);
    const { container } = renderWithZoom(1);

    const viewport = container.querySelector('[class*="paperViewport"]') as HTMLElement;
    expect(viewport.style.width).toBe('794px');
    expect(viewport.style.height).toBe('1000px');
  });
});
