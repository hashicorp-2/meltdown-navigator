import { Router } from 'express';
import { profileController } from '../../controllers/profileController.js';
const router = Router();
/**
 * Profile routes:
 * - POST /api/profiles - Create a new profile
 * - GET /api/profiles/:userId - Get profile by user ID
 * - GET /api/profiles/id/:profileId - Get profile by profile ID
 * - PUT /api/profiles/:userId - Update profile by user ID
 * - DELETE /api/profiles/:userId - Delete profile by user ID
 * - GET /api/profiles/:userId/exists - Check if profile exists
 */
router.post('/', profileController.create);
router.get('/:userId', profileController.getByUserId);
router.get('/id/:profileId', profileController.getById);
router.put('/:userId', profileController.update);
router.delete('/:userId', profileController.delete);
router.get('/:userId/exists', profileController.exists);
export default router;
//# sourceMappingURL=profiles.js.map