import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';

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

  // app.use is a method in Express.js to register middleware functions that handle requests.
  // Here, it mounts the middleware to handle requests starting with '/uploads' URL path.
  // prototype: app.use(path, middleware)

  // express.static is a built-in middleware function in Express.js
  // that serves static files (like images, CSS, JS) from a specified directory on the server.

  // __dirname is a Node.js global variable representing
  // the absolute path of the directory containing the currently executing file.

  // '..' in join(__dirname, '..', 'uploads') means "go up one directory level"
  // from the current directory (__dirname) to reach the parent directory.

  // 'uploads' is the folder name inside the parent directory
  // where uploaded files (e.g., images) are stored and served statically.

  // The combined join(...) resolves to the full path of the 'uploads' folder on the server filesystem,
  // allowing express.static to serve files from there when requested via '/uploads' route.
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
