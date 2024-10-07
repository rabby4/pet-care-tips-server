import express, { Request, Response } from 'express';
import cors from 'cors';
import router from './app/router';
import globalErrorHandler from './app/middleware/globalErrorHandler';
const app = express();

// parser
app.use(express.json());
app.use(cors());

// server main route
app.use('/api', router);

// global error
app.use(globalErrorHandler);

app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'Success',
    message: 'Welcome to Pet Care Tips and Stories API',
  });
});

export default app;
