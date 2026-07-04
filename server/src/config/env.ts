import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3001),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  CORS_ORIGIN: z.url().default('http://localhost:3000'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  SEED_ADMIN_EMAIL: z.email().default('admin@acowale.com'),
  SEED_ADMIN_PASSWORD: z.string().min(8).default('Acowale@2026'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(`Invalid environment variables: ${parsed.error.message}`);
}

export const env = parsed.data;
