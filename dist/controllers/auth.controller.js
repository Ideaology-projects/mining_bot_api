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
exports.loginUser = exports.protectedRoute = exports.authenticateUser = void 0;
const prismaClient_1 = __importDefault(require("../database/prismaClient"));
const jwt_1 = require("../utils/jwt");
const bcrypt_1 = __importDefault(require("bcrypt"));
const invitationEmail_1 = require("../utils/invitationEmail");
const authenticateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { walletAddress, email, username, password, referralCode } = req.body;
        if (!walletAddress && (!email || !username || !password)) {
            return res
                .status(400)
                .json({ message: 'Wallet address or email/password is required!' });
        }
        let user = null;
        let referrer = null;
        if (referralCode) {
            referrer = yield prismaClient_1.default.user.findUnique({ where: { referralCode } });
        }
        if (walletAddress) {
            user = yield prismaClient_1.default.user.findUnique({ where: { walletAddress } });
            if (!user) {
                user = yield prismaClient_1.default.user.create({
                    data: {
                        walletAddress,
                        referredBy: referrer ? referrer.referralCode : null,
                        emailToken: ""
                    },
                });
            }
        }
        if (!user && email) {
            const existingUser = yield prismaClient_1.default.user.findUnique({ where: { email } });
            if (existingUser) {
                return res
                    .status(409)
                    .json({ message: 'User with this email already exists.' });
            }
            const emailToken = (0, jwt_1.generateToken)(email, Date.now());
            const hashedPassword = yield hashPassword(password);
            user = yield prismaClient_1.default.user.create({
                data: {
                    username,
                    email,
                    password: hashedPassword,
                    walletAddress,
                    referredBy: referrer ? referrer.referralCode : null,
                    isEmailVerified: false,
                    emailToken,
                },
            });
            const emailVerificationUrl = `http://localhost:3000/api/v1/email/verify-email?token=${emailToken}`;
            yield (0, invitationEmail_1.sendEmail)({
                to: email,
                subject: 'Confirm your email',
                html: `<p>Hi ${username},</p>
               <p>Please verify your email by clicking the link below:</p>
              <a href="${emailVerificationUrl}">Verify Email</a>
               <p>This link will expire in 1 hour.</p>`,
            });
            if (referrer && user) {
                yield prismaClient_1.default.referral.create({
                    data: { referrerId: referrer.id, refereeId: user.id },
                });
                yield prismaClient_1.default.reward.create({
                    data: {
                        userId: referrer.id,
                        points: 100,
                        type: 'referral_bonus',
                        status: 'pending',
                    },
                });
                ;
                yield prismaClient_1.default.reward.create({
                    data: {
                        userId: user.id,
                        points: 50,
                        type: 'signup_bonus',
                        status: 'pending',
                    },
                });
            }
        }
        if (!user) {
            return res.status(500).json({ message: 'User registration failed.' });
        }
        // IF user was signing up with wallet address only, allow immediate login (optional based on your rules)
        const token = (0, jwt_1.generateToken)(user.walletAddress || user.email || '', user.id);
        res.status(200).json({
            "message": "User registered successfully. A verification email has been sent. Please verify your email to log in.",
        });
        // return res
        //   .status(201)
        //   .json({ token, user, message: 'User created successfully!' });
    }
    catch (error) {
        console.error('Registration Error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.authenticateUser = authenticateUser;
const protectedRoute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ message: 'Protected data accessed!', user: req === null || req === void 0 ? void 0 : req.user });
    return;
});
exports.protectedRoute = protectedRoute;
const saltRounds = 10;
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.hash(password, saltRounds);
});
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: 'Email and password are required!' });
        }
        const user = yield prismaClient_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password!' });
        }
        // Check if the user has verified their email
        if (!user.isEmailVerified) {
            return res.status(403).json({
                message: 'Your email is not verified. Please verify your email to log in.',
            });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password || '');
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password!' });
        }
        const token = (0, jwt_1.generateToken)(user.email || '', user.id);
        return res.status(200).json({ token, user, message: 'Login successful!' });
    }
    catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.loginUser = loginUser;
