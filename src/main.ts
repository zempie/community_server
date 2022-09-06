import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as express from "express";
import * as path from "path";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: false,
            transform: true
        })
    );

    const config = new DocumentBuilder()
        .setTitle("GEM DEV")
        .setDescription("gemdev")
        .setVersion("1.3.31")
        .addBearerAuth({
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT"
        })
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document);

    app.use("/upload", express.static(path.join(process.cwd(), "upload")));
    app.enableCors();

    await app.listen(5000);
}
bootstrap();
