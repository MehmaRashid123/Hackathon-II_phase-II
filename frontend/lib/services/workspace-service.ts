/**
 * Workspace Service
 *
 * API client for workspace management endpoints.
 */

import { apiClient } from "../api/client";

export interface Workspace {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  members?: WorkspaceMember[];
}

export interface WorkspaceMember {
  workspace_id: string;
  user_id: string;
  role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
  joined_at: string;
}

export interface WorkspaceCreateRequest {
  name: string;
}

export interface WorkspaceUpdateRequest {
  name?: string;
}

export interface WorkspaceMemberInviteRequest {
  user_id: string;
  role?: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
}

export interface WorkspaceMemberUpdateRequest {
  role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
}

export class WorkspaceService {
  /**
   * Get all workspaces the current user has access to.
   */
  static async getUserWorkspaces(): Promise<Workspace[]> {
    return apiClient.get<Workspace[]>("/workspaces");
  }

  /**
   * Create a new workspace.
   */
  static async createWorkspace(data: WorkspaceCreateRequest): Promise<Workspace> {
    return apiClient.post<Workspace>("/workspaces", data);
  }

  /**
   * Get workspace details by ID.
   */
  static async getWorkspace(workspaceId: string): Promise<Workspace> {
    return apiClient.get<Workspace>(`/workspaces/${workspaceId}`);
  }

  /**
   * Update workspace details.
   */
  static async updateWorkspace(
    workspaceId: string,
    data: WorkspaceUpdateRequest
  ): Promise<Workspace> {
    return apiClient.put<Workspace>(`/workspaces/${workspaceId}`, data);
  }

  /**
   * Delete a workspace (OWNER only).
   */
  static async deleteWorkspace(workspaceId: string): Promise<void> {
    return apiClient.delete<void>(`/workspaces/${workspaceId}`);
  }

  /**
   * Get all members of a workspace.
   */
  static async getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
    return apiClient.get<WorkspaceMember[]>(
      `/workspaces/${workspaceId}/members`
    );
  }

  /**
   * Invite a user to a workspace.
   */
  static async inviteMember(
    workspaceId: string,
    data: WorkspaceMemberInviteRequest
  ): Promise<WorkspaceMember> {
    return apiClient.post<WorkspaceMember>(
      `/workspaces/${workspaceId}/members`,
      data
    );
  }

  /**
   * Update a member's role in a workspace.
   */
  static async updateMemberRole(
    workspaceId: string,
    userId: string,
    data: WorkspaceMemberUpdateRequest
  ): Promise<WorkspaceMember> {
    return apiClient.patch<WorkspaceMember>(
      `/workspaces/${workspaceId}/members/${userId}`,
      data
    );
  }

  /**
   * Remove a member from a workspace.
   */
  static async removeMember(workspaceId: string, userId: string): Promise<void> {
    return apiClient.delete<void>(
      `/workspaces/${workspaceId}/members/${userId}`
    );
  }
}
