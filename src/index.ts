import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes';
import rewardRoutes from './routes/reward.routes';
import refferalRoutes from './routes/referral.routes';
// import botRoute from './routes/bot.routes'
// import otpRoute from "./routes/sentotp.routes"
// import bot from './controllers/bot.controller';
// console.log("Telegram Bot is running...", bot);
import inviteRoutes from './routes/invite.routes';
import checkInRoutes from './routes/checkIn.routes';
import orderRoutes from './routes/buyProduct.routes';
import productRoutes from './routes/productRoutes.route';
import topMinors from './routes/topMinors.routes';
import reset from './routes/resetPassword.routes';
import swaggerSpec from './utils/swaggerConfig';
import swaggerUi from 'swagger-ui-express';
import sendEmail from './routes/verifyEamil.routes';
import startMine from './routes/startMining.route'
import entry from './routes/entries.routes'
import roomDecoration from './routes/room.routes'

dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Sample Route
app.get('/', (req, res) => {
  res.json({ message: 'Hello, Express with TypeScript!' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/rewards', rewardRoutes);
app.use('/api/v1/refferal', refferalRoutes);
app.use('/api/v1/invitation', inviteRoutes);
app.use('/api/v1/checkin', checkInRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/minor', topMinors);
app.use('/api/v1/reset', reset);
app.use('/api/v1/product',productRoutes);
app.use('/api/v1/otp',sendEmail);
app.use('/api/v1/mining',startMine)
app.use('/api/v1/entry',entry)
app.use('/api/v1/room',roomDecoration)

const startCronJob = async () => {
  const { default: balanceCronJob } = await import('./jobs/balanceCron');
  balanceCronJob.start();  // Start the cron job
  console.log('✔️ Cron job started!');
};

startCronJob(); // Call to start the cron job


// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
