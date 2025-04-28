import { Request, Response } from 'express';
import prisma from '../database/prismaClient';
import { verifyToken }   from '../utils/jwt'; 
import { generateToken }   from '../utils/jwt'; 
import {sendEmail }from '../utils/invitationEmail';

interface DecodedToken {
  email: string;
  [key: string]: any; 
}

export const verifyEmail = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { token } = req.query;
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ message: 'Verification token is required.' });
    }
    const decoded = verifyToken(token) as DecodedToken | null;

    if (!decoded || !decoded.walletAddress) {
      return res.status(400).json({ message: 'Invalid or expired token.' });
    }

    const user = await prisma.user.findUnique({
      where: { email: decoded.walletAddress }, 
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }


    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email is already verified.' });
    }


    if (user.emailToken) {
      await prisma.user.update({
        where: { email: decoded.walletAddress },
        data: {
          emailToken: "", 
        },
      });
    }

    await prisma.user.update({
      where: { email: decoded.walletAddress },
      data: {
        emailToken: "", 
        isEmailVerified: true, 
        emailVerifiedAt: new Date(), 
      },
    });

    return res.status(200).json({ message: 'Email successfully verified.' });

  } catch (error) {
    console.error('Error verifying email:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


export const resendVerificationEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Your email is already verified' });
    }

    const resendLimit = 1 * 60 * 1000;
    const emailSentTime = new Date(user.emailSentAt).getTime();
    const currentTime = Date.now();
    const diffInMillis = currentTime - emailSentTime;

    if (diffInMillis < resendLimit) {
      return res.status(400).json({ message: 'Please wait a minute before requesting a new email.' });
    }

    const emailToken = generateToken(email, Date.now());

    await prisma.user.update({
      where: { email },
      data: {
        emailToken,
        emailSentAt: new Date(),
      },
    });

    const emailVerificationUrl = `http://18.119.105.184/api/v1/email/verify-email?token=${emailToken}`;
    
    await sendEmail({
      to: email,
      subject: 'Confirm your email',
      html: `<p>Hi ${user.username},</p>
             <p>Please verify your email by clicking the link below:</p>
            <a href="${emailVerificationUrl}">Verify Email</a>
             <p>This link will expire in 1 hour.</p>`,
    });

    return res.status(200).json({ message: 'Verification email has been resent. Please check your inbox.' });

  } catch (error) {
    console.error('Resend Email Verification Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
