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
exports.resetPassword = exports.forgotPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prismaClient_1 = __importDefault(require("../database/prismaClient"));
const invitationEmail_1 = require("../utils/invitationEmail");
const jwt_1 = require("../utils/jwt");
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield prismaClient_1.default.user.findUnique({ where: { email } });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        const resetToken = (0, jwt_1.generateToken)(user.email || '', user.id);
        const expiration = new Date(Date.now() + 3600000);
        yield prismaClient_1.default.user.update({
            where: { email },
            data: { resetToken, resetTokenExp: expiration },
        });
        yield (0, invitationEmail_1.sendResetEmail)(email, resetToken);
        res.json({ message: 'Reset email sent' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.query.token;
        const { newPassword } = req.body;
        let decoded = null;
        try {
            decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        }
        catch (error) {
            console.error('JWT Verification Failed:', error);
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
        if (!decoded || !decoded.id) {
            return res.status(400).json({ message: 'Invalid token format' });
        }
        const user = yield prismaClient_1.default.user.findUnique({ where: { id: decoded.id } });
        if (!user || !user.resetToken || user.resetTokenExp < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        yield prismaClient_1.default.user.update({
            where: { id: user.id },
            data: { password: hashedPassword, resetToken: null, resetTokenExp: null },
        });
        res.json({ message: 'Password reset successful' });
    }
    catch (error) {
        console.error('Error Details:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.resetPassword = resetPassword;
