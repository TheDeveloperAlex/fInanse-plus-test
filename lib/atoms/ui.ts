import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export type StudioSection = 'general' | 'content' | 'layout';
export type Theme = 'light' | 'dark';

export const activeSectionAtom = atom<StudioSection>('general');

/** 1 = 100 %; шаг зума см. PreviewCanvas (0.5–1.5). */
export const zoomAtom = atom<number>(1);

export const themeAtom = atomWithStorage<Theme>('its:theme', 'light');
