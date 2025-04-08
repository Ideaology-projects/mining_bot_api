import { Request, Response } from 'express';
import prisma from '../database/prismaClient';
import { generateToken } from '../utils/jwt';
import bcrypt from 'bcrypt';

// export const authenticateUser = async (req: Request, res: Response) => {
//   const { walletAddress, referralCode, referredBy } = req.body;
//   console.log('referredBy', referredBy);
//   if (!walletAddress) {
//     res.status(400).json({ error: 'Wallet address is required' });
//     return;
//   }

//   try {
//     let user = await prisma.user.findUnique({
//       where: { walletAddress },
//     });
//     // If user doesn't exist, create one (and process referral if referralCode is provided)
//     if (!user) {
//       // If referralCode provided, try to find the referring user
//       let referrer = null;
//       if (referralCode) {
//         referrer = await prisma.user.findUnique({
//           where: { referralCode },
//         });
//       }

//       user = await prisma.user.create({
//         data: {
//           walletAddress,
//           // Save referredBy only if a valid referrer exists
//           referredBy: referrer ? referrer.referralCode : null,
//         },
//       });

//       // If a valid referrer is found, create the referral record and associated rewards
//       if (referrer) {
//         await prisma.referral.create({
//           data: {
//             referrerId: referrer.id,
//             refereeId: user.id,
//           },
//         });

//         // Create reward for the referrer (e.g., 100 points)
//         await prisma.reward.create({
//           data: {
//             userId: referrer.id,
//             points: 100, // Adjust points as needed
//             type: 'referral_bonus',
//             status: 'pending', // Mark as pending; change later as per your business logic
//           },
//         });

//         // Create reward for the new user (e.g., 50 points)
//         await prisma.reward.create({
//           data: {
//             userId: user.id,
//             points: 50, // Adjust points as needed
//             type: 'signup_bonus',
//             status: 'pending',
//           },
//         });
//       }
//     }

//     // Generate JWT token (assume generateToken is defined elsewhere)
//     const token = generateToken(walletAddress, user.id);
//     res.json({ token, user });
//   } catch (error) {
//     console.error('Auth Error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };
export const authenticateUser = async (req: Request, res: Response) => {
  try {
    const { walletAddress, email, username, password, referralCode } = req.body;

    if (!walletAddress && (!email || !username || !password)) {
      return res
        .status(400)
        .json({ message: 'Wallet address or email/password is required!' });
    }

    let user = null;

    if (walletAddress) {
      user = await prisma.user.findUnique({ where: { walletAddress } });
      if (!user) {
        let referrer = null;
        if (referralCode) {
          referrer = await prisma.user.findUnique({ where: { referralCode } });
        }

        user = await prisma.user.create({
          data: {
            walletAddress,
            referredBy: referrer ? referrer.referralCode : null,
          },
        });

        if (referrer) {
          await prisma.referral.create({
            data: { referrerId: referrer.id, refereeId: user.id },
          });

          await prisma.reward.create({
            data: {
              userId: referrer.id,
              points: 100,
              type: 'referral_bonus',
              status: 'pending',
            },
          });

          await prisma.reward.create({
            data: {
              userId: user.id,
              points: 50,
              type: 'signup_bonus',
              status: 'pending',
            },
          });
        }
      }
    }

    if (email) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res
          .status(409)
          .json({ message: 'User with this email already exists.' });
      }

      const hashedPassword = await hashPassword(password);
      user = await prisma.user.create({
        data: { username, email, password: hashedPassword, walletAddress },
      });
    }

    if (!user) {
      return res.status(500).json({ message: 'User registration failed.' });
    }

    const token = generateToken(
      user.walletAddress || user.email || '',
      user.id,
    );
    return res
      .status(201)
      .json({ token, user, message: 'User created successfully!' });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
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

// export const authenticateUserByEmail = async (req: Request, res: Response) => {
//   try {
//     const { email, username, password, walletAddress } = req.body;

//     if (!email || !username || !password ) {
//       return res.status(400).json({ message: "All fields are required!" });
//     }

//     const existingUser = await prisma.user.findUnique({ where: { email } });
//     if (existingUser) {
//       return res.status(409).json({ message: "User with this email already exists." });
//     }

//     const hashedPassword = await hashPassword(password);

//     const newUser = await prisma.user.create({
//       data: { username, email, password: hashedPassword, walletAddress },
//     });

//     return res.status(201).json({ user: newUser, message: "User created successfully!" });
//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required!' });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password!' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password || '');
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password!' });
    }

    const token = generateToken(user.email || '', user.id);

    return res.status(200).json({ token, user, message: 'Login successful!' });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
