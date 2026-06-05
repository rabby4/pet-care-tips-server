import express, { Request, Response } from 'express';
import cors from 'cors';
import router from './app/router';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFound from './app/middleware/notFound';
import cookieParser from 'cookie-parser';
import sendResponse from './app/utils/sendResponse';
import httpStatus from 'http-status';
import config from './app/config';
const app = express();

// only allow the known client origins instead of every website
// (trailing slashes are stripped - the Origin header never has one)
const allowedOrigins = [
  config.client_url?.replace(/\/+$/, ''),
  'http://localhost:3000',
  'http://localhost:3001',
].filter(Boolean) as string[];

// parser
app.use(express.json());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Welcome to Pet Care Tips and Stories API',
  });
});

// server main route
app.use('/api', router);

// unknown routes -> JSON 404
app.use(notFound);

// global error
app.use(globalErrorHandler);

export default app;
