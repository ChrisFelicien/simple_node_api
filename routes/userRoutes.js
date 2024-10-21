import { Router } from 'express';
import {
  getAllUsers,
  createUser,
  deleteUser,
  getUser,
  updateUser,
} from '../controllers/usersController.js';
import {
  login,
  signup,
  resetPassword,
  forgotPassword,
} from '../controllers/authentication.js';

const router = Router();

router.post('/rest-password', resetPassword);
router.post('/forgot-password', forgotPassword);
router.post('/signup', signup);
router.post('/login', login);
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').delete(deleteUser).get(getUser).patch(updateUser);

export default router;
