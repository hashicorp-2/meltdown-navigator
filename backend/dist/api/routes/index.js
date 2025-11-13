import { Router } from 'express';
import translatorRouter from './translator.js';
import profilesRouter from './profiles.js';
const router = Router();
router.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});
router.use('/translator', translatorRouter);
router.use('/profiles', profilesRouter);
export default router;
//# sourceMappingURL=index.js.map