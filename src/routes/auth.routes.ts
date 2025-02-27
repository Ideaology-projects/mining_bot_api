import { Router } from 'express';
import {
  authenticateUser,
  protectedRoute,
} from '../controllers/auth.controller';
const router = Router();
import { authMiddleware } from '../middlewares/auth.middleware';

router.post('/create', authenticateUser);
router.get('/protected', authMiddleware, protectedRoute);
export default router;
