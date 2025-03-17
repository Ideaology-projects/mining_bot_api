"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
const auth_middleware_1 = require("../middlewares/auth.middleware");
router.post('/create', auth_controller_1.authenticateUser);
router.get('/protected', auth_middleware_1.authMiddleware, auth_controller_1.protectedRoute);
exports.default = router;
