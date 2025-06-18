import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalPipes() is used to apply pipes globally to the entire application.
  // Pipes can transform input data or validate it before it reaches the route handler.

  // new ValidationPipe() is a built-in class that automatically validates incoming requests
  // based on the decorators in your DTOs (like @IsString, @MinLength, etc.).

  // whitelist is an option that removes any properties from the incoming request object
  // that are *not* defined in the DTO class. This helps prevent unexpected or malicious data.

  // forbidNonWhitelisted is an option that makes the app throw an error if the request contains
  // properties that are not allowed (i.e., not defined in the DTO). Useful for stricter validation.
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  // app.enableCors() is a method provided by NestJS to enable Cross-Origin Resource Sharing (CORS),
  // allowing the backend to accept requests from different origins (e.g., your frontend on another port or domain).
  // By default, it allows all origins, but you can configure it to restrict access to specific domains. like:
  // app.enableCors({
  //   origin: 'http://localhost:5000', // Only allows this origin
  //   credentials: true, // If you use cookies or authentication tokens
  //   methods: ['GET', 'POST'], // You can specify allowed HTTP methods
  // });

  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
