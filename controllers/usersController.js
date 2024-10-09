export const getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: 'All users routes',
  });
};

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
