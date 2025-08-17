import { Router } from 'express';
import { authRequired, requireRoles, Roles } from '../middleware/auth.js';

const router = Router();

router.get('/stats', authRequired, requireRoles(Roles.Admin), async (req, res) => {
	res.json({ uptime: process.uptime(), timestamp: Date.now() });
});

export default router;