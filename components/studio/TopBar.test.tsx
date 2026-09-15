import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HydrationGate } from './HydrationGate';
import { TopBar } from './TopBar';

function fireUndo(target: Document | HTMLElement = document) {
  fireEvent.keyDown(target, { key: 'z', metaKey: true });
}

function renderTopBar() {
  return render(
    <HydrationGate>
      <TopBar />
    </HydrationGate>,
  );
}

describe('TopBar keyboard shortcuts', () => {
  it('Cmd+Z triggers undo when focus is outside a text field', () => {
    renderTopBar();
    const nameInput = screen.getByRole('textbox', { name: 'Rename template' });

    fireEvent.change(nameInput, { target: { value: 'Acme' } });
    expect(nameInput).toHaveValue('Acme');

    // .blur() (not fireEvent.blur) — needs to actually move document.activeElement,
    // which is what the shortcut handler checks, not just dispatch a synthetic event.
    nameInput.blur();
    fireUndo();

    expect(nameInput).toHaveValue('Untitled template');
  });

  it('Cmd+Z does not steal native undo while typing in a text field', () => {
    renderTopBar();
    const nameInput = screen.getByRole('textbox', { name: 'Rename template' });

    fireEvent.change(nameInput, { target: { value: 'Acme' } });
    nameInput.focus();
    fireEvent.keyDown(nameInput, { key: 'z', metaKey: true });

    expect(nameInput).toHaveValue('Acme');
  });

  it('opens the reset confirmation dialog', () => {
    renderTopBar();
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });
});
