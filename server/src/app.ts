import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { globalLimiter } from './middleware/rateLimiter';
import { notFound } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';
import routes from './routes';

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: false, // localStorage-based JWT, no cookies
  })
);
app.use(express.json({ limit: '10kb' })); // 10kb is plenty for feedback payloads; caps DoS-by-huge-body
app.use(globalLimiter);

app.get('/', (_req, res) => {
  res.json({ message: 'Acowale CRM API', status: 'running' });
});

app.use('/api', routes);

// 404 + error handler must come last
app.use(notFound);
app.use(errorHandler);

export default app;
