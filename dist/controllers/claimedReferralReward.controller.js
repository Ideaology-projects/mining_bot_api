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
exports.claimReferralReward = void 0;
const prismaClient_1 = __importDefault(require("../database/prismaClient"));
const claimReferralReward = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const currentUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { rewardAmount, rewardTier } = req.body;
    if (!currentUserId) {
        res.status(401).json({ message: 'Unauthorized: User ID not found.' });
        return;
    }
    if (!rewardAmount || !rewardTier) {
        res.status(400).json({ message: 'rewardAmount and rewardTier are required.' });
        return;
    }
    try {
        const referralCount = yield prismaClient_1.default.referral.count({
            where: {
                referrerId: currentUserId,
            },
        });
        let eligibleAmount = 0;
        let eligibleTier = 0;
        if (referralCount >= 50) {
            eligibleAmount = 50000;
            eligibleTier = 1;
        }
        else if (referralCount >= 25) {
            eligibleAmount = 25000;
            eligibleTier = 2;
        }
        else if (referralCount >= 10) {
            eligibleAmount = 10000;
            eligibleTier = 3;
        }
        else {
            res.status(400).json({ message: 'Not enough referrals to claim a reward.' });
            return;
        }
        if (rewardAmount !== eligibleAmount || rewardTier !== eligibleTier) {
            res.status(400).json({
                message: 'Invalid reward tier or amount based on referral count.',
            });
            return;
        }
        const existingClaim = yield prismaClient_1.default.referralRewardClaim.findFirst({
            where: {
                userId: currentUserId,
                rewardTier,
            },
        });
        if (existingClaim) {
            res.status(400).json({ message: 'Reward already claimed for this tier.' });
            return;
        }
        yield prismaClient_1.default.referralRewardClaim.create({
            data: {
                userId: currentUserId,
                rewardAmount,
                rewardTier,
                claimedAt: new Date(),
            },
        });
        res.json({
            message: `Successfully claimed a reward of ${rewardAmount} for tier ${rewardTier}.`,
        });
    }
    catch (error) {
        console.error('Reward Claim Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.claimReferralReward = claimReferralReward;
