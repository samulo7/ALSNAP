import type { NestMiddleware } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { resolveTraceId, type TraceableRequest } from "./request-context";

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(request: TraceableRequest, _response: unknown, next: () => void) {
    request.traceId = resolveTraceId(request.headers);
    next();
  }
}
