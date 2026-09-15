import { render, screen } from '@testing-library/react';
import { Provider, createStore } from 'jotai';
import { describe, expect, it } from 'vitest';
import { showBlocksAtom } from '@/lib/atoms/settings';
import { TotalsBlock } from './TotalsBlock';

function renderWithStore(store: ReturnType<typeof createStore>) {
  return render(
    <Provider store={store}>
      <TotalsBlock />
    </Provider>,
  );
}

describe('TotalsBlock', () => {
  it('includes Discount and Taxes in Total and Balance Due by default', () => {
    const store = createStore();
    renderWithStore(store);

    // Subtotal 595000 - discount 25000 = 570000 taxable; 8% tax = 45600 (rounded);
    // total = 615600; balance due = 615600 - payment made 100000 = 515600.
    expect(screen.getByText('$6,156.00')).toBeInTheDocument();
    expect(screen.getByText('$5,156.00')).toBeInTheDocument();
  });

  it('excludes the discount from Total and Balance Due when the block is hidden', () => {
    const store = createStore();
    store.set(showBlocksAtom, { ...store.get(showBlocksAtom), discount: false });
    renderWithStore(store);

    expect(screen.queryByText('Discount')).not.toBeInTheDocument();
    // Without the discount: taxable 595000, tax 47600, total 642600, balance due 542600.
    expect(screen.getByText('$6,426.00')).toBeInTheDocument();
    expect(screen.getByText('$5,426.00')).toBeInTheDocument();
  });
});
