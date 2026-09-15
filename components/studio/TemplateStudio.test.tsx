import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TemplateStudio } from './TemplateStudio';

describe('TemplateStudio', () => {
  it('renders the studio shell', () => {
    render(<TemplateStudio />);
    expect(screen.getByText('TopBar')).toBeInTheDocument();
    expect(screen.getByText('Canvas')).toBeInTheDocument();
  });
});
