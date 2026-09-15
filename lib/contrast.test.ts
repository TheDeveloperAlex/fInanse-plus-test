import { describe, expect, it } from 'vitest';
import { contrastRatio } from './contrast';

describe('contrastRatio', () => {
  it('is 21:1 for black on white', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0);
  });

  it('is 1:1 for identical colors', () => {
    expect(contrastRatio('#2f6fed', '#2f6fed')).toBeCloseTo(1, 5);
  });

  it('is symmetric regardless of argument order', () => {
    expect(contrastRatio('#2f6fed', '#ffffff')).toBeCloseTo(contrastRatio('#ffffff', '#2f6fed'), 10);
  });

  it('flags a light color as low contrast on white paper', () => {
    expect(contrastRatio('#f5f5f5', '#ffffff')).toBeLessThan(3);
  });
});
