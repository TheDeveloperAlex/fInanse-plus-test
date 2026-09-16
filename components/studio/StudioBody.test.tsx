import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StudioBody } from './StudioBody';

describe('StudioBody', () => {
  it('bounds the settings pane to a scrollable height, matching the preview pane', () => {
    render(<StudioBody />);

    const tablist = screen.getByRole('tablist', { name: 'Settings sections' });
    // DOM chain: SectionRail (role=tablist) -> Tabs.Root (SettingsWorkspace) ->
    // StudioBody's settings-pane wrapper div (the element under test).
    const settingsWrapper = tablist.parentElement?.parentElement;

    expect(settingsWrapper).toHaveClass('flex-1');
    expect(settingsWrapper).toHaveClass('overflow-hidden');
  });
});
