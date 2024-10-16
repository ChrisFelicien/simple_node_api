import AppError from '../utils/appError.js';

const handleErrorDuplicateFieldsDB = (err) => {
  const value = err.errorResponse.errmsg.match(/".*?" /)[0];
  const message = `Sorry, Duplicate field value ${value}, Please try another value`;

  return new AppError(message, 400);
};

const devError = (error, res) => {
  return res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    error,
    stack: error.stack,
  });
};

const productionError = (err, res) => {
  console.log(err);
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  res.status(500).json({
    status: 'error',
    message: 'Something went wrong please retry later.',
  });
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;

  return new AppError(message, 400);
};

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    return devError(err, res);
  }

  let error = { ...err };

  error.message = err.message;

  if (err.code === 11000) {
    error = handleErrorDuplicateFieldsDB(error);
  }

  if (err.name === 'ValidationError') {
    error = handleValidationErrorDB(error);
  }
  return productionError(error, res);
};
