"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const router = (0, express_1.Router)();
const auth_middleware_1 = require("../middlewares/auth.middleware");
router.post('/create-product', auth_middleware_1.authMiddleware, product_controller_1.createProduct);
exports.default = router;
