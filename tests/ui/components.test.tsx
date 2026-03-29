/**
 * UI Components Tests
 * Tests for Button, Card, Badge, and Input components
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';

describe('Button Component', () => {
  it('should render primary button', () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole('button', { name: 'Click Me' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-[#E07A5F]');
  });

  it('should render with loading state', () => {
    render(<Button isLoading>Loading</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('should call onClick handler', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    const button = screen.getByRole('button', { name: 'Click Me' });

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should have focus-visible styles', () => {
    render(<Button>Focus Test</Button>);
    const button = screen.getByRole('button', { name: 'Focus Test' });

    expect(button).toHaveClass('focus-visible:ring-2');
  });

  it('should support ariaLabel prop', () => {
    render(<Button ariaLabel="Close dialog">×</Button>);
    const button = screen.getByRole('button', { name: 'Close dialog' });

    expect(button).toBeInTheDocument();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
  });
});

describe('Card Component', () => {
  it('should render card with children', () => {
    render(
      <Card>
        <h2>Card Title</h2>
        <p>Card content</p>
      </Card>
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('should apply hover effects by default', () => {
    render(
      <Card data-testid="test-card">
        <p>Content</p>
      </Card>
    );

    const card = screen.getByTestId('test-card');
    expect(card).toHaveClass('hover:-translate-y-1');
  });

  it('should be keyboard accessible when onClick is provided', async () => {
    const handleClick = vi.fn();
    render(
      <Card onClick={handleClick} data-testid="clickable-card">
        <p>Clickable content</p>
      </Card>
    );

    const card = screen.getByTestId('clickable-card');
    expect(card).toHaveAttribute('role', 'button');
    expect(card).toHaveAttribute('tabIndex', '0');

    // Test keyboard interaction
    card.focus();
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should apply padding correctly', () => {
    render(
      <Card padding="lg" data-testid="padded-card">
        <p>Content</p>
      </Card>
    );

    const card = screen.getByTestId('padded-card');
    expect(card).toHaveClass('p-8');
  });
});

describe('Badge Component', () => {
  it('should render default badge', () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText('Default');

    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-gray-100');
  });

  it('should render primary variant', () => {
    render(<Badge variant="primary">Primary</Badge>);
    const badge = screen.getByText('Primary');

    expect(badge).toHaveClass('bg-[#E07A5F]');
  });

  it('should render secondary variant', () => {
    render(<Badge variant="secondary">Secondary</Badge>);
    const badge = screen.getByText('Secondary');

    expect(badge).toHaveClass('bg-[#1B263B]');
  });

  it('should render resource type variants', () => {
    const { rerender } = render(<Badge variant="pdf">PDF</Badge>);

    expect(screen.getByText('PDF')).toHaveClass('bg-[#E07A5F]');

    rerender(<Badge variant="template">Template</Badge>);
    expect(screen.getByText('Template')).toHaveClass('bg-[#F4A261]');

    rerender(<Badge variant="guide">Guide</Badge>);
    expect(screen.getByText('Guide')).toHaveClass('bg-[#A8DADC]');
  });

  it('should support size prop', () => {
    render(<Badge size="md">Medium Badge</Badge>);
    const badge = screen.getByText('Medium Badge');

    expect(badge).toHaveClass('px-3');
  });
});

describe('Input Component', () => {
  it('should render input with label', () => {
    render(<Input label="Email" placeholder="Enter email" />);

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
  });

  it('should render error state', () => {
    render(
      <Input
        label="Password"
        error="Password is required"
        placeholder="Enter password"
      />
    );

    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toHaveClass('text-red-500');
  });

  it('should render with left icon', () => {
    render(
      <Input
        label="Search"
        placeholder="Search..."
        leftIcon={<span data-testid="left-icon">🔍</span>}
      />
    );

    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
  });

  it('should be focusable', () => {
    render(<Input label="Username" placeholder="Enter username" />);
    const input = screen.getByLabelText('Username');

    input.focus();
    expect(input).toHaveFocus();
  });
});

describe('Accessibility', () => {
  it('Button should have proper ARIA support', () => {
    render(<Button ariaLabel="Close dialog">×</Button>);
    const button = screen.getByRole('button', { name: 'Close dialog' });

    expect(button).toHaveAttribute('aria-label', 'Close dialog');
  });

  it('Card should be keyboard accessible', async () => {
    const handleClick = vi.fn();
    render(
      <Card onClick={handleClick} data-testid="accessible-card">
        <p>Content</p>
      </Card>
    );

    const card = screen.getByTestId('accessible-card');

    // Test Enter key
    // Tab to the card
    card.focus();
    card.focus();
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('Input should have proper label association', () => {
    render(<Input label="Full Name" placeholder="John Doe" />);
    const input = screen.getByLabelText('Full Name');

    expect(input).toHaveAttribute('id');
    expect(screen.getByText('Full Name')).toHaveAttribute('for', input.getAttribute('id'));
  });
});

describe('Design System Compliance', () => {
  it('Button should use brand colors correctly', () => {
    render(<Button variant="primary">Primary</Button>);
    const button = screen.getByRole('button', { name: 'Primary' });

    // Primary should use terracotta (#E07A5F)
    expect(button).toHaveClass('bg-[#E07A5F]');
  });

  it('Button secondary should use navy color', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button', { name: 'Secondary' });

    // Secondary should use navy (#1B263B)
    expect(button).toHaveClass('bg-[#1B263B]');
  });

  it('Components should have consistent border radius', () => {
    render(<Button>Button</Button>);
    render(<Card><p>Card</p></Card>);

    expect(screen.getByRole('button')).toHaveClass('rounded-lg');
    // Card should have larger radius
    // Note: Card uses rounded-xl via bg-white rounded-xl
  });

  it('Components should have consistent transitions', () => {
    render(<Button>Button</Button>);
    render(<Card><p>Card</p></Card>);

    // Button should have 200ms transition
    expect(screen.getByRole('button')).toHaveClass('duration-200');
    // Card should have 300ms transition
  });
});
