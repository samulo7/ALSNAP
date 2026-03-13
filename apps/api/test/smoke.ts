import assert from "node:assert/strict";
import { buildErrorResponse, buildSuccessResponse } from "../src/common/http/api-response";
import { HealthController } from "../src/health/health.controller";

const successResponse = buildSuccessResponse({ ok: true }, "trace-1");
assert.equal(successResponse.success, true);
assert.equal(successResponse.traceId, "trace-1");
assert.deepEqual(successResponse.data, { ok: true });
assert.match(successResponse.timestamp, /^\d{4}-\d{2}-\d{2}T/);

const errorResponse = buildErrorResponse(
  {
    code: "BAD_REQUEST",
    message: "Request is invalid"
  },
  "trace-2"
);
assert.equal(errorResponse.success, false);
assert.equal(errorResponse.traceId, "trace-2");
assert.equal(errorResponse.error.code, "BAD_REQUEST");
assert.equal(errorResponse.error.message, "Request is invalid");
assert.match(errorResponse.timestamp, /^\d{4}-\d{2}-\d{2}T/);

const controller = new HealthController();
const healthResponse = controller.getHealth({
  headers: {},
  traceId: "trace-health"
});
assert.equal(healthResponse.success, true);
assert.equal(healthResponse.traceId, "trace-health");
assert.deepEqual(healthResponse.data, {
  service: "alisnap-api",
  status: "ok"
});

console.log("API smoke checks passed.");
