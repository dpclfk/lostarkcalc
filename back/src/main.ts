import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as FileStore from 'session-file-store';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const FileStoreSession = FileStore(session);
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
  app.use(cookieParser());

  app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: false,
      name: 'admin',
      store: new FileStoreSession({
        reapInterval: 60,
        path: './session',
        retries: 0,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60,
        path: '/',
      },
    }),
  );
  app.setGlobalPrefix('api');
  await app.listen(3080);
}
bootstrap();
