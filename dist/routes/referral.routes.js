"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const referral_controller_1 = require("../controllers/referral.controller");
const claimedReferralReward_controller_1 = require("../controllers/claimedReferralReward.controller");
const router = (0, express_1.Router)();
const auth_middleware_1 = require("../middlewares/auth.middleware");
router.get('/referral-status', auth_middleware_1.authMiddleware, referral_controller_1.getReferralStatus);
router.post('/claim', auth_middleware_1.authMiddleware, referral_controller_1.claimReferralRewards);
//Referral Reward Route
router.post('/referral-reward', auth_middleware_1.authMiddleware, claimedReferralReward_controller_1.claimReferralReward);
exports.default = router;
