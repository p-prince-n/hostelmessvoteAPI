import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db.js';

import authRoutes from './routes/auth.route.js';
import menuRoutes from './routes/menu.route.js';
import voteRoutes from './routes/vote.route.js';

dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
  origin: '*', 
  credentials: true
}));

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/vote', voteRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    "/": "List all available API endpoints",
    "/api/users/register": "Register a new user (default student, admin must be set manually in DB)",
    "/api/users/login": "Login and get JWT stored in cookie",
    "/api/menu/getAllItems": "List all approved menu items (names only)",
    "/api/menu/top?limit=3": "Get top voted menu items (limit default 3)",
    "/api/menu/vote/:id": "Vote for a menu item (once per day per student)",
    "/api/menu/add": "Add new menu item (admin only)"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});

