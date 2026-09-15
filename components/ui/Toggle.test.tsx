import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Toggle } from './Toggle';

describe('Toggle', () => {
  it('renders as an accessible switch reflecting its checked state', () => {
    render(<Toggle checked onCheckedChange={() => {}} aria-label="Show logo" />);

    const switchEl = screen.getByRole('switch', { name: 'Show logo' });
    expect(switchEl).toHaveAttribute('aria-checked', 'true');
  });

  it('calls onCheckedChange with the flipped value on click', () => {
    const onCheckedChange = vi.fn();
    render(<Toggle checked={false} onCheckedChange={onCheckedChange} aria-label="Show logo" />);

    fireEvent.click(screen.getByRole('switch', { name: 'Show logo' }));

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });
});
