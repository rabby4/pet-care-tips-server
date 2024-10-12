import express, { Request, Response } from 'express';
import cors from 'cors';
import router from './app/router';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import cookieParser from 'cookie-parser';
import sendResponse from './app/utils/sendResponse';
import httpStatus from 'http-status';
const app = express();

// parser
app.use(express.json());
app.use(cors());
app.use(cookieParser());
// server main route
app.use('/api', router);

// global error
app.use(globalErrorHandler);

app.get('/', (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Welcome to Pet Care Tips and Stories API',
  });
});

export default app;
