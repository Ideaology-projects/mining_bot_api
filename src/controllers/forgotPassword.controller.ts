
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../database/prismaClient";
import { sendResetEmail } from "../utils/invitationEmail";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const HMAC_SECRET = process.env.HMAC_SECRET!;
// const HMAC_SECRET = process.env.HMAC_SECRET || "super_secret_key";
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
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP and new password required" });
    }

    // ✅ Password policy check
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters, with uppercase, lowercase, number & special character",
      });
    }

    // 🧑 User check
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🕒 OTP validate
    if (!user.otp || !user.otpExpiresAt || new Date() > user.otpExpiresAt) {
      return res.status(400).json({ message: "OTP expired or invalid" });
    }

    const hashedOtp = generateHmacHash(otp);
    if (hashedOtp !== user.otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // 🔑 Password update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        otp: null,
        otpExpiresAt: null,
        otpVerified: false,
      },
    });

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Game Reset Password Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const syncPassword = async (req: Request, res: Response) => {
  try {
    const rawBody = (req as any).rawBody; 
    const signature = req.headers["x-signature"] as string;
    
    const expectedSignature = crypto
      .createHmac("sha256", HMAC_SECRET)
      .update(rawBody)
      .digest("base64");
    console.log("expectedSignature",expectedSignature);
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

    res.json({ 
      status: "ok", 
      message: "Password updated successfully", 
      user_id: user.id, 
      email: user.email 
    });

  } catch (error) {
    console.error("Sync Password Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
