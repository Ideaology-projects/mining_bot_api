import express from 'express';
import { inviteFriend } from '../controllers/invite.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
const router = express.Router();

router.post('/invite',authMiddleware, async (req, res) => {
  await inviteFriend(req, res);
});

export default router;
