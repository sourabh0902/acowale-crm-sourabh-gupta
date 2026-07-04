import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'Acowale CRM API', status: 'running' });
});

export default app;
