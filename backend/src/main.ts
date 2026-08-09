import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  // ── CORS ────────────────────────────────────────────────────────────────
  // Allow requests from the Vercel frontend and local dev.
  // FRONTEND_URL is set as an environment variable in Railway.
  const allowedOrigins = [
    process.env.FRONTEND_URL,          // e.g. https://your-app.vercel.app
    'http://localhost:5173',            // Vite local dev
    'http://localhost:3000',
  ].filter(Boolean) as string[];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow server-to-server calls (no origin) and whitelisted origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin not allowed → ${origin}`));
      }
    },
    credentials: true,
  });

  // ── Global prefix ────────────────────────────────────────────────────────
  // All routes are served under /api so the frontend can call /api/auth/login etc.
  app.setGlobalPrefix('api');

  // ── Start ────────────────────────────────────────────────────────────────
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 VeriSync backend running on port ${port}`);
}
bootstrap();
