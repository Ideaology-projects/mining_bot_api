"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const referral_controller_1 = require("../controllers/referral.controller");
const router = (0, express_1.Router)();
const auth_middleware_1 = require("../middlewares/auth.middleware");
router.post('/referral-status', auth_middleware_1.authMiddleware, referral_controller_1.getReferralStatus);
router.post('/claim', auth_middleware_1.authMiddleware, referral_controller_1.claimReferralRewards);
exports.default = router;
