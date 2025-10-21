import { Router } from 'express';
import {
  authenticateUser,
  protectedRoute,
  loginUser,
  syncUserRegister,
} from '../controllers/auth.controller';
const router = Router();
import { authMiddleware } from '../middlewares/auth.middleware';

router.post('/create', async (req, res) => {
  await authenticateUser(req, res);
});

router.get('/protected', authMiddleware, protectedRoute);

router.post('/login', async (req, res) => {
  await loginUser(req, res);
});

router.post('/sync-user',async (req, res) => {
  await syncUserRegister(req,res)
})
export default router;
