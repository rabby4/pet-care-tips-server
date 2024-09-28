import express, { Request, Response } from 'express';
import cors from 'cors';
const app = express();

// parser
app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'Success',
    message: 'Welcome to Pet Care Tips and Stories API',
  });
});

export default app;
