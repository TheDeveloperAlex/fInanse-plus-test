import { atom } from 'jotai';
import { SAMPLE_INVOICE } from '../sample-invoice';
import { calculateTotals } from '../totals';
import { showBlocksAtom } from './settings';

/**
 * Пересчитывается только при изменении `content.show` — благодаря тому, что
 * `showBlocksAtom` уже точечная линза (ADR-3), смена шрифта или темы не
 * трогает этот атом и не перерисовывает TotalsBlock.
 */
export const totalsAtom = atom((get) => calculateTotals(SAMPLE_INVOICE, get(showBlocksAtom)));
