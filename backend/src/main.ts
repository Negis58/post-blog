import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 5005;
  app.setGlobalPrefix("/api");
  app.use(cookieParser());
  const config = new DocumentBuilder()
    .setTitle("Post blog")
    .setVersion("1.0.0")
    .setDescription("Документация по REST API")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);
  app.enableCors({
    credentials: true,
    origin: process.env.CLIENT_URL
  });
  await app.listen(PORT);
}

bootstrap();
