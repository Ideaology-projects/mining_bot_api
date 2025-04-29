import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendEmail } from '../utils/invitationEmail';

const prisma = new PrismaClient();

export const inviteFriend = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const currentUserId = req.user;
  
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const userId = currentUserId.id;

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { referralCode: true },
    });
  
     console.log("currentUser", currentUser);
    if (!currentUser || !currentUser.referralCode) {
      return res.status(404).json({ message: 'Referral code not found for user' });
    }

    const existingUser = await prisma.invitation.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already invited' });
    }

    await prisma.invitation.create({
      data: { name, email },
    });

    const referralCode = currentUser.referralCode;
   
    await sendEmail({
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
  } catch (error) {
    console.error('Error inviting friend:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};
