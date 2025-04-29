"use strict";
// import express, { Request, Response } from "express";
// import { sendOTP, linkUserWithTelegram } from "../controllers/telegramAuth";
// const router = express.Router();
// router.post("/send-otp", async (req: Request, res: Response) => {
//   try {
//     const { telegramUserId, phoneNumber } = req.body;
//     if (!telegramUserId || !phoneNumber) {
//       res.status(400).json({ message: "Telegram User ID and Phone Number are required" });
//       return;
//     }
//     const responseMessage = await sendOTP(telegramUserId);
//     // Link the user with the given phone number and telegramUserId
//     const linkResponse = await linkUserWithTelegram(phoneNumber, telegramUserId);
//     res.json({ otpMessage: responseMessage, linkMessage: linkResponse });
//   } catch (error) {
//     console.error("❌ Error in send-otp route:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });
// export default router;
