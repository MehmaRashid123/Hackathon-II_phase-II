/**
 * API contract type definitions.
 *
 * Response types for FastAPI backend.
 */

export interface ApiError {
  detail: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  status: number;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    created_at: string;
  };
}
