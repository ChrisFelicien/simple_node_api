import { Router } from 'express';
import {
  getAllUsers,
  createUser,
  deleteUser,
  getUser,
  updateUser,
} from '../controllers/usersController.js';

const router = Router();

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').delete(deleteUser).get(getUser).patch(updateUser);

export default router;
