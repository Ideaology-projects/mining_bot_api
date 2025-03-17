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
exports.claimReferralRewards = exports.getReferralStatus = void 0;
const prismaClient_1 = __importDefault(require("../database/prismaClient"));
const getReferralStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const currentUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const referrals = yield prismaClient_1.default.referral.findMany({
            where: { referrerId: Number(currentUserId) },
            include: { referee: true },
        });
        res.json({ referrals });
        return;
    }
    catch (error) {
        console.error('Referral Fetch Error:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
});
exports.getReferralStatus = getReferralStatus;
const claimReferralRewards = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const currentUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const pendingRewards = yield prismaClient_1.default.reward.findMany({
            where: {
                userId: Number(currentUserId),
                status: 'pending',
            },
        });
        if (pendingRewards.length === 0) {
            res.status(400).json({ error: 'No pending rewards to claim.' });
            return;
        }
        // Mark all pending rewards as credited
        yield prismaClient_1.default.reward.updateMany({
            where: {
                userId: Number(currentUserId),
                status: 'pending',
            },
            data: { status: 'credited' },
        });
        res.json({ message: 'Rewards claimed successfully.' });
        return;
    }
    catch (error) {
        console.error('Reward Claim Error:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
});
exports.claimReferralRewards = claimReferralRewards;
