import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { vi } from 'vitest';

// Mock dnd-kit components that rely on DOM measurements or specific contexts not easily available in JSDOM
vi.mock('@dnd-kit/core', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useSensor: vi.fn(),
    useSensors: vi.fn(() => [{ activate: vi.fn() }]), // Mock useSensors to return a mock sensor
    DndContext: ({ children, ...props }: any) => (
      <div {...props} data-testid="mock-dnd-context">
        {children}
        {props.children[1]} {/* Render DragOverlay if present */}
      </div>
    ),
    DragOverlay: ({ children }: any) => (
      <div data-testid="mock-drag-overlay">{children}</div>
    ),
  };
});

vi.mock('@dnd-kit/sortable', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    SortableContext: ({ children, items }: any) => (
      <div data-testid={`mock-sortable-context-${items.join('-')}`}>
        {children}
      </div>
    ),
    useSortable: vi.fn(() => ({
      attributes: {},
      listeners: {},
      setNodeRef: vi.fn(),
      transform: { x: 0, y: 0, scaleX: 1, scaleY: 1 },
      transition: 'none',
      isDragging: false,
    })),
  };
});

// Mock other components used by KanbanBoard
vi.mock('@/components/kanban/KanbanColumn', () => ({
  KanbanColumn: vi.fn(({ id, title, tasks, onAddTask }) => (
    <div data-testid={`kanban-column-${id}`}>
      <h3>{title} ({tasks.length})</h3>
      {tasks.map((task: any) => (
        <div key={task.id} data-testid={`kanban-card-${task.id}`}>
          {task.title}
        </div>
      ))}
      {onAddTask && <button onClick={() => onAddTask(id)}>Add Task</button>}
    </div>
  )),
}));

vi.mock('@/components/kanban/KanbanCard', () => ({
  KanbanCard: vi.fn(({ task, isOverlay }) => (
    <div data-testid={`kanban-card-${task.id}`} className={isOverlay ? 'overlay' : ''}>
      {task.title} {isOverlay && '(Overlay)'}
    </div>
  )),
}));

vi.mock('@/lib/api-client', () => ({
  APIClient: vi.fn(() => ({
    get: vi.fn(),
    patch: vi.fn(),
  })),
}));

vi.mock('@/lib/hooks/use-workspace', () => ({
  useWorkspace: vi.fn(() => ({
    currentWorkspace: { id: 'workspace-1', name: 'Test Workspace' },
    isLoading: false,
    error: null,
  })),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    info: vi.fn(),
    success: vi.fn(),
  },
}));

import { KanbanBoard } from './KanbanBoard';
import { TaskRead } from '@/lib/types/task';
import { APIClient } from '@/lib/api-client';

const mockTasks: TaskRead[] = [
  {
    id: 'task-1',
    title: 'Task Todo 1',
    description: null,
    priority: 'medium',
    status: 'todo',
    workspace_id: 'workspace-1',
    project_id: null,
    created_by: 'user-1',
    assigned_to: null,
    created_at: '2023-01-01T10:00:00Z',
    updated_at: '2023-01-01T10:00:00Z',
    completed_at: null,
  },
  {
    id: 'task-2',
    title: 'Task In Progress 1',
    description: null,
    priority: 'high',
    status: 'in_progress',
    workspace_id: 'workspace-1',
    project_id: null,
    created_by: 'user-1',
    assigned_to: null,
    created_at: '2023-01-01T11:00:00Z',
    updated_at: '2023-01-01T11:00:00Z',
    completed_at: null,
  },
];

describe('KanbanBoard', () => {
  let apiClientMock: { get: vi.Mock; patch: vi.Mock; };
  let useSensorMock: vi.Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    apiClientMock = new APIClient() as any;
    apiClientMock.get.mockResolvedValue({ success: true, data: mockTasks });
    apiClientMock.patch.mockResolvedValue({ success: true, data: {} });

    useSensorMock = useSensor as vi.Mock;
    // Mock the sensor to avoid actual DOM interactions in tests
    useSensorMock.mockReturnValue({ activate: vi.fn() });
  });

  it('renders loading state initially', () => {
    apiClientMock.get.mockReturnValueOnce(new Promise(() => {})); // Never resolve to keep it loading
    render(<KanbanBoard workspaceId="workspace-1" />);
    expect(screen.getByText('Loading Kanban board...')).toBeInTheDocument();
  });

  it('fetches and displays tasks in correct columns', async () => {
    render(<KanbanBoard workspaceId="workspace-1" />);

    await waitFor(() => {
      expect(apiClientMock.get).toHaveBeenCalledWith('/workspaces/workspace-1/tasks');
      expect(screen.getByTestId('kanban-column-todo')).toHaveTextContent('Task Todo 1');
      expect(screen.getByTestId('kanban-column-in_progress')).toHaveTextContent('Task In Progress 1');
    });
  });

  it('calls onAddTask when add task button is clicked', async () => {
    const onAddTaskMock = vi.fn();
    (KanbanColumn as vi.Mock).mockImplementationOnce(({ id, title, tasks, onAddTask }) => (
      <div data-testid={`kanban-column-${id}`}>
        <h3>{title} ({tasks.length})</h3>
        {tasks.map((task: any) => (
          <div key={task.id} data-testid={`kanban-card-${task.id}`}>
            {task.title}
          </div>
        ))}
        {onAddTask && <button onClick={() => onAddTask(id)} data-testid={`add-task-button-${id}`}>Add Task</button>}
      </div>
    ));

    render(<KanbanBoard workspaceId="workspace-1" />);

    await waitFor(() => {
      expect(screen.getByTestId('kanban-column-todo')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('add-task-button-todo'));
    expect(vi.mocked(toast.info)).toHaveBeenCalledWith('Add new task to todo column (functionality to be implemented).');
  });
});
