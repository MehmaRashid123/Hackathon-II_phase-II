// frontend/lib/types/workspace.ts
export type WorkspaceRole = "owner" | "admin" | "member" | "viewer";

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: WorkspaceRole;
  joined_at: string; // ISO date string
  user_email?: string; // Optional, for display
}

export interface Workspace {
  id: string;
  name: string;
  description: string | null;
  created_by: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  members?: WorkspaceMember[]; // Optional, might not always be fetched
}
