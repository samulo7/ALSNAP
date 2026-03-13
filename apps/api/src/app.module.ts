import { MiddlewareConsumer, Module, type NestModule } from "@nestjs/common";
import { RequestContextMiddleware } from "./common/http/request-context.middleware";
import { HealthController } from "./health/health.controller";

@Module({
  controllers: [HealthController]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes("*");
  }
}
