import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaClient } from '@prisma/client';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.enableCors({
    origin: (origin, callback) => {
      // Mirror the incoming origin dynamically to satisfy credentials: true
      if (!origin) {
        callback(null, true);
      } else {
        callback(null, origin);
      }
    },
    credentials: true,
  });

  // Auto-seed removed as it conflicts with updated Prisma schema

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
