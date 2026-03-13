import "reflect-metadata";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { GlobalExceptionFilter } from "./common/http/global-exception.filter";
import { createLogEntry } from "./common/logging/log-entry";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true
  });
  const port = Number.parseInt(process.env.PORT ?? "4000", 10);
  const logger = new Logger("Bootstrap");

  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(port, "127.0.0.1");

  logger.log(
    JSON.stringify(
      createLogEntry({
        level: "info",
        action: "app.bootstrap",
        traceId: "system",
        actorId: "system",
        targetType: "application",
        targetId: "alisnap-api",
        message: `API server listening on 127.0.0.1:${port}`
      })
    )
  );
}

void bootstrap();
