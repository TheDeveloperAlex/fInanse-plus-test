import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export type StudioSection = 'general' | 'content' | 'layout';
export type Theme = 'light' | 'dark';
/** Ниже 768px видна только одна зона за раз (UI-SPEC "Адаптив"). */
export type MobileView = 'settings' | 'preview';

export const activeSectionAtom = atom<StudioSection>('general');

export const mobileViewAtom = atom<MobileView>('settings');

/** 1 = 100 %; шаг зума см. PreviewCanvas (0.5–1.5). */
export const zoomAtom = atom<number>(1);

export const themeAtom = atomWithStorage<Theme>('its:theme', 'light');
