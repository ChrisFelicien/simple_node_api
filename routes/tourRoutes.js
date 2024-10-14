import { Router } from 'express';
import {
  getAllTours,
  getTour,
  deleteTour,
  createTour,
  updatedTour,
  checkId,
  topFiveHighAndCheapestTour,
  checkStatics,
} from '../controllers/toursController.js';

const router = Router();

router.route('/tours-stats').get(checkStatics);
router.route('/top-five-cheapest').get(topFiveHighAndCheapestTour, getAllTours);
router.param('id', checkId);
router.route('/:id').get(getTour).delete(deleteTour).patch(updatedTour);
router.route('/').get(getAllTours).post(createTour);

export default router;
