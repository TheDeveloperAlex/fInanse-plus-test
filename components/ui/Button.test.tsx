import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('defaults to the secondary variant', () => {
    render(<Button>Cancel</Button>);
    expect(screen.getByRole('button', { name: 'Cancel' }).className).toContain('border-border');
  });

  it('applies the primary variant classes', () => {
    render(<Button variant="primary">Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' }).className).toContain('bg-accent');
  });

  it('applies the ghost variant classes', () => {
    render(<Button variant="ghost">Reset</Button>);
    expect(screen.getByRole('button', { name: 'Reset' }).className).toContain('text-ink-muted');
  });

  it('applies the danger-ghost variant classes', () => {
    render(<Button variant="danger-ghost">Reset</Button>);
    expect(screen.getByRole('button', { name: 'Reset' }).className).toContain('text-danger');
  });

  it('respects the disabled prop', () => {
    render(<Button disabled>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  });

  it('forwards onClick', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    screen.getByRole('button', { name: 'Save' }).click();
    expect(onClick).toHaveBeenCalledOnce();
  });
});
