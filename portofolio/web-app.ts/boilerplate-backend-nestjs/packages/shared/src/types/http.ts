/**
 * API Response status
 */
export type ApiStatus = "success" | "error";

/**
 * Validation or error detail
 */
export interface ValidationError {
  field?: string;
  code?: string;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

/**
 * Paginated result wrapper
 */
export interface PaginatedResult<T> {
  items: T[];
  pagination: PaginationMeta;
  summary?: {
    subtotal?: any;
    total?: any;
  } | null;
}

/**
 * Paginated shape for response interceptor
 */
export interface PaginatedShape<T = unknown> {
  items: T[];
  pagination: PaginationMeta;
  summary?: {
    subtotal?: any;
    total?: any;
  } | null;
}

/**
 * Standard API Response structure
 */
export interface ApiResponse<T = unknown> {
  status: ApiStatus;
  code: number;
  message: string;
  data: T | null;
  pagination?: PaginationMeta | null;
  summary?: {
    subtotal?: any;
    total?: any;
  } | null;
  errors: ValidationError[];
}
