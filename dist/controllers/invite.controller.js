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
Object.defineProperty(exports, "__esModule", { value: true });
exports.inviteFriend = void 0;
const client_1 = require("@prisma/client");
const invitationEmail_1 = require("../utils/invitationEmail");
const prisma = new client_1.PrismaClient();
const inviteFriend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentUserId = req.user;
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({ message: 'Name and email are required' });
        }
        const userId = currentUserId.id;
        const currentUser = yield prisma.user.findUnique({
            where: { id: userId },
            select: { referralCode: true },
        });
        console.log("currentUser", currentUser);
        if (!currentUser || !currentUser.referralCode) {
            return res.status(404).json({ message: 'Referral code not found for user' });
        }
        const existingUser = yield prisma.invitation.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({ message: 'User already invited' });
        }
        yield prisma.invitation.create({
            data: { name, email },
        });
        const referralCode = currentUser.referralCode;
        yield (0, invitationEmail_1.sendEmail)({
            to: email,
            subject: "You're Invited!",
            text: `Hello ${name},\n\nYou've been invited to join us!\nUse this referral Code: ${referralCode}`,
            html: `
        <p>Hello <strong>${name}</strong>,</p>
        <p>You've been invited to join us!</p>
        <p>Copy this referral Code: <a href="">${referralCode}</a></p>
      `,
        });
        return res.status(200).json({ message: 'Invitation sent successfully!' });
    }
    catch (error) {
        console.error('Error inviting friend:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
});
exports.inviteFriend = inviteFriend;
