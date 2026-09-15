import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ColorField } from './ColorField';

describe('ColorField', () => {
  it('opens the popover and shows a low-contrast warning for a light color on white paper', async () => {
    render(
      <ColorField value="#f5f5f5" onChange={() => {}} label="Primary Color" presets={['#2f6fed']} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Primary Color' }));

    expect(await screen.findByText(/Low contrast on white paper/)).toBeInTheDocument();
  });

  it('does not warn for a color with sufficient contrast', () => {
    render(
      <ColorField value="#14161b" onChange={() => {}} label="Primary Color" presets={['#2f6fed']} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Primary Color' }));

    expect(screen.queryByText(/Low contrast on white paper/)).not.toBeInTheDocument();
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
