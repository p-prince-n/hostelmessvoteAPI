import { Router } from 'express';
import { createMenuItem, topMenuItems, getAllMenuItems } from '../Controllers/menu.controller.js';
import { auth, isAdmin } from '../middleware/auth.js';

const router = Router();


router.get('/top', auth, topMenuItems);
router.post('/', auth, isAdmin, createMenuItem);
router.get('/getAllItems', getAllMenuItems);

export default router;