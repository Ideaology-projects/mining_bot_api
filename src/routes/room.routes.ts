import express from 'express';
import {roomEntriesAgaintsUser} from '../controllers/roomDecoration.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/customized', authMiddleware, roomEntriesAgaintsUser);

export default router;
