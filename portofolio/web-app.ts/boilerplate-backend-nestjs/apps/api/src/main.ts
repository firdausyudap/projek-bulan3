import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import compression from "compression";
import { Request, Response } from "express";
import helmet from "helmet";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security & Optimization
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          "script-src": ["'self'", "'unsafe-inline'", "https://unpkg.com"],
          "style-src": [
            "'self'",
            "'unsafe-inline'",
            "https://fonts.googleapis.com",
          ],
          "font-src": ["'self'", "https://fonts.gstatic.com"],
          "img-src": ["'self'", "data:", "https://unpkg.com"],
        },
      },
    }),
  );
  app.use(compression());

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle("Boilerplate API")
    .setDescription("API Documentation for Boilerplate Backend")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "Authorization",
        description: "Enter JWT token",
        in: "header",
      },
      "JWT-auth",
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Serve OpenAPI JSON
  app.getHttpAdapter().get("/api-json", (_req: Request, res: Response) => {
    res.json(document);
  });

  // Serve RapiDoc UI
  app.getHttpAdapter().get("/api", (_req: Request, res: Response) => {
    res.type("html");
    res.send(`
      <!doctype html>
      <html>
        <head>
          <title>Boilerplate API Documentation</title>
          <meta charset="utf-8">
          <script type="module" src="https://unpkg.com/rapidoc/dist/rapidoc-min.js"></script>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
          <style>
            body { margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
          </style>
        </head>
        <body>
          <rapi-doc 
            spec-url="/api-json"
            theme="dark"
            render-style="read"
            show-header="false"
            show-info="true"
            allow-authentication="true"
            allow-server-selection="false"
            allow-api-list-style-selection="false"
            bg-color="#1a1a1a"
            text-color="#ffffff"
            primary-color="#3b82f6"
            nav-bg-color="#111111"
            nav-text-color="#ffffff"
            nav-hover-bg-color="#333333"
            nav-hover-text-color="#3b82f6"
            nav-accent-color="#3b82f6"
          >
          </rapi-doc>
        </body>
      </html>
    `);
  });

  const port = process.env.PORT || 5000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);
}
bootstrap();
