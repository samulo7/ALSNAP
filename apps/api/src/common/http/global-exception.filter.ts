import { ArgumentsHost, Catch, HttpException, HttpStatus, Logger, type ExceptionFilter } from "@nestjs/common";
import { buildErrorResponse } from "./api-response";
import { getTraceId, type TraceableRequest } from "./request-context";
import { createLogEntry } from "../logging/log-entry";

interface NormalizedException {
  statusCode: number;
  code: string;
  message: string;
  details?: unknown;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const request = http.getRequest<TraceableRequest>();
    const response = http.getResponse<{ status(code: number): { json(body: unknown): void } }>();
    const traceId = getTraceId(request);
    const normalizedException = normalizeException(exception);

    this.logger.error(
      JSON.stringify(
        createLogEntry({
          level: "error",
          action: "http.request.failed",
          traceId,
          actorId: "anonymous",
          targetType: "http.request",
          targetId: request.url ?? "unknown",
          message: normalizedException.message,
          context: {
            method: request.method ?? "UNKNOWN",
            path: request.url ?? "unknown",
            statusCode: normalizedException.statusCode,
            errorCode: normalizedException.code,
            details: normalizedException.details
          }
        })
      )
    );

    response
      .status(normalizedException.statusCode)
      .json(
        buildErrorResponse(
          {
            code: normalizedException.code,
            message: normalizedException.message,
            details: normalizedException.details
          },
          traceId
        )
      );
  }
}

function normalizeException(exception: unknown): NormalizedException {
  if (exception instanceof HttpException) {
    const statusCode = exception.getStatus();
    const response = exception.getResponse();

    if (typeof response === "string") {
      return {
        statusCode,
        code: statusCodeToErrorCode(statusCode),
        message: response
      };
    }

    if (isRecord(response)) {
      const message = Array.isArray(response.message)
        ? response.message.join("; ")
        : typeof response.message === "string"
          ? response.message
          : exception.message;

      const code = typeof response.code === "string"
        ? response.code
        : typeof response.errorCode === "string"
          ? response.errorCode
          : statusCodeToErrorCode(statusCode);

      return {
        statusCode,
        code,
        message,
        details: response.details
      };
    }

    return {
      statusCode,
      code: statusCodeToErrorCode(statusCode),
      message: exception.message
    };
  }

  if (exception instanceof Error) {
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      code: "INTERNAL_SERVER_ERROR",
      message: exception.message
    };
  }

  return {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    code: "INTERNAL_SERVER_ERROR",
    message: "Unexpected error"
  };
}

function statusCodeToErrorCode(statusCode: number): string {
  switch (statusCode) {
    case HttpStatus.BAD_REQUEST:
      return "BAD_REQUEST";
    case HttpStatus.UNAUTHORIZED:
      return "UNAUTHORIZED";
    case HttpStatus.FORBIDDEN:
      return "FORBIDDEN";
    case HttpStatus.NOT_FOUND:
      return "NOT_FOUND";
    case HttpStatus.CONFLICT:
      return "CONFLICT";
    default:
      return statusCode >= 500 ? "INTERNAL_SERVER_ERROR" : `HTTP_${statusCode}`;
  }
}

function isRecord(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null;
}
