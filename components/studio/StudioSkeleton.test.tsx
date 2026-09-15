import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StudioSkeleton } from './StudioSkeleton';

describe('StudioSkeleton', () => {
  it('announces itself as a loading state', () => {
    render(<StudioSkeleton />);

    expect(screen.getByRole('status', { name: 'Loading template studio' })).toBeInTheDocument();
  });
});
