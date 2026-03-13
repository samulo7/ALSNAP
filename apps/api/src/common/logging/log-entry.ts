export interface LogEntry {
  timestamp: string;
  level: "info" | "warn" | "error";
  service: string;
  action: string;
  traceId: string;
  actorId: string;
  targetType: string;
  targetId: string;
  message: string;
  context?: Record<string, unknown>;
}

export function createLogEntry(entry: Omit<LogEntry, "timestamp" | "service"> & { service?: string }): LogEntry {
  return {
    timestamp: new Date().toISOString(),
    service: entry.service ?? "alisnap-api",
    ...entry
  };
}
