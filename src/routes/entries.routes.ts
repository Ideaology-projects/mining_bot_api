import express from 'express';
import { entriesAgaintsUser } from '../controllers/entries.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
const router = express.Router();

router.post('/user-entry',authMiddleware, async (req, res) => {
  await entriesAgaintsUser(req, res);
});

export default router;
