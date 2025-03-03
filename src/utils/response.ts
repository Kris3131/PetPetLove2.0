import { Response } from 'express';

export const successResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T
) => {
  return res.status(Number(statusCode)).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

export const errorResponse = (
  res: Response,
  statusCode: number,
  message: string,
  error?: string
) => {
  return res.status(Number(statusCode)).json({
    success: false,
    message,
    error,
    timestamp: new Date().toISOString(),
  });
};
