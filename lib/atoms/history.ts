import { atom } from 'jotai';
import { REDO, RESET, UNDO, withHistory } from 'jotai-history';
import { settingsAtom } from './settings';

export const HISTORY_LIMIT = 50;

export const historyAtom = withHistory(settingsAtom, HISTORY_LIMIT);

export const canUndoAtom = atom((get) => get(historyAtom).canUndo);
export const canRedoAtom = atom((get) => get(historyAtom).canRedo);

export const undoAtom = atom(null, (_get, set) => set(historyAtom, UNDO));
export const redoAtom = atom(null, (_get, set) => set(historyAtom, REDO));

/** Сбрасывает историю сразу после гидрации черновика, чтобы первый Undo не откатывал к DEFAULTS (ADR-3). */
export const resetHistoryAtom = atom(null, (_get, set) => set(historyAtom, RESET));
