import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true
  });
  const port = Number.parseInt(process.env.PORT ?? "4000", 10);

  await app.listen(port, "127.0.0.1");
}

void bootstrap();

