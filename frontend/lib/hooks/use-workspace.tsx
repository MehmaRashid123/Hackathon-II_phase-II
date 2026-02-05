/**
 * useWorkspace Hook
 *
 * Manages workspace context and operations.
 */

"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Workspace, WorkspaceService } from "../services/workspace-service";

interface WorkspaceContextType {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  loading: boolean;
  error: string | null;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  refreshWorkspaces: () => Promise<void>;
  createWorkspace: (name: string) => Promise<Workspace>;
  deleteWorkspace: (workspaceId: string) => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load workspaces on mount
  useEffect(() => {
    loadWorkspaces();
  }, []);

  // Restore current workspace from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedWorkspaceId = localStorage.getItem("current_workspace_id");
    if (savedWorkspaceId && workspaces.length > 0) {
      const workspace = workspaces.find((w) => w.id === savedWorkspaceId);
      if (workspace) {
        setCurrentWorkspace(workspace);
      } else {
        // Saved workspace not found, default to first workspace
        setCurrentWorkspace(workspaces[0]);
      }
    } else if (workspaces.length > 0) {
      // No saved workspace, default to first
      setCurrentWorkspace(workspaces[0]);
    }
  }, [workspaces]);

  // Save current workspace to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (currentWorkspace) {
      localStorage.setItem("current_workspace_id", currentWorkspace.id);
    }
  }, [currentWorkspace]);

  async function loadWorkspaces() {
    try {
      setLoading(true);
      setError(null);
      const data = await WorkspaceService.getUserWorkspaces();
      setWorkspaces(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load workspaces");
    } finally {
      setLoading(false);
    }
  }

  async function refreshWorkspaces() {
    await loadWorkspaces();
  }

  async function createWorkspace(name: string): Promise<Workspace> {
    const workspace = await WorkspaceService.createWorkspace({ name });
    setWorkspaces((prev) => [...prev, workspace]);
    setCurrentWorkspace(workspace);
    return workspace;
  }

  async function deleteWorkspace(workspaceId: string) {
    await WorkspaceService.deleteWorkspace(workspaceId);
    setWorkspaces((prev) => prev.filter((w) => w.id !== workspaceId));
    if (currentWorkspace?.id === workspaceId) {
      setCurrentWorkspace(workspaces[0] || null);
    }
  }

  const contextValue: WorkspaceContextType = {
    workspaces,
    currentWorkspace,
    loading,
    error,
    setCurrentWorkspace,
    refreshWorkspaces,
    createWorkspace,
    deleteWorkspace,
  };

  return (
    <WorkspaceContext.Provider value={contextValue}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
