import { config } from 'dotenv';
import { RequestHandler } from 'express';
import { sign, SignOptions } from 'jsonwebtoken';
import mongoose from 'mongoose';

import { HTTP_STATUS } from '../constants/httpStatus';
import User from '../models/User';
import logger from '../utils/logger';
import { errorResponse, successResponse } from '../utils/response';

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
      errorResponse(res, HTTP_STATUS.BAD_REQUEST, 'Email already exists');
      return;
    }

    const user = await User.create({ username, email, password });

    logger.info(`[AUTH] User registered: ${user.id}`);
    successResponse(res, HTTP_STATUS.CREATED, 'User registered', {
      _id: user.id,
      username: user.username,
      email: user.email,
      token: generateToken(user.id),
    });
  } catch (error) {
    logger.error(`[AUTH] Server error: ${error}`);
    errorResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Server error');
  }
};

export const loginUser: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).lean();

    if (
      !user ||
      !(await User.schema.methods.comparePassword.call(user, password))
    ) {
      logger.error(`[AUTH] Email or password error: ${email}`);
      errorResponse(res, HTTP_STATUS.UNAUTHORIZED, 'Email or password error');
      return;
    }

    const userId = (user._id as mongoose.Types.ObjectId).toString();
    const token = generateToken(userId);

    logger.info(`[AUTH] Login successful: ${userId}`);
    successResponse(res, HTTP_STATUS.OK, 'Login successful', {
      token,
      userId,
    });
  } catch (error) {
    logger.error(`[AUTH] Login failed: ${error}`);
    errorResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Login failed');
  }
};
