
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../database/prismaClient";
import { sendResetEmail } from "../utils/invitationEmail";
import crypto from "crypto";

const HMAC_SECRET = process.env.HMAC_SECRET || "super_secret_key";
console.log("HMAC_SECRET",HMAC_SECRET)
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateHmacHash(value: string): string {
  return crypto.createHmac("sha256", HMAC_SECRET).update(value).digest("hex");
}

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const rawResetToken = crypto.randomBytes(32).toString("hex");
    const hashedResetToken = generateHmacHash(rawResetToken);

    const expiration = new Date(Date.now() + 3600000); 
    const otp = generateOTP();
    const otpExpiration = new Date(Date.now() + 5 * 60 * 1000); 
    const hashedOtp = generateHmacHash(otp);

    await prisma.user.update({
      where: { email },
      data: {
        resetToken: hashedResetToken,
        resetTokenExp: expiration,
        otp: hashedOtp,
        otpExpiresAt: otpExpiration,
        otpVerified: false,
      },
    });

    const output = await sendResetEmail(email, rawResetToken, otp);
     console.log("Email sent: ", output);
    res.json({ message: "Password reset email with OTP has been sent" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword, confirmPassword, otp, resetToken } = req.body;

    if (!email || !newPassword || !confirmPassword || !otp || !resetToken) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

   const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.",
      });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.otp || !user.otpExpiresAt || new Date() > user.otpExpiresAt) {
      return res.status(400).json({ message: "OTP expired or invalid" });
    }
    const hashedInputOtp = generateHmacHash(otp);
    if (hashedInputOtp !== user.otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (!user.resetToken || !user.resetTokenExp || new Date() > user.resetTokenExp) {
      return res.status(400).json({ message: "Reset token expired or invalid" });
    }
    const hashedInputReset = generateHmacHash(resetToken);
    if (hashedInputReset !== user.resetToken) {
      return res.status(400).json({ message: "Invalid reset token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExp: null,
        otpVerified: false,
        otp: null,
        otpExpiresAt: null,
      },
    });

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const syncPassword = async (req: Request, res: Response) => {
  try {
    const rawBody = JSON.stringify(req.body);
    const signature = req.headers["x-signature"] as string;

    const expectedSignature = crypto
      .createHmac("sha256", HMAC_SECRET)
      .update(rawBody)
      .digest("base64");

    if (signature !== expectedSignature) {
      return res.status(401).json({ message: "Invalid signature" });
    }

    const { username, email, new_password } = req.body;
    if (!email || !new_password) {
      return res.status(400).json({ message: "Email and new password required" });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordRegex.test(new_password)) {
      return res.status(400).json({
        message:
          "Password must include uppercase, lowercase, number, and special character",
      });
    }

    const user = await prisma.user.findFirst({
      where: { email: email },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    await prisma.user.update({
      where: { email: email },
      data: { password: hashedPassword },
    });

    res.json({ status: "ok", user_id: user.id });
  } catch (error) {
    console.error("Sync Password Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
