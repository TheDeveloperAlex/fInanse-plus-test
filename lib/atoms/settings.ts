import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { DEFAULTS } from '../defaults';
import { fieldOf } from '../lens';
import type { TemplateSettings } from '../types';

export const STORAGE_KEY = 'its:draft';

const storageAtom = atomWithStorage<TemplateSettings>(STORAGE_KEY, DEFAULTS);

/**
 * `atomWithStorage` пишет через `SetStateActionWithReset`, чтобы поддержать
 * функции-обновители и RESET. Ниже перекрываем этот атом собственным writable
 * атомом с простой сигнатурой `(value: TemplateSettings)`, чтобы `fieldOf`
 * (lens.ts) и весь остальной код всегда работали с одной простой формой записи.
 */
export const settingsAtom = atom(
  (get) => get(storageAtom),
  (get, set, value: TemplateSettings) => set(storageAtom, value),
);

export const brandingAtom = fieldOf(settingsAtom, 'branding');
export const contentAtom = fieldOf(settingsAtom, 'content');
export const layoutAtom = fieldOf(settingsAtom, 'layout');

export const nameAtom = fieldOf(settingsAtom, 'name');

export const primaryColorAtom = fieldOf(brandingAtom, 'primaryColor');
export const secondaryColorAtom = fieldOf(brandingAtom, 'secondaryColor');
export const showLogoAtom = fieldOf(brandingAtom, 'showLogo');
export const logoDataUrlAtom = fieldOf(brandingAtom, 'logoDataUrl');
export const logoSizeAtom = fieldOf(brandingAtom, 'logoSize');
export const showAccentBarAtom = fieldOf(brandingAtom, 'showAccentBar');

export const headingAtom = fieldOf(contentAtom, 'heading');
export const labelsAtom = fieldOf(contentAtom, 'labels');
export const showBlocksAtom = fieldOf(contentAtom, 'show');
export const termsAtom = fieldOf(contentAtom, 'terms');
export const statementAtom = fieldOf(contentAtom, 'statement');

export const fontAtom = fieldOf(layoutAtom, 'font');
export const densityAtom = fieldOf(layoutAtom, 'density');
export const headerAlignAtom = fieldOf(layoutAtom, 'headerAlign');
export const currencyAtom = fieldOf(layoutAtom, 'currency');
export const dateFormatAtom = fieldOf(layoutAtom, 'dateFormat');

/**
 * Подписка на этот атом монтирует settingsAtom, запуская чтение черновика
 * из localStorage (onMount у atomWithStorage срабатывает только при реальной
 * подписке через store.sub, а не при обычном get) — см. HydrationGate.tsx,
 * которому нужно это чтение завершённым ДО markHydratedAtom, а не после.
 * Значение всегда null, чтобы подписчик не перерендеривался при каждом
 * изменении settingsAtom — задача этого атома только в побочном эффекте
 * монтирования, а не в передаче данных.
 */
export const settingsMountTriggerAtom = atom((get) => {
  get(settingsAtom);
  return null;
});
