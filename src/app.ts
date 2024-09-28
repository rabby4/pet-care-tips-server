import express, { Request, Response } from 'express';
import cors from 'cors';
import router from './app/router';
const app = express();

// parser
app.use(express.json());
app.use(cors());

// server main route
app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'Success',
    message: 'Welcome to Pet Care Tips and Stories API',
  });
});

export default app;
