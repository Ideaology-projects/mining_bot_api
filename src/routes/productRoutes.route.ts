import { Router } from 'express';
import {
    createProduct,
} from '../controllers/product.controller';
const router = Router();
import { authMiddleware } from '../middlewares/auth.middleware';

router.post('/create-product', authMiddleware, createProduct);

export default router;
