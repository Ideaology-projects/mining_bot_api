"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllRewards = exports.claimDailyReward = void 0;
const prismaClient_1 = __importDefault(require("../database/prismaClient"));
const claimDailyReward = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { DebugTimeDB, DBlastreward, DBlastrewardkey } = req.body;
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const userId = req.user.id;
        const lastRewardTime = new Date(DBlastreward);
        const existingReward = yield prismaClient_1.default.dailyReward.findFirst({
            where: {
                userId,
                lastRewardTime,
            },
        });
        if (existingReward) {
            res.status(400).json({ error: 'Reward already claimed today' });
            return;
        }
        // Insert new reward entry
        const newReward = yield prismaClient_1.default.dailyReward.create({
            data: {
                userId,
                rewardAmount: DebugTimeDB,
                lastRewardTime,
                rewardKey: DBlastrewardkey,
            },
        });
        res
            .status(200)
            .json({ message: 'Reward claimed successfully', reward: newReward });
        return;
    }
    catch (error) {
        console.error('Error claiming reward:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
});
exports.claimDailyReward = claimDailyReward;
const getAllRewards = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const userId = req.user.id;
        const rewards = yield prismaClient_1.default.dailyReward.findMany({
            where: { userId },
            orderBy: { lastRewardTime: 'desc' },
        });
        res.status(200).json({ rewards });
        return;
    }
    catch (error) {
        console.error('Error fetching rewards:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
});
exports.getAllRewards = getAllRewards;
