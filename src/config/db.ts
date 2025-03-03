import { config } from 'dotenv';
import mongoose from 'mongoose';

import logger from '../utils/logger';

config();

const MONGO_URL = process.env.MONGO_URL as string;
const DATABASE_NAME = process.env.MONGO_DB_NAME as string;
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      serverSelectionTimeoutMS: 5000,
      ssl: true,
      dbName: DATABASE_NAME,
    });
    logger.info('[DB] MongoDB Connected');
  } catch (error) {
    logger.error(`[DB] MongoDB Connection Error: ${error}`);
    process.exit(1);
  }
};

export default connectDB;
