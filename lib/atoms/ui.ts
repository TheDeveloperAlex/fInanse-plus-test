import { atom } from 'jotai';

export type StudioSection = 'general' | 'content' | 'layout';
/** Персистится через cookie (lib/theme-cookie.ts) + SSR, не localStorage — см. ADR-18. */
export type Theme = 'light' | 'dark';
/** Ниже 768px видна только одна зона за раз (UI-SPEC "Адаптив"). */
export type MobileView = 'settings' | 'preview';

export const activeSectionAtom = atom<StudioSection>('general');

export const mobileViewAtom = atom<MobileView>('settings');

/** 1 = 100 %; шаг зума см. PreviewCanvas (0.5–1.5). */
export const zoomAtom = atom<number>(1);

export const themeAtom = atom<Theme>('light');
