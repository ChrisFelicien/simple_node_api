import { Router } from 'express';
import {
  getAllTours,
  getTour,
  deleteTour,
  createTour,
  updatedTour,
  checkId,
} from '../controllers/toursController.js';

const router = Router();

router.param('id', checkId);
router.route('/:id').get(getTour).delete(deleteTour).patch(updatedTour);
router.route('/').get(getAllTours).post(createTour);

export default router;
