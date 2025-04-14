import express from 'express';
import { TopMinors } from '../controllers/topMinors.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/top-minors', authMiddleware, async (req, res) => {
  await TopMinors(req, res);
});

export default router;
