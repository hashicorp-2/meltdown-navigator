import { Router } from 'express';
import { translatorController } from '../../controllers/translatorController.js';

const router = Router();

router.post('/', translatorController.translate);

export default router;







