import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      ssl: true,
    });
    console.log('[db] MongoDB Connected');
  } catch (error) {
    console.error(`[db] MongoDB Connection Error: ${error}`);
    process.exit(1);
  }
};

export default connectDB;
