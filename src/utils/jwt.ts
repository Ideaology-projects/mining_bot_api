import jwt from 'jsonwebtoken';

export const generateToken = (walletAddress: string, id: number) => {
  return jwt.sign({ walletAddress, id }, process.env.JWT_SECRET!, {
    expiresIn: '1h',
  });
};
