import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import routes from './api/routes/index.js';

/**
 * Creates an Express application configured with shared middleware and
 * health-check routing. Translator routes mount onto this instance.
 */
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);

/**
 * Error handling middleware - must be last
 */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[Server] Unhandled error:', err);

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';

  res.status(500).json({
    message: 'Internal server error',
    ...(isDevelopment && { error: err.message, stack: err.stack }),
  });
});

export default app;
