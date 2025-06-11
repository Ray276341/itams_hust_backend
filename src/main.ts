import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

import * as crypto from 'crypto';

// Monkey-patch for broken internal schedule UUID usage
if (!crypto.randomUUID) {
  (crypto as any).randomUUID = () => {
    return [...Array(36)]
      .map((_, i) => (i === 14 ? '4' : i === 19 ? '89ab' : '0123456789abcdef')[Math.floor(Math.random() * 16)])
      .join('');
  };
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('IT Asset Management System')
    .setDescription('API for ITAMS')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 8000);
}
bootstrap();
