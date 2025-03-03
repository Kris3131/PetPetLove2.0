import { config } from 'dotenv';
import { RequestHandler } from 'express';
import { sign, SignOptions } from 'jsonwebtoken';

import User from '../models/User';
import logger from '../utils/logger';

config();

const generateToken = (id: string) => {
  const options: SignOptions = {
    expiresIn: Number(process.env.JWT_EXPIRES_IN),
  };
  return sign({ id }, process.env.JWT_SECRET as string, options);
};

export const registerUser: RequestHandler = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      logger.error(`[AUTH] Email already exists: ${email}`);
      res.status(400).json({ message: '[auth] Email already exists' });
      return;
    }

    const user = await User.create({ username, email, password });

    res.status(201).json({
      _id: user.id,
      username: user.username,
      email: user.email,
      token: generateToken(user.id),
    });
    logger.info(`[AUTH] User registered: ${user.id}`);
  } catch (error) {
    logger.error(`[AUTH] Server error: ${error}`);
    res.status(500).json({ message: `[auth] Server error: ${error}` });
  }
};

export const loginUser: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      logger.error(`[AUTH] Email or password error: ${email}`);
      res.status(401).json({ message: '[auth] Email or password error' });
      return;
    }

    const token = sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '1d',
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      userId: user._id,
    });
    logger.info(`[AUTH] Login successful: ${user._id}`);
  } catch (error) {
    logger.error(`[AUTH] Login failed: ${error}`);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: (error as Error).message,
    });
  }
};
