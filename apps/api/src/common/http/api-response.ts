export interface ApiSuccessResponse<T> {
  success: true;
  timestamp: string;
  traceId: string;
  data: T;
}

export interface ApiErrorBody {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiErrorResponse {
  success: false;
  timestamp: string;
  traceId: string;
  error: ApiErrorBody;
}

export function buildSuccessResponse<T>(data: T, traceId: string): ApiSuccessResponse<T> {
  return {
    success: true,
    timestamp: new Date().toISOString(),
    traceId,
    data
  };
}

export function buildErrorResponse(error: ApiErrorBody, traceId: string): ApiErrorResponse {
  return {
    success: false,
    timestamp: new Date().toISOString(),
    traceId,
    error
  };
}
