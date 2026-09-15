import { atom } from 'jotai';
import { DEFAULTS } from '../defaults';
import { settingsAtom } from './settings';
import type { TemplateSettings } from '../types';

/**
 * ADR-12: снимок настроек на момент последнего Save. Не персистится отдельно —
 * при гидрации черновика из localStorage baseline выставляется в то же значение
 * (см. hydrateSettingsAtom), так что до первого Save в сессии isDirty = false.
 */
export const savedSettingsAtom = atom<TemplateSettings>(DEFAULTS);

export const isDirtyAtom = atom((get) => get(settingsAtom) !== get(savedSettingsAtom));

export const saveAtom = atom(null, (get, set) => {
  set(savedSettingsAtom, get(settingsAtom));
});

export const cancelAtom = atom(null, (get, set) => {
  set(settingsAtom, get(savedSettingsAtom));
});

/** Вызывается один раз после гидрации черновика из localStorage (см. ADR-3 подводный камень). */
export const markHydratedAtom = atom(null, (get, set) => {
  set(savedSettingsAtom, get(settingsAtom));
});

/** true после того, как HydrationGate подтвердил, что черновик подхвачен из localStorage (ADR-19). */
export const isHydratedAtom = atom(false);
