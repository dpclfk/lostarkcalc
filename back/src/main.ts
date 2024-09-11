import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.use(
    session({
      secret: 'my-secret',
      resave: true,
      name: 'admin',
      saveUninitialized: false,
      cookie: {
        maxAge: 10 * 1000,
      },
    }),
  );

  await app.listen(3000);
}
bootstrap();
