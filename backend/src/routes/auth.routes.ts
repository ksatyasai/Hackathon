import { Router } from 'express';
import { login, logout, me } from '../controllers/auth.controller.js';
import { authGuard } from '../middleware/authGuard.js';

const router = Router();

router.get('/me', authGuard(false), me);
router.post('/login', login);
router.post('/logout', logout);

export default router;
