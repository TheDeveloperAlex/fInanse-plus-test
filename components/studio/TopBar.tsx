'use client';

import { useEffect } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { AlertDialog } from 'radix-ui';
import { Moon, Redo2, Sun, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { nameAtom, settingsAtom } from '@/lib/atoms/settings';
import { canRedoAtom, canUndoAtom, redoAtom, undoAtom } from '@/lib/atoms/history';
import { cancelAtom, isDirtyAtom, saveAtom } from '@/lib/atoms/saved';
import { themeAtom } from '@/lib/atoms/ui';
import { DEFAULTS } from '@/lib/defaults';
import { setThemeCookie } from '@/lib/theme-cookie';
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
  const [theme, setTheme] = useAtom(themeAtom);

  // Тема уже верна с первого байта (cookie + SSR, см. ThemeHydrator, ADR-18) —
  // этот эффект нужен только для переключения ПОСЛЕ загрузки: обновляет
  // атрибут на <html> и cookie, чтобы следующая перезагрузка тоже была верной.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    setThemeCookie(theme);
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
          <IconButton icon={Undo2} label="Undo" disabled={!canUndo} onClick={() => undo()} />
          <IconButton icon={Redo2} label="Redo" disabled={!canRedo} onClick={() => redo()} />
          <IconButton
            icon={theme === 'dark' ? Sun : Moon}
            label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          />
        </div>

        <AlertDialog.Root>
          <AlertDialog.Trigger asChild>
            <Button variant="ghost">Reset</Button>
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
                  <Button variant="secondary">Cancel</Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <Button variant="danger-ghost" onClick={() => resetSettings(DEFAULTS)}>
                    Reset
                  </Button>
                </AlertDialog.Action>
              </div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>

        <Button variant="secondary" onClick={() => cancel()} disabled={!isDirty}>
          Cancel
        </Button>
        <Button variant="primary" onClick={() => save()} disabled={!isDirty}>
          Save
        </Button>
      </div>
    </header>
  );
}
