import { Request, Response } from 'express';
import httpStatus from 'http-status';

// catch-all for unknown API routes so they return the standard JSON error shape
const notFound = (req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    statusCode: httpStatus.NOT_FOUND,
    message: 'API route not found',
  });
};

export default notFound;
