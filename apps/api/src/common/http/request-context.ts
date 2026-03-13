import { randomUUID } from "node:crypto";

export const REQUEST_ID_HEADER = "x-request-id";

export interface TraceableRequest {
  headers: Record<string, string | string[] | undefined>;
  method?: string;
  url?: string;
  ip?: string;
  traceId?: string;
}

export function resolveTraceId(headers: TraceableRequest["headers"]): string {
  const headerValue = headers[REQUEST_ID_HEADER] ?? headers[REQUEST_ID_HEADER.toUpperCase()];

  if (Array.isArray(headerValue)) {
    const firstValue = headerValue.find((value) => value.trim().length > 0);
    if (firstValue) {
      return firstValue;
    }
  }

  if (typeof headerValue === "string" && headerValue.trim().length > 0) {
    return headerValue;
  }

  return randomUUID();
}

export function getTraceId(request: TraceableRequest): string {
  if (request.traceId && request.traceId.trim().length > 0) {
    return request.traceId;
  }

  const traceId = resolveTraceId(request.headers);
  request.traceId = traceId;
  return traceId;
}
