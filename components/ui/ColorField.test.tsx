import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ColorField } from './ColorField';

describe('ColorField', () => {
  it('opens the popover and shows a low-contrast warning for a light color on white paper', async () => {
    render(
      <ColorField value="#f5f5f5" onChange={() => {}} label="Primary Color" presets={['#2f6fed']} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Primary Color' }));

    expect(await screen.findByText(/Low contrast on white paper/)).not.toHaveClass('invisible');
  });

  it('reserves space for the warning but keeps it invisible for sufficient contrast', () => {
    render(
      <ColorField value="#14161b" onChange={() => {}} label="Primary Color" presets={['#2f6fed']} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Primary Color' }));

    // The warning stays in the DOM (space reserved, no layout shift while dragging
    // the picker) — only its visibility toggles via the `invisible` class, it
    // never mounts/unmounts. jsdom doesn't load Tailwind's stylesheet, so
    // asserting on the class is what's actually checkable here (not toBeVisible()).
    expect(screen.getByText(/Low contrast on white paper/)).toHaveClass('invisible');
  });

  it('applies a preset color when clicked', () => {
    const onChange = vi.fn();
    render(
      <ColorField value="#14161b" onChange={onChange} label="Primary Color" presets={['#2f6fed']} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Primary Color' }));
    fireEvent.click(screen.getByRole('button', { name: 'Preset #2f6fed' }));

    expect(onChange).toHaveBeenCalledWith('#2f6fed');
  });
});
