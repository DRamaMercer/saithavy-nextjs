/**
 * Resource Component Tests
 * Tests for ResourceCard, CategoryFilter, and DownloadModal components
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookOpen, Award } from 'lucide-react';

// Mock resourcesData
const mockCategories = [
  { id: 'all', name: 'All Resources', description: 'Browse all resources', icon: 'Grid', gradient: 'from-blue-500 to-cyan-500', resourceCount: 83 },
  { id: 'mindful-leadership', name: 'Mindful Leadership', description: 'Leadership resources', icon: 'Brain', gradient: 'from-purple-500 to-pink-500', resourceCount: 18 },
];

vi.mock('@/lib/resourcesData', () => ({
  resources: [],
  categories: mockCategories,
  Resource: {} as any,
}));

// Mock Next.js router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    pathname: '/resources',
    query: {}
  })
}));

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

// Lazy load components after mocks are set up
let ResourceCard: any;
let CategoryFilter: any;
let DownloadModal: any;

beforeAll(async () => {
  // Dynamic import after mocks are established
  const cardModule = await import('@/components/ResourceCard');
  const filterModule = await import('@/components/CategoryFilter');
  const modalModule = await import('@/components/DownloadModal');
  ResourceCard = cardModule.default;
  CategoryFilter = filterModule.default;
  DownloadModal = modalModule.default;
});

describe('ResourceCard Component', () => {
  // Cleanup after each test
  afterEach(() => {
    cleanup();
  });
  const mockResource: Resource = {
    id: 'test-resource',
    slug: 'test-resource',
    title: 'Test Resource',
    description: 'A test resource for testing purposes with enough detail',
    category: 'mindful-leadership',
    type: 'PDF',
    featured: true,
    downloads: 5000,
    difficulty: 'Intermediate',
    timeToRead: '30 min',
    targetAudience: 'Team Leads',
    whatYoullLearn: [
      'Test learning outcome 1',
      'Test learning outcome 2',
      'Test learning outcome 3'
    ],
    icon: Award,
    fileSize: '2.5 MB PDF',
    keywords: ['test', 'resource', 'example'],
    isPremium: true
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
      expect(screen.getByText('PDF')).toBeInTheDocument();
    });

    it('should render file size when present', () => {
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
      const iconContainer = document.querySelector('.w-16.h-16');
      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe('Premium Badge', () => {
    it('should show premium badge when isPremium is true', () => {
      render(<ResourceCard resource={mockResource} />);
      expect(screen.getByText('Premium')).toBeInTheDocument();
    });

    it('should not show premium badge when isPremium is false', () => {
      const nonPremiumResource = { ...mockResource, isPremium: false };
      render(<ResourceCard resource={nonPremiumResource} />);
      expect(screen.queryByText('Premium')).not.toBeInTheDocument();
    });

    it('should not show premium badge when isPremium is undefined', () => {
      const undefinedPremiumResource = { ...mockResource, isPremium: undefined };
      render(<ResourceCard resource={undefinedPremiumResource} />);
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
      expect(screen.queryByText(/You'll Learn:/)).not.toBeInTheDocument();
    });

    it('should show details when More is clicked', async () => {
      const user = userEvent.setup();
      render(<ResourceCard resource={mockResource} />);

      await user.click(screen.getByText('More'));

      expect(screen.getByText('Target Audience:')).toBeInTheDocument();
      expect(screen.getByText(/You'll Learn:/)).toBeInTheDocument();
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
      render(<ResourceCard resource={mockResource} />);

      const downloadButton = screen.getByRole('button', { name: /unlock premium resource/i });
      await userEvent.setup().click(downloadButton);

      // Modal should open
      await waitFor(() => {
        expect(screen.getByText(/Get the PDF/i)).toBeInTheDocument();
      });
    });

    it('should link directly to resource page for non-premium', () => {
      const nonPremiumResource = { ...mockResource, isPremium: false };
      render(<ResourceCard resource={nonPremiumResource} />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/resources/mindful-leadership/test-resource');
    });
  });

  describe('Learning Outcomes', () => {
    it('should display all learning outcomes with checkmarks', async () => {
      const user = userEvent.setup();
      render(<ResourceCard resource={mockResource} />);

      await user.click(screen.getByText('More'));

      mockResource.whatYoullLearn?.forEach((outcome) => {
        expect(screen.getByText(outcome)).toBeInTheDocument();
      });
    });
  });
});

describe('CategoryFilter Component', () => {
  // Cleanup after each test
  afterEach(() => {
    cleanup();
  });

  const mockResourceCounts: Record<string, number> = {
    'mindful-leadership': 18,
    'ai-automation': 25,
    'personal-growth': 14,
    'remote-work': 13,
    'overcoming-adversity': 13
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

      expect(screen.getByText('(18)')).toBeInTheDocument();
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
          activeCategory="mindful-leadership"
        />
      );

      const leadershipButton = screen.getByText('Mindful Leadership').closest('button');
      expect(leadershipButton?.className).toContain('bg-');
    });

    it('should not highlight inactive categories', () => {
      render(
        <CategoryFilter
          resourceCounts={mockResourceCounts}
          activeCategory="all"
        />
      );

      const leadershipButton = screen.getByText('Mindful Leadership').closest('button');
      expect(leadershipButton?.className).not.toContain('bg-amber-600');
    });
  });

  describe('Navigation', () => {
    it('should navigate to /resources when All is clicked', async () => {
      const user = userEvent.setup();
      render(
        <CategoryFilter
          resourceCounts={mockResourceCounts}
          activeCategory="mindful-leadership"
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

      await user.click(screen.getByText('Mindful Leadership'));
      expect(mockPush).toHaveBeenCalledWith('/resources/category/mindful-leadership');
    });
  });
});

describe('DownloadModal Component', () => {
  // Cleanup after each test
  afterEach(() => {
    cleanup();
  });
  const mockResource: Resource = {
    id: 'test-resource',
    slug: 'test-resource',
    title: 'Test Resource',
    description: 'A test resource',
    category: 'mindful-leadership',
    type: 'PDF',
    featured: false,
    downloads: 1000,
    difficulty: 'Beginner',
    timeToRead: '15 min',
    targetAudience: 'Everyone',
    whatYoullLearn: ['Test 1', 'Test 2', 'Test 3'],
    isPremium: true,
    icon: BookOpen
  };

  describe('Rendering', () => {
    it('should render modal when open', () => {
      render(<DownloadModal resource={mockResource} onClose={() => {}} />);
      expect(screen.getByText(/Get the PDF/i)).toBeInTheDocument();
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
      expect(screen.getByText(/Send me the PDF/i)).toBeInTheDocument();
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

      const submitButton = screen.getByText(/Send me the PDF/i);
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/First name is required/i)).toBeInTheDocument();
      });
    });

    it('should show error when email is invalid', async () => {
      const user = userEvent.setup();
      render(<DownloadModal resource={mockResource} onClose={() => {}} />);

      const firstNameInput = screen.getByLabelText(/First Name/i);
      const emailInput = screen.getByLabelText(/Work Email/i);
      const submitButton = screen.getByText(/Send me the PDF/i);

      await user.type(firstNameInput, 'John');
      // Leave email empty to trigger validation error
      await user.click(submitButton);

      // Check for validation errors (either email required or invalid format)
      await waitFor(() => {
        const errorElements = document.querySelectorAll('.text-red-500');
        expect(errorElements.length).toBeGreaterThan(0);
      }, { timeout: 3000 });
    });

    it('should accept valid form data', async () => {
      const user = userEvent.setup();
      render(<DownloadModal resource={mockResource} onClose={() => {}} />);

      const firstNameInput = screen.getByLabelText(/First Name/i);
      const emailInput = screen.getByLabelText(/Work Email/i);
      const submitButton = screen.getByText(/Send me the PDF/i);

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
      const submitButton = screen.getByText(/Send me the PDF/i);

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
      const submitButton = screen.getByText(/Send me the PDF/i);

      await user.type(firstNameInput, 'John');
      await user.type(emailInput, 'john@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Check your inbox!/i)).toBeInTheDocument();
        expect(screen.getByText(/We've also started the download/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Close Behavior', () => {
    it('should call onClose when X is clicked', async () => {
      const handleClose = vi.fn();
      const user = userEvent.setup();
      render(<DownloadModal resource={mockResource} onClose={handleClose} />);

      const closeButton = screen.getByRole('button', { name: /close modal/i });
      await user.click(closeButton);
      expect(handleClose).toHaveBeenCalled();
    });

    it('should call onClose when backdrop is clicked', () => {
      const handleClose = vi.fn();
      render(<DownloadModal resource={mockResource} onClose={handleClose} />);

      const backdrop = document.querySelector('.fixed.inset-0.bg-black\\/50');
      if (backdrop) {
        fireEvent.click(backdrop);
        expect(handleClose).toHaveBeenCalled();
      }
    });
  });
});
