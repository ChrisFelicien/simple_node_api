import User from './../models/userModel.js';
import asyncWrapper from './asyncWrapper.js';

export const getAllUsers = asyncWrapper(async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

export const getUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: 'Single user routes',
  });
};

export const updateUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: 'update user routes',
  });
};

export const deleteUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: 'delete users routes',
  });
};

export const createUser = (req, res) => {
  res.status(201).json({
    status: 'success',
    data: 'Users created',
  });
};
