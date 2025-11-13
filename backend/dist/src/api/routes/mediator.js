import { Router } from 'express';
import { mediatorController } from '../../controllers/mediatorController.js';
const router = Router();
/**
 * Mediator routes:
 * - POST /api/mediate - Mediate a communication message
 */
router.post('/', mediatorController.mediate);
export default router;
//# sourceMappingURL=mediator.js.map