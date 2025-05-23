import express from 'express';
import {
  startMinning
} from '../controllers/startMining.controller';
import {
  createBooster
} from '../controllers/createBooster.controller';
import { activeBooster,getTotalBalance } from '../controllers/activeBooster.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import {changeOnlineStatus} from '../controllers/stopCronJob.controller'
const router = express.Router();

router.post('/mining-start', authMiddleware, startMinning);
router.post('/create-booster', authMiddleware, createBooster);

//get active Booster
router.get('/active-booster', authMiddleware,activeBooster)
//get Total Balance
router.get('/total-balance', authMiddleware, getTotalBalance)

//change isOnline status of user 
router.post('/user-status', authMiddleware, changeOnlineStatus);


export default router;
