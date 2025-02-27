import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db';

import authRoutes from './routes/authRoutes';
import followRoutes from './routes/followRoutes';
import blockRoutes from './routes/blockRoutes';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/follow', followRoutes);
app.use('/api/block', blockRoutes);

app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server running on http://localhost:${PORT}`);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
});
