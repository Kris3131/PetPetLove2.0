import { NextFunction, Request, Response } from 'express';

export const responseMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next();
};
