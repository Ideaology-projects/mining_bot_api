import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes';
import rewardRoutes from './routes/reward.routes';
import refferalRoutes from './routes/referral.routes';

dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Sample Route
app.get('/', (req, res) => {
  res.json({ message: 'Hello, Express with TypeScript!' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/rewards', rewardRoutes);
app.use('/api/v1/refferal', refferalRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
