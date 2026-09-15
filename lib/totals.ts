import type { SampleInvoice } from './sample-invoice';
import type { BlockKey } from './types';

export type InvoiceTotals = {
  subtotalMinor: number;
  discountMinor: number;
  taxMinor: number;
  totalMinor: number;
  paymentMadeMinor: number;
  balanceDueMinor: number;
};

/**
 * Скрытие Discount/Taxes исключает суммы из Total и Balance Due, а не просто
 * прячет строку (CLAUDE.md, ADR-7) — единственное округление во всём конвейере
 * происходит здесь, при переводе ставки налога в целые минорные единицы.
 */
export function calculateTotals(
  invoice: SampleInvoice,
  show: Record<BlockKey, boolean>,
): InvoiceTotals {
  const subtotalMinor = invoice.lineItems.reduce((sum, line) => sum + line.rateMinor, 0);
  const discountMinor = show.discount ? invoice.discountMinor : 0;
  const taxableMinor = subtotalMinor - discountMinor;
  const taxMinor = show.taxes ? Math.round((taxableMinor * invoice.taxRatePermille) / 1000) : 0;
  const totalMinor = taxableMinor + taxMinor;
  const paymentMadeMinor = show.paymentMade ? invoice.paymentMadeMinor : 0;
  const balanceDueMinor = totalMinor - paymentMadeMinor;

  return { subtotalMinor, discountMinor, taxMinor, totalMinor, paymentMadeMinor, balanceDueMinor };
}
