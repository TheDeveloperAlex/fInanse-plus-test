'use client';

import { useEffect } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { AlertDialog } from 'radix-ui';
import { Moon, Redo2, Sun, Undo2 } from 'lucide-react';
import { nameAtom, settingsAtom } from '@/lib/atoms/settings';
import { canRedoAtom, canUndoAtom, redoAtom, resetHistoryAtom, undoAtom } from '@/lib/atoms/history';
import { cancelAtom, isDirtyAtom, markHydratedAtom, saveAtom } from '@/lib/atoms/saved';
import { themeAtom } from '@/lib/atoms/ui';
import { DEFAULTS } from '@/lib/defaults';
import printStyles from '@/styles/print.module.css';

export function TopBar() {
  const [name, setName] = useAtom(nameAtom);
  const isDirty = useAtomValue(isDirtyAtom);
  const canUndo = useAtomValue(canUndoAtom);
  const canRedo = useAtomValue(canRedoAtom);
  const undo = useSetAtom(undoAtom);
  const redo = useSetAtom(redoAtom);
  const cancel = useSetAtom(cancelAtom);
  const save = useSetAtom(saveAtom);
  const resetSettings = useSetAtom(settingsAtom);
  const markHydrated = useSetAtom(markHydratedAtom);
  const resetHistory = useSetAtom(resetHistoryAtom);
  const [theme, setTheme] = useAtom(themeAtom);

  // Черновик из localStorage гидрируется в эффекте атома (jotai onMount), а не
  // во время рендера. Сразу после монтирования фиксируем его как "сохранённый"
  // и обрезаем историю — иначе первый Undo откатил бы к DEFAULTS (ADR-3).
  useEffect(() => {
    markHydrated();
    resetHistory();
  }, [markHydrated, resetHistory]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Cmd/Ctrl+Z и Shift+Cmd/Ctrl+Z — глобальный undo/redo черновика. Не
  // перехватываем, если фокус в текстовом поле: там Cmd+Z должен остаться
  // нативным undo ввода, а не откатывать весь шаблон на шаг назад.
  useEffect(() => {
    function isTextEditable(element: Element | null): boolean {
      if (!element) return false;
      const tagName = element.tagName;
      return tagName === 'INPUT' || tagName === 'TEXTAREA';
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'z') return;
      if (isTextEditable(document.activeElement)) return;

      event.preventDefault();
      if (event.shiftKey) {
        redo();
      } else {
        undo();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const nameError = name.trim().length === 0;

  return (
    <header
      className={`flex h-topbar shrink-0 items-center justify-between gap-4 border-b border-border bg-surface px-4 ${printStyles.hideOnPrint}`}
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-label="Rename template"
          aria-invalid={nameError}
          className="h-8 min-w-0 rounded-md border border-transparent bg-transparent px-1.5 text-sm font-medium text-ink hover:border-border focus-visible:border-border-strong"
        />
        {isDirty ? <span className="shrink-0 text-[11px] text-ink-muted">Not saved</span> : null}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Undo"
            disabled={!canUndo}
            onClick={() => undo()}
            className="flex h-7 w-7 max-md:h-11 max-md:w-11 items-center justify-center rounded-md text-ink-muted hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Undo2 className="size-3.5" />
          </button>
          <button
            type="button"
            aria-label="Redo"
            disabled={!canRedo}
            onClick={() => redo()}
            className="flex h-7 w-7 max-md:h-11 max-md:w-11 items-center justify-center rounded-md text-ink-muted hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Redo2 className="size-3.5" />
          </button>
          <button
            type="button"
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex h-7 w-7 max-md:h-11 max-md:w-11 items-center justify-center rounded-md text-ink-muted hover:bg-surface-hover"
          >
            {theme === 'dark' ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
          </button>
        </div>

        <AlertDialog.Root>
          <AlertDialog.Trigger asChild>
            <button
              type="button"
              className="rounded-md px-2.5 py-1.5 max-md:min-h-11 text-xs font-medium text-ink-muted hover:bg-surface-hover"
            >
              Reset
            </button>
          </AlertDialog.Trigger>
          <AlertDialog.Portal>
            <AlertDialog.Overlay className="fixed inset-0 bg-black/40" />
            <AlertDialog.Content className="fixed left-1/2 top-1/2 w-80 -translate-x-1/2 -translate-y-1/2 rounded-md border border-border bg-surface p-4 shadow-lg">
              <AlertDialog.Title className="text-sm font-semibold text-ink">
                Reset template?
              </AlertDialog.Title>
              <AlertDialog.Description className="mt-1.5 text-xs text-ink-muted">
                This discards the current draft and restores the default template. This cannot be
                undone.
              </AlertDialog.Description>
              <div className="mt-4 flex justify-end gap-2">
                <AlertDialog.Cancel asChild>
                  <button
                    type="button"
                    className="rounded-md border border-border px-3 py-1.5 max-md:min-h-11 text-xs text-ink hover:bg-surface-hover"
                  >
                    Cancel
                  </button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <button
                    type="button"
                    onClick={() => resetSettings(DEFAULTS)}
                    className="rounded-md bg-danger px-3 py-1.5 max-md:min-h-11 text-xs font-medium text-white hover:opacity-90"
                  >
                    Reset
                  </button>
                </AlertDialog.Action>
              </div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>

        <button
          type="button"
          onClick={() => cancel()}
          disabled={!isDirty}
          className="rounded-md border border-border px-3 py-1.5 max-md:min-h-11 text-xs text-ink hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => save()}
          disabled={!isDirty}
          className="rounded-md bg-accent px-3 py-1.5 max-md:min-h-11 text-xs font-medium text-accent-ink hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Save
        </button>
      </div>
    </header>
  );
}
