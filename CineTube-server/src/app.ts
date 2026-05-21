import express, { Application, Request, Response } from 'express';

const app: Application = express();


app.use(express.json());


app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'CineTube Server Is Running Successfully! 🚀',
  });
});

export default app;