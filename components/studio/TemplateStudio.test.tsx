import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TemplateStudio } from './TemplateStudio';

describe('TemplateStudio', () => {
  it('renders the studio shell with the invoice document in the canvas', () => {
    render(<TemplateStudio />);

    expect(screen.getByRole('textbox', { name: 'Rename template' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Invoice' })).toBeInTheDocument();
    expect(screen.getByRole('tablist', { name: 'Settings sections' })).toBeInTheDocument();
  });
});
