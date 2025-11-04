// app.js
import express from 'express';
import dotenv from 'dotenv';
import routes from './routes.js';
import errorHandler from './middleware/errorHandler.js';
import { log } from './utils/logger.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  log(`${req.method} ${req.url}`);
  next();
});

app.use('/api', routes);

// healthcheck
app.get('/', (req, res) => res.json({ status: 'ok', env: process.env.NODE_ENV || 'development' }));

// error handler (al final)
app.use(errorHandler);

export default app;
