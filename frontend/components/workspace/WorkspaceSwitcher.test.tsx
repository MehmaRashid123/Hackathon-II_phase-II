import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';
import { WorkspaceProvider, useWorkspace } from '@/lib/hooks/use-workspace';
import { APIClient } from '@/lib/api-client';
import { Workspace } from '@/lib/types/workspace';
import { vi } from 'vitest';

// Mock the APIClient
vi.mock('@/lib/api-client', () => {
  return {
    APIClient: vi.fn(() => ({
      get: vi.fn(),
      post: vi.fn(),
    })),
  };
});

// Mock the useRouter hook
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => '/dashboard',
}));

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    info: vi.fn(),
    success: vi.fn(),
  },
}));

const mockWorkspaces: Workspace[] = [
  {
    id: 'workspace-1',
    name: 'Personal Projects',
    description: null,
    created_by: 'user-1',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 'workspace-2',
    name: 'Team Alpha',
    description: 'Alpha Team Collaboration',
    created_by: 'user-1',
    created_at: '2023-01-02T00:00:00Z',
    updated_at: '2023-01-02T00:00:00Z',
  },
];

describe('WorkspaceSwitcher', () => {
  let apiClientMock: { get: vi.Mock; post: vi.Mock; };

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    apiClientMock = new APIClient() as any;
    apiClientMock.get.mockResolvedValue({ success: true, data: mockWorkspaces });

    // Clear localStorage before each test
    localStorage.clear();
  });

  it('renders loading state initially', () => {
    // Mock the initial loading state
    apiClientMock.get.mockReturnValueOnce(new Promise(() => {})); // Never resolve to keep it loading

    render(
      <WorkspaceProvider>
        <WorkspaceSwitcher isSidebarOpen={true} />
      </WorkspaceProvider>
    );

    expect(screen.getByText('Loading Workspaces...')).toBeInTheDocument();
  });

  it('renders current workspace name when sidebar is open', async () => {
    localStorage.setItem('lastSelectedWorkspace', 'workspace-2'); // Simulate last selected

    render(
      <WorkspaceProvider>
        <WorkspaceSwitcher isSidebarOpen={true} />
      </WorkspaceProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Team Alpha')).toBeInTheDocument();
    });
  });

  it('displays a list of workspaces when clicked', async () => {
    render(
      <WorkspaceProvider>
        <WorkspaceSwitcher isSidebarOpen={true} />
      </WorkspaceProvider>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByRole('combobox', { name: /select a workspace/i }));
    });

    expect(screen.getByText('Personal Projects')).toBeInTheDocument();
    expect(screen.getByText('Team Alpha')).toBeInTheDocument();
  });

  it('selects a new workspace when an item is clicked', async () => {
    render(
      <WorkspaceProvider>
        <WorkspaceSwitcher isSidebarOpen={true} />
      </WorkspaceProvider>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByRole('combobox', { name: /select a workspace/i }));
    });

    fireEvent.click(screen.getByText('Personal Projects'));

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /select a workspace/i })).toHaveTextContent('Personal Projects');
    });
    expect(localStorage.getItem('lastSelectedWorkspace')).toBe('workspace-1');
  });

  it('navigates to create workspace page', async () => {
    render(
      <WorkspaceProvider>
        <WorkspaceSwitcher isSidebarOpen={true} />
      </WorkspaceProvider>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByRole('combobox', { name: /select a workspace/i }));
    });

    fireEvent.click(screen.getByText('Create New Workspace'));

    expect(mockPush).toHaveBeenCalledWith('/dashboard/workspaces/create');
  });

  it('handles API error when fetching workspaces', async () => {
    apiClientMock.get.mockResolvedValueOnce({ success: false, error: 'Network down' });
    
    render(
        <WorkspaceProvider>
            <WorkspaceSwitcher isSidebarOpen={true} />
        </WorkspaceProvider>
    );

    await waitFor(() => {
        expect(screen.getByRole('combobox', { name: /select a workspace/i })).toHaveTextContent('Select Workspace');
        expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Network down');
    });
  });

  // Test sidebar open/closed states
  it('hides content when sidebar is closed', async () => {
    render(
      <WorkspaceProvider>
        <WorkspaceSwitcher isSidebarOpen={false} />
      </WorkspaceProvider>
    );

    // Initial render in closed state, should not see "Select Workspace" or current workspace name
    await waitFor(() => {
        expect(screen.queryByText('Select Workspace')).not.toBeInTheDocument();
        expect(screen.queryByText('Team Alpha')).not.toBeInTheDocument();
    });
  });
});
