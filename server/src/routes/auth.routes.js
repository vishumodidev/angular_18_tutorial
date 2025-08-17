import { Router } from 'express';
import { login, createUser, me } from '../controllers/auth.controller.js';
import { authRequired, requireRoles, Roles } from '../middleware/auth.js';

const router = Router();

router.post('/login', login);
router.get('/me', authRequired, me);
router.post('/users', authRequired, requireRoles(Roles.Admin), createUser);

export default router;