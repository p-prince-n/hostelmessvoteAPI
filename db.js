import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const connectDB = async () => {
  try {
    const conn=await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected', conn.connection.host);
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  }
};