import express from 'express';
import morgan from 'morgan';
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';
import cors from 'cors';
import globalErrorHandler from './controllers/errorController.js';
import AppError from './utils/appError.js';

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(cors());

if (process.env.NODE_ENV === 'development') app.use(morgan('dev')); //Runs only in development environment

app.use((req, res, next) => {
  req.currentTime = new Date().toISOString();
  next();
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});

app.use(globalErrorHandler);

export default app;
