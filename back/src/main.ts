import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as FileStore from 'session-file-store';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

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

  const options = new DocumentBuilder()
    .setTitle('lostark calc API')
    .setDescription('로스트아크 계산기 API 명세서입니다.')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('apidocs', app, document);
  await app.listen(3080);
}
bootstrap();
