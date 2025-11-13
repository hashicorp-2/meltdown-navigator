import { Router } from 'express';
import { crisisAlertController } from '../../controllers/crisisAlertController.js';
const router = Router();
/**
 * Crisis Alert routes:
 * - POST /api/crisis-alert - Send a crisis alert via SMS
 */
router.post('/', crisisAlertController.sendAlert);
export default router;
//# sourceMappingURL=crisisAlert.js.map