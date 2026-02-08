import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GlassCard from './GlassCard';

describe('GlassCard', () => {
  it('renders correctly with children', () => {
    render(<GlassCard>Test Content</GlassCard>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<GlassCard className="custom-class">Test Content</GlassCard>);
    const card = screen.getByText('Test Content').closest('div');
    expect(card).toHaveClass('custom-class');
  });

  it('applies default glassmorphism styles', () => {
    render(<GlassCard>Test Content</GlassCard>);
    const card = screen.getByText('Test Content').closest('div');
    expect(card).toHaveClass('backdrop-blur-lg');
    expect(card).toHaveClass('rounded-lg');
    expect(card).toHaveClass('shadow-lg');
  });
});
