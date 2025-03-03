import { config } from 'dotenv';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { verify } from 'jsonwebtoken';

import User, { IUser } from '../models/User';
import logger from '../utils/logger';

config();

export const protect: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    logger.error(`[AUTH] Unauthorized: ${req.headers.authorization}`);
    res.status(401).json({ message: '[AUTH] Unauthorized' });
    return;
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };
    const userData = (await User.findById(decoded.id).select(
      '-password'
    )) as IUser;

    if (!userData) {
      logger.error(`[AUTH] Invalid token: ${token}`);
      res.status(401).json({ message: '[AUTH] Invalid token' });
      return;
    }

    const user = userData.toJSON();
    req.user = { id: user._id.toString(), ...user };
    next();
  } catch (error) {
    logger.error(`[AUTH] Invalid token: ${error}`);
    res.status(401).json({ message: '[AUTH] Invalid token' });
    return;
  }
};
