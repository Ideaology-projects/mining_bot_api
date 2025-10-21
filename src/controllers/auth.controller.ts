import { Request, Response } from 'express';
import prisma from '../database/prismaClient';
import { generateToken } from '../utils/jwt';
import bcrypt from 'bcrypt';
import { sendEmail } from '../utils/invitationEmail';

import axios from "axios";

export const authenticateUser = async (req: Request, res: Response) => {
  try {
    const { walletAddress, email, username, password, referralCode } = req.body;

    function generateOTP(): string {
      return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // ✅ Password validation
    if (password) {
      const passwordRegex =
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=/[\]{};':"\\|,.<>/?]).{8,}$/;

      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          message:
            "Password must be at least 8 characters long, include 1 uppercase letter, 1 number, and 1 special character.",
        });
      }
    }


    if (!walletAddress && (!email || !username || !password)) {
      return res
        .status(400)
        .json({ message: "Wallet address or email/password is required!" });
    }

    let user = null;
    let referrer = null;

    if (referralCode) {
      referrer = await prisma.user.findUnique({ where: { referralCode } });
    }

    if (walletAddress) {
      user = await prisma.user.findUnique({ where: { walletAddress } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            walletAddress,
            referredBy: referrer ? referrer.referralCode : null,
            emailToken: "",
          },
        });
      }
    }

    if (!user && email) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res
          .status(409)
          .json({ message: "User with this email already exists." });
      }

      const hashedPassword = await hashPassword(password);
      const otp = generateOTP();

      user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          walletAddress,
          referredBy: referrer ? referrer.referralCode : null,
          isEmailVerified: false,
          otp,
        },
      });

      await sendEmail({
        to: email,
        subject: "Confirm your email",
        html: `<p>Hi ${username},</p>
              <p>Your verification OTP code is: <strong>${otp}</strong></p>`,
      });

      if (referrer && user) {
        await prisma.referral.create({
          data: { referrerId: referrer.id, refereeId: user.id },
        });

        await prisma.reward.create({
          data: {
            userId: referrer.id,
            points: 100,
            type: "referral_bonus",
            status: "pending",
          },
        });

        await prisma.reward.create({
          data: {
            userId: user.id,
            points: 50,
            type: "signup_bonus",
            status: "pending",
          },
        });
      }
    }

    if (!user) {
      return res.status(500).json({ message: "User registration failed." });
    }

    // ✅ Register also on vBTC WooCommerce
    try {
      const wooRes = await axios.post(
        "https://vbtc.co/wp-json/wc/v3/customers",
        {
          email,
          username,
          password: password,
        },
        {
          auth: {
            username:
              process.env.WC_KEY ||
              "ck_978181222a1cae54bc9b82a7afbed1128777d9c3",
            password:
              process.env.WC_SECRET ||
              "cs_ce3189f8c995e069a365f7163f87c2f484496450",
          },
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("WooCommerce Response:", wooRes.data);
    } catch (wooErr: any) {
      console.error(
        "WooCommerce Register Error:",
        wooErr.response?.data || wooErr.message
      );
      // Optional: rollback game user if Woo fail? (depends on business rule)
    }

    return res.status(200).json({
      message:
        "User registered successfully in Game + vBTC. An OTP has been sent to your email.",
    });
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



export const protectedRoute = async (req: Request, res: Response) => {
  res.json({ message: 'Protected data accessed!', user: req?.user });
  return;
};

const saltRounds = 10;

const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, saltRounds);
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required!" });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password!" });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Your email is not verified. Please verify your email to log in.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password || "");
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password!" });
    }

    const gameToken = generateToken(user.email || "", user.id);

    const newUser = await prisma.user.update({
      where: { id: user.id },
      data: { isOnline: true },
    });

    let wpAuth = null;
    try {
      const wpRes = await axios.post(
        "https://vbtc.co/wp-json/jwt-auth/v1/token",
        {
          username: user.username,
          password: password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      wpAuth = wpRes.data;
      console.log("WordPress Login Response:", wpAuth);
    } catch (wpErr: any) {
      console.error("WordPress Login Error:", wpErr.response?.data || wpErr.message);
      // Optional: continue login in Game even if WP fails
    }

    return res.status(200).json({
      message: "Login successful!",
      gameToken,
      wpAuth, // WP JWT response
      newUser,
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const syncUserRegister = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res
        .status(400)
        .json({ message: "Email, username, and password are required." });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res
        .status(200)
        .json({ message: "User already exists in Game DB." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword, 
        isEmailVerified: true,
      },
    });

    console.log("✅ Synced user from web:", newUser.email);

    return res.status(201).json({
      message: "User synced successfully from Web to Game DB.",
      user: newUser,
    });
  } catch (error: any) {
    console.error("Sync error:", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};


