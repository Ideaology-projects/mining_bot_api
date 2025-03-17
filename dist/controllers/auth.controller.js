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
exports.protectedRoute = exports.authenticateUser = void 0;
const prismaClient_1 = __importDefault(require("../database/prismaClient"));
const jwt_1 = require("../utils/jwt");
const authenticateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { walletAddress, referralCode } = req.body;
    if (!walletAddress) {
        res.status(400).json({ error: 'Wallet address is required' });
        return;
    }
    try {
        let user = yield prismaClient_1.default.user.findUnique({
            where: { walletAddress },
        });
        // If user doesn't exist, create one (and process referral if referralCode is provided)
        if (!user) {
            // If referralCode provided, try to find the referring user
            let referrer = null;
            if (referralCode) {
                referrer = yield prismaClient_1.default.user.findUnique({
                    where: { referralCode },
                });
            }
            user = yield prismaClient_1.default.user.create({
                data: {
                    walletAddress,
                    // Save referredBy only if a valid referrer exists
                    referredBy: referrer ? referrer.referralCode : null,
                },
            });
            // If a valid referrer is found, create the referral record and associated rewards
            if (referrer) {
                yield prismaClient_1.default.referral.create({
                    data: {
                        referrerId: referrer.id,
                        refereeId: user.id,
                    },
                });
                // Create reward for the referrer (e.g., 100 points)
                yield prismaClient_1.default.reward.create({
                    data: {
                        userId: referrer.id,
                        points: 100, // Adjust points as needed
                        type: 'referral_bonus',
                        status: 'pending', // Mark as pending; change later as per your business logic
                    },
                });
                // Create reward for the new user (e.g., 50 points)
                yield prismaClient_1.default.reward.create({
                    data: {
                        userId: user.id,
                        points: 50, // Adjust points as needed
                        type: 'signup_bonus',
                        status: 'pending',
                    },
                });
            }
        }
        // Generate JWT token (assume generateToken is defined elsewhere)
        const token = (0, jwt_1.generateToken)(walletAddress, user.id);
        res.json({ token, user });
    }
    catch (error) {
        console.error('Auth Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.authenticateUser = authenticateUser;
const protectedRoute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ message: 'Protected data accessed!', user: req === null || req === void 0 ? void 0 : req.user });
    return;
});
exports.protectedRoute = protectedRoute;
