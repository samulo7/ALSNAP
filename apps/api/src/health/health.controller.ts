import { Controller, Get, Req } from "@nestjs/common";
import { buildSuccessResponse } from "../common/http/api-response";
import { getTraceId, type TraceableRequest } from "../common/http/request-context";

@Controller("health")
export class HealthController {
  @Get()
  getHealth(@Req() request: TraceableRequest) {
    return buildSuccessResponse(
      {
        service: "alisnap-api",
        status: "ok"
      },
      getTraceId(request)
    );
  }
}
