"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reward_controller_1 = require("../controllers/reward.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.post('/daily-reward', auth_middleware_1.authMiddleware, reward_controller_1.claimDailyReward);
router.get('/all-reward', auth_middleware_1.authMiddleware, reward_controller_1.getAllRewards);
exports.default = router;
