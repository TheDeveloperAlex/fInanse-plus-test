import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StudioSkeleton } from './StudioSkeleton';

describe('StudioSkeleton', () => {
  it('announces itself as a loading state', () => {
    render(<StudioSkeleton />);

    expect(screen.getByRole('status', { name: 'Loading template studio' })).toBeInTheDocument();
  });

  it('reserves space for the canvas toolbar so the preview column height matches PreviewCanvas', () => {
    const { container } = render(<StudioSkeleton />);

    // CanvasToolbar.tsx uses `h-10 max-md:h-14` for its footer bar below the paper;
    // without a matching placeholder here the preview column grows on hydration.
    expect(container.innerHTML).toContain('max-md:h-14');
  });

  it('tracks the real layout breakpoint instead of a rigid two-column layout', () => {
    const { container } = render(<StudioSkeleton />);

    // StudioBody.tsx stacks settings/preview in a column below `md` and switches to
    // `md:flex-row`; SettingsPanel.tsx is full-width below `md` and fixed `md:w-panel` above it.
    expect(container.innerHTML).toContain('md:flex-row');
    expect(container.innerHTML).toContain('md:w-panel');
  });

  it('reserves space for the mobile Settings/Preview toggle bar below the md breakpoint', () => {
    const { container } = render(<StudioSkeleton />);

    // StudioBody.tsx renders an `md:hidden` SegmentedControl bar above the settings/preview
    // split; without a matching placeholder here that bar's mount shifts everything below it.
    expect(container.innerHTML).toContain('md:hidden');
    expect(container.innerHTML).toContain('max-md:min-h-11');
  });
});
