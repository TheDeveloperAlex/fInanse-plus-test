import { describe, expect, it } from 'vitest';
import { contrastRatio } from './contrast';

/**
 * Значения ниже должны зеркалить app/globals.css. Тест — страховка против
 * повторения находки из ADR-17: UI-SPEC задаёт токен, чей контраст не
 * проходит собственный чеклист доступности (4.5:1 для текста).
 */
const LIGHT = { surface: '#fdfdfe', ink: '#14161b', inkMuted: '#656b77', danger: '#c0362c' };
const DARK = { surface: '#191b1f', ink: '#eceef1', inkMuted: '#99a0ab', danger: '#e5534b' };

const MIN_TEXT_CONTRAST = 4.5;

describe('design token contrast (WCAG AA, normal text)', () => {
  it('light theme: ink and ink-muted meet 4.5:1 on surface', () => {
    expect(contrastRatio(LIGHT.ink, LIGHT.surface)).toBeGreaterThanOrEqual(MIN_TEXT_CONTRAST);
    expect(contrastRatio(LIGHT.inkMuted, LIGHT.surface)).toBeGreaterThanOrEqual(MIN_TEXT_CONTRAST);
    expect(contrastRatio(LIGHT.danger, LIGHT.surface)).toBeGreaterThanOrEqual(MIN_TEXT_CONTRAST);
  });

  it('dark theme: ink and ink-muted meet 4.5:1 on surface', () => {
    expect(contrastRatio(DARK.ink, DARK.surface)).toBeGreaterThanOrEqual(MIN_TEXT_CONTRAST);
    expect(contrastRatio(DARK.inkMuted, DARK.surface)).toBeGreaterThanOrEqual(MIN_TEXT_CONTRAST);
    expect(contrastRatio(DARK.danger, DARK.surface)).toBeGreaterThanOrEqual(MIN_TEXT_CONTRAST);
  });
});
