import User from './../models/userModel.js';
import asyncWrapper from './asyncWrapper.js';

export const signup = asyncWrapper(async (req, res, next) => {
  const { name, email, password, passwordConfirm, photo } = req.body;

  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    photo,
  });

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});
