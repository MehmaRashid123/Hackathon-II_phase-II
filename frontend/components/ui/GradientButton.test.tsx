import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GradientButton } from './GradientButton';

describe('GradientButton', () => {
  it('renders correctly with children', () => {
    render(<GradientButton>Click Me</GradientButton>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<GradientButton className="custom-button">Click Me</GradientButton>);
    expect(screen.getByRole('button', { name: /click me/i })).toHaveClass('custom-button');
  });

  it('shows loading spinner when isLoading is true', () => {
    render(<GradientButton isLoading>Loading...</GradientButton>);
    expect(screen.getByRole('button', { name: /loading.../i })).toBeDisabled();
    expect(screen.getByRole('button')).toContainHTML('<svg'); // Check for the presence of SVG spinner
  });

  it('is disabled when disabled prop is true', () => {
    render(<GradientButton disabled>Click Me</GradientButton>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeDisabled();
  });

  it('applies default variant styles', () => {
    render(<GradientButton>Click Me</GradientButton>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toHaveClass('bg-gradient-to-r'); // Check for gradient class
    expect(button).toHaveClass('from-btn-start'); // Check for gradient class
  });

  it('applies secondary variant styles', () => {
    render(<GradientButton variant="secondary">Click Me</GradientButton>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toHaveClass('from-secondary-light'); // Check for secondary gradient class
  });
});
