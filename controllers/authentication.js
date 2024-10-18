import jwt from 'jsonwebtoken';
import User from './../models/userModel.js';
import asyncWrapper from './asyncWrapper.js';

export const signup = asyncWrapper(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});
