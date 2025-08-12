import { Router } from 'express';
import { vote, myVotes } from '../controllers/vote.controller.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.post('/', auth, vote);
router.get('/me', auth, myVotes);

export default router;