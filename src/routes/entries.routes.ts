import express from 'express';
import { entriesAgaintsUser,getEntryAgainstUser } from '../controllers/entries.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
const router = express.Router();

router.post('/user-entry',authMiddleware, async (req, res) => {
  await entriesAgaintsUser(req, res);
});
router.get('/all-entries/:userId?',authMiddleware, async (req, res) =>{
await getEntryAgainstUser(req, res);
})
export default router;
