import { Router } from 'express';
import {
  getAllUsers,
  createUser,
  deleteUser,
  getUser,
  updateUser,
} from '../controllers/usersController.js';
import { signup } from '../controllers/authentication.js';

const router = Router();

router.post('/signup', signup);
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').delete(deleteUser).get(getUser).patch(updateUser);

export default router;
