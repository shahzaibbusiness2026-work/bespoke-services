import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('[ServerError]', err);

  const statusCode = err.statusCode || (err.message.includes('not found') ? 404 : 400);
  const message = err.message || 'An unexpected atelier server error occurred.';

  res.status(statusCode).json({
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
  });
};
