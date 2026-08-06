import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaClient } from '@prisma/client';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
