/**
 * Resource Component Tests
 * Tests for ResourceCard, CategoryFilter, and DownloadModal components
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Resource, categories } from '@/lib/resourcesData';
import ResourceCard from '@/components/ResourceCard';
import CategoryFilter from '@/components/CategoryFilter';
import DownloadModal from '@/components/DownloadModal';

// Mock Next.js router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    pathname: '/resources',
    query: {}
  })
}));

describe('ResourceCard Component', () => {
  const mockResource: Resource = {
    id: 'test-resource',
    title: 'Test Resource',
    description: 'A test resource for testing purposes',
    category: 'leadership',
    type: 'E-Book',
    icon: <div data-testid="resource-icon">Icon</div>,
    url: '/test-resource.pdf',
    fileSize: '2.5 MB PDF',
    difficulty: 'Intermediate',
    timeToRead: '30 min',
    targetAudience: 'Team Leads',
    whatYoullLearn: [
      'Test learning outcome 1',
      'Test learning outcome 2',
      'Test learning outcome 3'
    ],
    featured: true,
    downloads: 5000
  };

  beforeEach(() => {
    mockPush.mockClear();
  });

  describe('Rendering', () => {
    it('should render resource title', () => {
      render(<ResourceCard resource={mockResource} />);
      expect(screen.getByText('Test Resource')).toBeInTheDocument();
    });

    it('should render resource description', () => {
      render(<ResourceCard resource={mockResource} />);
      expect(screen.getByText(/A test resource for testing purposes/)).toBeInTheDocument();
    });

    it('should render resource type badge', () => {
      render(<ResourceCard resource={mockResource} />);
      expect(screen.getByText('E-Book')).toBeInTheDocument();
    });

    it('should render file size', () => {
      render(<ResourceCard resource={mockResource} />);
      expect(screen.getByText('2.5 MB PDF')).toBeInTheDocument();
    });

    it('should render difficulty level', () => {
      render(<ResourceCard resource={mockResource} />);
      expect(screen.getByText('Intermediate')).toBeInTheDocument();
    });

    it('should render time to read', () => {
      render(<ResourceCard resource={mockResource} />);
      expect(screen.getByText('30 min')).toBeInTheDocument();
    });

    it('should render download count', () => {
      render(<ResourceCard resource={mockResource} />);
      expect(screen.getByText('5K')).toBeInTheDocument();
    });

    it('should render resource icon', () => {
      render(<ResourceCard resource={mockResource} />);
      expect(screen.getByTestId('resource-icon')).toBeInTheDocument();
    });
  });

  describe('Premium Badge', () => {
    it('should show premium badge when isPremium is true', () => {
      const premiumResource = { ...mockResource, isPremium: true };
      render(<ResourceCard resource={premiumResource} />);
      expect(screen.getByText('Premium')).toBeInTheDocument();
    });

    it('should not show premium badge when isPremium is false or undefined', () => {
      render(<ResourceCard resource={mockResource} />);
      expect(screen.queryByText('Premium')).not.toBeInTheDocument();
    });
  });

  describe('Expand/Collapse', () => {
    it('should show More button initially', () => {
      render(<ResourceCard resource={mockResource} />);
      expect(screen.getByText('More')).toBeInTheDocument();
    });

    it('should not show details initially', () => {
      render(<ResourceCard resource={mockResource} />);
      expect(screen.queryByText('Target Audience:')).not.toBeInTheDocument();
      expect(screen.queryByText('You\'ll Learn:')).not.toBeInTheDocument();
    });

    it('should show details when More is clicked', async () => {
      const user = userEvent.setup();
      render(<ResourceCard resource={mockResource} />);

      await user.click(screen.getByText('More'));

      expect(screen.getByText('Target Audience:')).toBeInTheDocument();
      expect(screen.getByText('You\'ll Learn:')).toBeInTheDocument();
      expect(screen.getByText('Team Leads')).toBeInTheDocument();
      expect(screen.getByText('Test learning outcome 1')).toBeInTheDocument();
    });

    it('should show Less button when expanded', async () => {
      const user = userEvent.setup();
      render(<ResourceCard resource={mockResource} />);

      await user.click(screen.getByText('More'));
      expect(screen.getByText('Less')).toBeInTheDocument();
    });

    it('should hide details when Less is clicked', async () => {
      const user = userEvent.setup();
      render(<ResourceCard resource={mockResource} />);

      await user.click(screen.getByText('More'));
      await user.click(screen.getByText('Less'));

      expect(screen.queryByText('Target Audience:')).not.toBeInTheDocument();
    });
  });

  describe('Download Behavior', () => {
    it('should show download modal for premium resources', async () => {
      const premiumResource = { ...mockResource, isPremium: true };
      render(<ResourceCard resource={premiumResource} />);

      const downloadButton = screen.getByRole('button').querySelector('svg');
      if (downloadButton) {
        await userEvent.setup().click(downloadButton.closest('button')!);
        expect(screen.getByText(/Get the E-Book/i)).toBeInTheDocument();
      }
    });

    it('should link directly to resource for non-premium', () => {
      render(<ResourceCard resource={mockResource} />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/test-resource.pdf');
    });
  });

  describe('Learning Outcomes', () => {
    it('should display all learning outcomes with checkmarks', async () => {
      const user = userEvent.setup();
      render(<ResourceCard resource={mockResource} />);

      await user.click(screen.getByText('More'));

      mockResource.whatYoullLearn.forEach((outcome) => {
        expect(screen.getByText(outcome)).toBeInTheDocument();
      });
    });
  });
});

describe('CategoryFilter Component', () => {
  const mockResourceCounts: Record<string, number> = {
    leadership: 3,
    'team-management': 3,
    productivity: 3,
    communication: 3,
    templates: 3,
    assessments: 3
  };

  beforeEach(() => {
    mockPush.mockClear();
  });

  describe('Rendering', () => {
    it('should render all categories', () => {
      render(
        <CategoryFilter
          resourceCounts={mockResourceCounts}
          activeCategory="all"
        />
      );

      categories.forEach((category) => {
        expect(screen.getByText(category.name)).toBeInTheDocument();
      });
    });

    it('should show resource counts for non-all categories', () => {
      render(
        <CategoryFilter
          resourceCounts={mockResourceCounts}
          activeCategory="all"
        />
      );

      expect(screen.getByText('(3)')).toBeInTheDocument();
    });

    it('should not show count for "All Resources"', () => {
      render(
        <CategoryFilter
          resourceCounts={mockResourceCounts}
          activeCategory="all"
        />
      );

      const allButton = screen.getByText('All Resources').closest('button');
      expect(allButton?.textContent).not.toContain('(');
    });
  });

  describe('Active State', () => {
    it('should highlight active category', () => {
      render(
        <CategoryFilter
          resourceCounts={mockResourceCounts}
          activeCategory="leadership"
        />
      );

      const leadershipButton = screen.getByText('Leadership').closest('button');
      expect(leadershipButton).toHaveClass('bg-amber-600');
    });

    it('should not highlight inactive categories', () => {
      render(
        <CategoryFilter
          resourceCounts={mockResourceCounts}
          activeCategory="all"
        />
      );

      const leadershipButton = screen.getByText('Leadership').closest('button');
      expect(leadershipButton).not.toHaveClass('bg-amber-600');
    });
  });

  describe('Navigation', () => {
    it('should navigate to /resources when All is clicked', async () => {
      const user = userEvent.setup();
      render(
        <CategoryFilter
          resourceCounts={mockResourceCounts}
          activeCategory="leadership"
        />
      );

      await user.click(screen.getByText('All Resources'));
      expect(mockPush).toHaveBeenCalledWith('/resources');
    });

    it('should navigate to category page when category is clicked', async () => {
      const user = userEvent.setup();
      render(
        <CategoryFilter
          resourceCounts={mockResourceCounts}
          activeCategory="all"
        />
      );

      await user.click(screen.getByText('Leadership'));
      expect(mockPush).toHaveBeenCalledWith('/resources/category/leadership');
    });
  });
});

describe('DownloadModal Component', () => {
  const mockResource: Resource = {
    id: 'test-resource',
    title: 'Test Resource',
    description: 'A test resource',
    category: 'leadership',
    type: 'E-Book',
    icon: <div>Icon</div>,
    url: '/test.pdf',
    fileSize: '2 MB PDF',
    difficulty: 'Beginner',
    timeToRead: '15 min',
    targetAudience: 'Everyone',
    whatYoullLearn: ['Test 1', 'Test 2'],
    featured: false,
    downloads: 1000,
    isPremium: true
  };

  describe('Rendering', () => {
    it('should render modal when open', () => {
      render(<DownloadModal resource={mockResource} onClose={() => {}} />);
      expect(screen.getByText(/Get the E-Book/i)).toBeInTheDocument();
    });

    it('should display resource title', () => {
      render(<DownloadModal resource={mockResource} onClose={() => {}} />);
      expect(screen.getByText('Test Resource')).toBeInTheDocument();
    });

    it('should render form fields', () => {
      render(<DownloadModal resource={mockResource} onClose={() => {}} />);
      expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Work Email/i)).toBeInTheDocument();
    });

    it('should render submit button', () => {
      render(<DownloadModal resource={mockResource} onClose={() => {}} />);
      expect(screen.getByText(/Send me the E-Book/i)).toBeInTheDocument();
    });

    it('should render unsubscribe notice', () => {
      render(<DownloadModal resource={mockResource} onClose={() => {}} />);
      expect(screen.getByText(/No spam. Unsubscribe anytime./i)).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should show error when firstName is empty', async () => {
      const user = userEvent.setup();
      render(<DownloadModal resource={mockResource} onClose={() => {}} />);

      const submitButton = screen.getByText(/Send me the E-Book/i);
      await user.click(submitButton);

      expect(screen.getByText(/First name is required/i)).toBeInTheDocument();
    });

    it('should show error when email is invalid', async () => {
      const user = userEvent.setup();
      render(<DownloadModal resource={mockResource} onClose={() => {}} />);

      const firstNameInput = screen.getByLabelText(/First Name/i);
      const emailInput = screen.getByLabelText(/Work Email/i);
      const submitButton = screen.getByText(/Send me the E-Book/i);

      await user.type(firstNameInput, 'John');
      await user.type(emailInput, 'invalid-email');
      await user.click(submitButton);

      expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
    });

    it('should accept valid form data', async () => {
      const user = userEvent.setup();
      render(<DownloadModal resource={mockResource} onClose={() => {}} />);

      const firstNameInput = screen.getByLabelText(/First Name/i);
      const emailInput = screen.getByLabelText(/Work Email/i);
      const submitButton = screen.getByText(/Send me the E-Book/i);

      await user.type(firstNameInput, 'John');
      await user.type(emailInput, 'john@example.com');
      await user.click(submitButton);

      // Should not show validation errors
      expect(screen.queryByText(/required/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Invalid email/i)).not.toBeInTheDocument();
    });
  });

  describe('Submission', () => {
    it('should show loading state during submission', async () => {
      const user = userEvent.setup();
      render(<DownloadModal resource={mockResource} onClose={() => {}} />);

      const firstNameInput = screen.getByLabelText(/First Name/i);
      const emailInput = screen.getByLabelText(/Work Email/i);
      const submitButton = screen.getByText(/Send me the E-Book/i);

      await user.type(firstNameInput, 'John');
      await user.type(emailInput, 'john@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Processing\.\.\./i)).toBeInTheDocument();
      });
    });

    it('should show success state after submission', async () => {
      const user = userEvent.setup();
      render(<DownloadModal resource={mockResource} onClose={() => {}} />);

      const firstNameInput = screen.getByLabelText(/First Name/i);
      const emailInput = screen.getByLabelText(/Work Email/i);
      const submitButton = screen.getByText(/Send me the E-Book/i);

      await user.type(firstNameInput, 'John');
      await user.type(emailInput, 'john@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Check your inbox!/i)).toBeInTheDocument();
        expect(screen.getByText(/We've also started the download/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should trigger download after success', async () => {
      const user = userEvent.setup();
      const mockLocation = { href: '' };
      global.window = Object.create(window);
      Object.defineProperty(window, 'location', {
        value: mockLocation,
        writable: true
      });

      render(<DownloadModal resource={mockResource} onClose={() => {}} />);

      const firstNameInput = screen.getByLabelText(/First Name/i);
      const emailInput = screen.getByLabelText(/Work Email/i);
      const submitButton = screen.getByText(/Send me the E-Book/i);

      await user.type(firstNameInput, 'John');
      await user.type(emailInput, 'john@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockLocation.href).toBe('/test.pdf');
      }, { timeout: 3000 });
    });
  });

  describe('Close Behavior', () => {
    it('should call onClose when X is clicked', async () => {
      const handleClose = vi.fn();
      const user = userEvent.setup();
      render(<DownloadModal resource={mockResource} onClose={handleClose} />);

      const closeButton = screen.getByRole('button', { name: '' }).querySelector('svg');
      if (closeButton) {
        await user.click(closeButton.closest('button')!);
        expect(handleClose).toHaveBeenCalled();
      }
    });

    it('should call onClose when backdrop is clicked', () => {
      const handleClose = vi.fn();
      render(<DownloadModal resource={mockResource} onClose={handleClose} />);

      const backdrop = screen.getByText(/Get the E-Book/i).closest('div')?.parentElement;
      if (backdrop) {
        fireEvent.click(backdrop);
        expect(handleClose).toHaveBeenCalled();
      }
    });
  });
});
