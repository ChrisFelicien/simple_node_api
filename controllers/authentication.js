import jwt from 'jsonwebtoken';
import User from './../models/userModel.js';
import asyncWrapper from './asyncWrapper.js';
import AppError from './../utils/appError.js';

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
};

export const signup = asyncWrapper(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });

  const token = createToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

export const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide valid email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Sorry,Incorrect email or password.', 401));
  }

  const token = createToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
    user,
  });
});

export const protect = asyncWrapper(async (req, res, next) => {
  // check if the token is provided
  let token;
  const { authorization } = req.headers;
  // if(req.headers)

  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  }

  if (!token) {
    next(new AppError('You are not logged in, Please log to access', 401));
  }

  // check if the token is valid
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    next(new AppError('The user no longer exist.', 401));
  }

  // Check if the user didn't change is password
  if (currentUser?.hasPasswordBeenChanged(decoded.iat)) {
    next(new AppError('The user password has been changed try to login', 401));
  }
  req.user = currentUser;

  next();
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    const { role } = req.user;
    if (!roles.includes(role)) {
      next(
        new AppError(`Sorry you are not allowed to perform this action`, 403)
      );
    }
    next();
  };
};

export const forgotPassword = asyncWrapper(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError('No user find', 404));
  }

  const resetToken = user.createPasswordReset();
  await user.save({ validateBeforeSave: false });
});

export const resetPassword = (req, res, next) => {};
