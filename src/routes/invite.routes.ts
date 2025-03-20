import express from 'express';
import { inviteFriend } from '../controllers/invite.controller';

const router = express.Router();

router.post('/invite', async (req, res) => {
  await inviteFriend(req, res);
});

export default router;
