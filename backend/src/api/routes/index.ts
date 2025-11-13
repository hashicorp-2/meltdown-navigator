import { Router } from 'express';
import translatorRouter from './translator.js';
import profilesRouter from './profiles.js';
import mediatorRouter from './mediator.js';
import crisisAlertRouter from './crisisAlert.js';

const router = Router();

router.get('/health', async (_req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    services: {
      database: 'unknown',
      ai: 'unknown',
    },
  };

  // Check MongoDB connection
  try {
    const mongoose = await import('mongoose');
    if (mongoose.default.connection.readyState === 1) {
      health.services.database = 'connected';
    } else if (mongoose.default.connection.readyState === 0) {
      health.services.database = 'disconnected';
    } else {
      health.services.database = 'connecting';
    }
  } catch (error) {
    health.services.database = 'error';
  }

  // Check AI service (Anthropic API key)
  if (process.env.ANTHROPIC_API_KEY) {
    health.services.ai = 'configured';
  } else {
    health.services.ai = 'not_configured';
  }

  const statusCode = health.services.database === 'error' ? 503 : 200;
  res.status(statusCode).json(health);
});

router.use('/translator', translatorRouter);
router.use('/profiles', profilesRouter);
router.use('/mediate', mediatorRouter);
router.use('/crisis-alert', crisisAlertRouter);

export default router;
