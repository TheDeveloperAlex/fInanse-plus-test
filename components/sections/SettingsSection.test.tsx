import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SettingsSection } from './SettingsSection';

describe('SettingsSection', () => {
  it('renders the title as a heading and shows its children', () => {
    render(
      <SettingsSection title="Colors">
        <p>content</p>
      </SettingsSection>,
    );

    expect(screen.getByRole('heading', { name: 'Colors' })).toBeInTheDocument();
    expect(screen.getByText('content')).toBeInTheDocument();
  });
});
