import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

export const protect: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: '[auth] Unauthorized' });
    return;
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const userData = (await User.findById(decoded.id).select(
      '-password'
    )) as IUser;

    if (!userData) {
      res.status(401).json({ message: '[auth] Invalid token' });
      return;
    }

    const user = userData.toJSON();
    req.user = { id: user._id.toString(), ...user };
    next();
  } catch (error) {
    res.status(401).json({ message: '[auth] Invalid token' });
    return;
  }
};
