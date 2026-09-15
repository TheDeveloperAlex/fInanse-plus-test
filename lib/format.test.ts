import { describe, expect, it } from 'vitest';
import { formatDate, formatMoney, formatTaxRate, formatZoom } from './format';

describe('formatMoney', () => {
  it('formats minor units as USD without converting the amount', () => {
    expect(formatMoney(180000, 'USD')).toBe('$1,800.00');
  });

  it('changes only the currency marker when the currency changes, not the underlying number', () => {
    // en-US has no narrow glyph for PLN, so Intl falls back to the ISO code,
    // joined with a non-breaking space (U+00A0) - expected under ADR-14, not a bug.
    expect(formatMoney(180000, 'EUR')).toBe('€1,800.00');
    expect(formatMoney(180000, 'PLN')).toBe(`PLN 1,800.00`);
  });
});

describe('formatDate', () => {
  const isoDate = '2026-09-01';

  it('formats "us" as MM/DD/YYYY', () => {
    expect(formatDate(isoDate, 'us')).toBe('09/01/2026');
  });

  it('formats "eu" as DD/MM/YYYY', () => {
    expect(formatDate(isoDate, 'eu')).toBe('01/09/2026');
  });

  it('formats "iso" as YYYY-MM-DD', () => {
    expect(formatDate(isoDate, 'iso')).toBe('2026-09-01');
  });
});

describe('formatTaxRate', () => {
  it('converts permille to a percent string', () => {
    expect(formatTaxRate(80)).toBe('8%');
  });
});

describe('formatZoom', () => {
  it('formats a zoom fraction as a whole percent', () => {
    expect(formatZoom(1)).toBe('100%');
    expect(formatZoom(0.5)).toBe('50%');
  });
});
