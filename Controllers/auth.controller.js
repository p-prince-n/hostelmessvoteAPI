import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import dotenv from 'dotenv';
dotenv.config();

const signToken = (user) => {
  return jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

export const register = async (req, res) => {
  try {
    const { rollNo, name, email, password, isAdmin } = req.body;
    if (!rollNo || !name || !password) return res.status(400).json({ message: 'Missing fields' });

    const existing = await User.findOne({ rollNo });
    if (existing) return res.status(400).json({ message: 'Roll number already registered' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ rollNo, name, email, password: hash, isAdmin: isAdmin || false });

    const token = signToken(user);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({ message: 'Registered successfully', user: { id: user._id, name: user.name, rollNo: user.rollNo, isAdmin: user.isAdmin } });
  } catch (err) {
    res.status(500).json({ message: 'Register failed', error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { rollNo, password } = req.body;
    if (!rollNo || !password) return res.status(400).json({ message: 'Missing credentials' });

    const user = await User.findOne({ rollNo });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken(user);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ message: 'Login successful', user: { id: user._id, name: user.name, rollNo: user.rollNo, isAdmin: user.isAdmin } });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.json({ message: 'Logged out successfully' });
};
