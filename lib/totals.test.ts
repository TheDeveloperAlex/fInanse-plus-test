import { describe, expect, it } from 'vitest';
import { DEFAULT_SHOW_BLOCKS } from './defaults';
import { SAMPLE_INVOICE } from './sample-invoice';
import { calculateTotals } from './totals';

describe('calculateTotals', () => {
  it('adds up line items, applies discount and tax, and subtracts payment made', () => {
    const totals = calculateTotals(SAMPLE_INVOICE, DEFAULT_SHOW_BLOCKS);

    expect(totals.subtotalMinor).toBe(180000 + 320000 + 95000);
    expect(totals.discountMinor).toBe(25000);
    expect(totals.taxMinor).toBe(Math.round((totals.subtotalMinor - 25000) * 0.08));
    expect(totals.totalMinor).toBe(totals.subtotalMinor - totals.discountMinor + totals.taxMinor);
    expect(totals.balanceDueMinor).toBe(totals.totalMinor - totals.paymentMadeMinor);
  });

  it('excludes the discount from Total and Balance Due when the block is hidden', () => {
    const withDiscount = calculateTotals(SAMPLE_INVOICE, DEFAULT_SHOW_BLOCKS);
    const withoutDiscount = calculateTotals(SAMPLE_INVOICE, {
      ...DEFAULT_SHOW_BLOCKS,
      discount: false,
    });

    expect(withoutDiscount.discountMinor).toBe(0);
    expect(withoutDiscount.totalMinor).toBeGreaterThan(withDiscount.totalMinor);
  });

  it('excludes tax from Total and Balance Due when the block is hidden', () => {
    const withoutTax = calculateTotals(SAMPLE_INVOICE, { ...DEFAULT_SHOW_BLOCKS, taxes: false });

    expect(withoutTax.taxMinor).toBe(0);
    expect(withoutTax.totalMinor).toBe(withoutTax.subtotalMinor - withoutTax.discountMinor);
  });

  it('excludes payment made from Balance Due when the block is hidden', () => {
    const withoutPayment = calculateTotals(SAMPLE_INVOICE, {
      ...DEFAULT_SHOW_BLOCKS,
      paymentMade: false,
    });

    expect(withoutPayment.paymentMadeMinor).toBe(0);
    expect(withoutPayment.balanceDueMinor).toBe(withoutPayment.totalMinor);
  });
});
