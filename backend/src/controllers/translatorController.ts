import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import {
  translatorRequestSchema,
  TranslatorRequestDTO,
} from '../../../common/types/index.js';
import { translatorService } from '../services/translatorService.js';

/**
 * Handles translator requests by validating payloads and delegating to the
 * translator service.
 */
export const translatorController = {
  async translate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const payload: TranslatorRequestDTO = translatorRequestSchema.parse(req.body);

      console.info('[TranslatorController] translate invoked', {
        stressLevel: payload.stressLevel,
        hasProfileId: Boolean(payload.profileId),
      });

      const plan = await translatorService.translate(payload);

      res.status(200).json(plan);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: 'Invalid translator request.',
          issues: error.flatten(),
        });
        return;
      }

      next(error);
    }
  },
};







