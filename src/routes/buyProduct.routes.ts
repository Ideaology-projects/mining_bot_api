import express from 'express';
import { purchaseProduct } from '../controllers/buyProduct.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/purchase', authMiddleware, async (req, res) => {
  console.log('ye route hai ');
  await purchaseProduct(req, res);
});

export default router;
