// // import { Request, Response } from "express";
// // import prisma from "@prisma/client"; // Ensure Prisma is correctly imported
// // import { compareOTP } from "../utils/otp";

// // export const verifyOTP = async (req: Request, res: Response) => {
// //     try {
// //         const { phoneNumber, otp } = req.body;

// //         // Validate input
// //         if (!phoneNumber || !otp) {
// //             return res.status(400).json({ message: "Phone number and OTP are required." });
// //         }

// //         const user = await prisma.user.findUnique({ where: { phoneNumber } });

// //         if (!user || !user.otp || !user.otpExpiresAt) {
// //             return res.status(400).json({ message: "Invalid OTP request." });
// //         }

// //         if (new Date() > user.otpExpiresAt) {
// //             return res.status(400).json({ message: "OTP has expired." });
// //         }

// //         const isMatch = await compareOTP(otp, user.otp);
// //         if (!isMatch) {
// //             return res.status(400).json({ message: "Incorrect OTP." });
// //         }

// //         // OTP verified; clear OTP fields
// //         await prisma.user.update({
// //             where: { phoneNumber },
// //             data: { otp: null, otpExpiresAt: null },
// //         });

// //         return res.status(200).json({ message: "OTP verified! You are logged in." });

// //     } catch (error) {
// //         console.error("OTP verification error:", error);
// //         return res.status(500).json({ message: "Internal server error." });
// //     }
// // };

// import { PrismaClient } from "@prisma/client";
// import { generateOTP, hashOTP } from "../utils/otp";

// const prisma = new PrismaClient();

// // ✅ Function to send OTP
// export const sendOTP = async (telegramUserId: string): Promise<string> => {
//   try {
//     const user = await prisma.user.findUnique({ where: { telegramUserId } });

//     if (!user) {
//       return "User not found. Please link your phone number first.";
//     }

//     const otp = generateOTP();
//     const hashedOTP = await hashOTP(otp);

//     await prisma.user.update({
//       where: { telegramUserId },
//       data: { otp: hashedOTP, otpExpiresAt: new Date(Date.now() + 3 * 60000) }, // Expires in 3 min
//     });

//     return `Your OTP is ${otp}. It will expire in 3 minutes.`;
//   } catch (error) {
//     console.error("❌ Error generating OTP:", error);
//     return "An error occurred. Please try again.";
//   }
// };

// // ✅ Function to verify OTP
// // export const verifyOTP = async (req: Request, res: Response) => {
// //   try {
// //     const { phoneNumber, otp } = req.body;

// //     if (!phoneNumber || !otp) {
// //       return res.status(400).json({ message: "Phone number and OTP are required." });
// //     }

// //     const user = await prisma.user.findUnique({ where: { phoneNumber } });

// //     if (!user || !user.otp || !user.otpExpiresAt) {
// //       return res.status(400).json({ message: "Invalid OTP request." });
// //     }

// //     if (new Date() > user.otpExpiresAt) {
// //       return res.status(400).json({ message: "OTP has expired." });
// //     }

// //     const isMatch = await compareOTP(otp, user.otp);
// //     if (!isMatch) {
// //       return res.status(400).json({ message: "Incorrect OTP." });
// //     }

// //     await prisma.user.update({
// //       where: { phoneNumber },
// //       data: { otp: null, otpExpiresAt: null },
// //     });

// //     return res.status(200).json({ message: "OTP verified! You are logged in." });
// //   } catch (error) {
// //     console.error("❌ OTP verification error:", error);
// //     return res.status(500).json({ message: "Internal server error." });
// //   }
// // };

// // ✅ Function to link Telegram ID with a phone number
// export const linkUserWithTelegram = async (
//   phoneNumber: string,
//   telegramUserId: string
// ): Promise<string> => {
//   try {
//     const user = await prisma.user.findUnique({ where: { phoneNumber } });
//           console.log("useruser",user)
//     if (!user) {
//       return "Phone number not found. Please try again.";
//     }

//     await prisma.user.update({
//       where: { phoneNumber },
//       data: { telegramUserId },
//     });

//     return "Account successfully linked.";
//   } catch (error) {
//     console.error("❌ Error linking Telegram:", error);
//     return "An error occurred. Please try again.";
//   }
// };
