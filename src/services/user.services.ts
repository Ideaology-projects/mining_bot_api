// import prisma from "../database/prismaClient"
// export const linkUserWithTelegram = async (phoneNumber: string, telegramUserId: string) => {
//   try {
//     console.log(`🔍 Checking database for phone number: ${phoneNumber}`);

//     // Find user by phone number
//     const userByPhone = await prisma.user.findFirst({
//       where: { phoneNumber },
//     });

//     if (!userByPhone) {
//       console.log("❌ User not found in database.");
//       return "❌ Phone number not found. Please register first.";
//     }

//     // Check if already linked
//     if (userByPhone.telegramUserId === telegramUserId) {
//       console.log("✅ User is already linked.");
//       return "✅ Your Telegram account is already linked!";
//     }

//     // Update telegramUserId
//     await prisma.user.update({
//       where: { id: userByPhone.id }, // Use ID because phoneNumber is not a primary key
//       data: { telegramUserId },
//     });

//     console.log("✅ Telegram ID updated successfully in database!");
//     return "✅ Your Telegram account has been linked successfully!";
//   } catch (error) {
//     console.error("❌ Error linking Telegram account:", error);
//     return "⚠️ An error occurred while linking. Please try again later.";
//   }
// };

// // const prisma = new PrismaClient();
// // import { generateOTP, hashOTP } from "../utils/otp";
// // export const sendOTP = async (telegramUserId: string): Promise<string> => {
// //   const otp = generateOTP();
// //   const hashedOTP = await hashOTP(otp);

// //   await prisma.user.update({
// //     where: { telegramUserId },
// //     data: { otp: hashedOTP, otpExpiresAt: new Date(Date.now() + 3 * 60000) }, // Expires in 3 min
// //   });

// //   return `Your OTP is ${otp}. It will expire in 3 minutes.`;
// // };
