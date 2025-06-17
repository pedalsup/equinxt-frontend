/**
 * Common types for API operations
 */

export interface CommonApiParams {
  page: number;
  limit: number;
  search?: string;
}

export interface ApiQueryContext<T = any> {
  queryKey: readonly [string, T];
}

export interface PaginatedApiQueryContext {
  queryKey: readonly [string, CommonApiParams];
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
