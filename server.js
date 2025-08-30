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

app.get("/", (req, res) => {
  const routes = [
    // ---- AUTH ROUTES ----
    {
      path: "/api/auth/register",
      method: "POST",
      requiredFields: ["rollNo", "name", "password"],
      description: "Register a new user (stores JWT in HttpOnly cookie)."
    },
    {
      path: "/api/auth/login",
      method: "POST",
      requiredFields: ["rollNo", "password"],
      description: "Login user and set JWT in HttpOnly cookie."
    },
    {
      path: "/api/auth/logout",
      method: "POST",
      requiredFields: [],
      description: "Logout user by clearing JWT cookie."
    },

    // ---- MENU ROUTES ----
    {
      path: "/api/menu/top",
      method: "GET",
      requiredFields: ["JWT cookie (HttpOnly)"],
      description: "Fetch top voted menu items (default limit = 3, can pass ?limit=number)."
    },
    {
      path: "/api/menu",
      method: "POST",
      requiredFields: ["name", "description", "JWT cookie (admin only)"],
      description: "Create a new menu item (admin only)."
    },
    {
      path: "/api/menu/getAllItems",
      method: "GET",
      requiredFields: [],
      description: "Fetch all available menu items (returns id and name)."
    },

    // ---- VOTE ROUTES ----
    {
      path: "/api/vote",
      method: "POST",
      requiredFields: ["menuItemId", "voteDate", "JWT cookie"],
      description: "Submit a vote for a menu item."
    },
    {
      path: "/api/vote",
      method: "GET",
      requiredFields: ["JWT cookie (optional, depending on implementation)"],
      description: "Get all votes or filter by query params."
    }
  ];

  res.json({
    message: "API Routes Documentation (JWT stored in HttpOnly cookies)",
    routes
  });
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});

