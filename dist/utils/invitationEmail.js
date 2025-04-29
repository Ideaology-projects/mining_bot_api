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
exports.sendResetEmail = void 0;
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
/**
 * Send an email with the given configuration.
 * @param {EmailOptions} options - Email configuration options
 * @returns {Promise<nodemailer.SentMessageInfo>} - Email sending result
 */
function sendEmail(_a) {
    return __awaiter(this, arguments, void 0, function* ({ from = 'no_reply@rechargermonauto.com', to, subject, text, html, }) {
        const mailOptions = {
            from,
            to,
            subject,
            text,
            html,
        };
        try {
            const info = yield transporter.sendMail(mailOptions);
            console.log('Email sent: %s', info.messageId);
            return info;
        }
        catch (error) {
            console.error('Failed to send email:', error);
            throw error;
        }
    });
}
const sendResetEmail = (email, token) => __awaiter(void 0, void 0, void 0, function* () {
    yield transporter.sendMail({
        from: `"Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Password Reset',
        html: `<p>Please copy the link and <a href="http://localhost:3000/api/v1/reset/reset-password?token=${token}">reset your password</a>. This link expires in 1 hour.</p>`,
    });
});
exports.sendResetEmail = sendResetEmail;
