import express from 'express';
import { TopMinors } from '../controllers/topMinors.controller';

const router = express.Router();

router.get('/top-minors', async (req, res) => {
  await TopMinors(req, res);
});

export default router;
