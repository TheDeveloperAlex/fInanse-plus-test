import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Undo2 } from 'lucide-react';
import { IconButton } from './IconButton';

describe('IconButton', () => {
  it('uses label as the accessible name', () => {
    render(<IconButton icon={Undo2} label="Undo" onClick={() => {}} />);
    expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<IconButton icon={Undo2} label="Undo" onClick={onClick} />);
    screen.getByRole('button', { name: 'Undo' }).click();
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('shows a tooltip with the same label on focus', async () => {
    render(<IconButton icon={Undo2} label="Undo" onClick={() => {}} />);
    screen.getByRole('button', { name: 'Undo' }).focus();
    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveTextContent('Undo');
  });

  it('respects the disabled prop', () => {
    render(<IconButton icon={Undo2} label="Undo" disabled onClick={() => {}} />);
    expect(screen.getByRole('button', { name: 'Undo' })).toBeDisabled();
  });
});
