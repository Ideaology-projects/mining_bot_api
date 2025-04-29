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
exports.resendVerificationEmail = exports.verifyEmail = void 0;
const prismaClient_1 = __importDefault(require("../database/prismaClient"));
const jwt_1 = require("../utils/jwt");
const jwt_2 = require("../utils/jwt");
const invitationEmail_1 = require("../utils/invitationEmail");
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.query;
        if (!token || typeof token !== 'string') {
            return res.status(400).json({ message: 'Verification token is required.' });
        }
        const decoded = (0, jwt_1.verifyToken)(token);
        if (!decoded || !decoded.walletAddress) {
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }
        const user = yield prismaClient_1.default.user.findUnique({
            where: { email: decoded.walletAddress },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        if (user.isEmailVerified) {
            return res.status(400).json({ message: 'Email is already verified.' });
        }
        if (user.emailToken) {
            yield prismaClient_1.default.user.update({
                where: { email: decoded.walletAddress },
                data: {
                    emailToken: "",
                },
            });
        }
        yield prismaClient_1.default.user.update({
            where: { email: decoded.walletAddress },
            data: {
                emailToken: "",
                isEmailVerified: true,
                emailVerifiedAt: new Date(),
            },
        });
        return res.status(200).json({ message: 'Email successfully verified.' });
    }
    catch (error) {
        console.error('Error verifying email:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.verifyEmail = verifyEmail;
const resendVerificationEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        const user = yield prismaClient_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.isEmailVerified) {
            return res.status(400).json({ message: 'Your email is already verified' });
        }
        const resendLimit = 1 * 60 * 1000;
        const emailSentTime = new Date(user.emailSentAt).getTime();
        const currentTime = Date.now();
        const diffInMillis = currentTime - emailSentTime;
        if (diffInMillis < resendLimit) {
            return res.status(400).json({ message: 'Please wait a minute before requesting a new email.' });
        }
        const emailToken = (0, jwt_2.generateToken)(email, Date.now());
        yield prismaClient_1.default.user.update({
            where: { email },
            data: {
                emailToken,
                emailSentAt: new Date(),
            },
        });
        const emailVerificationUrl = `http://localhost:3000/api/v1/email/verify-email?token=${emailToken}`;
        yield (0, invitationEmail_1.sendEmail)({
            to: email,
            subject: 'Confirm your email',
            html: `<p>Hi ${user.username},</p>
             <p>Please verify your email by clicking the link below:</p>
            <a href="${emailVerificationUrl}">Verify Email</a>
             <p>This link will expire in 1 hour.</p>`,
        });
        return res.status(200).json({ message: 'Verification email has been resent. Please check your inbox.' });
    }
    catch (error) {
        console.error('Resend Email Verification Error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.resendVerificationEmail = resendVerificationEmail;
