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
  busyMonth,
} from '../controllers/toursController.js';
import { protect, restrictTo } from '../controllers/authentication.js';

const router = Router();

router.route('/monthly-plan/:year').get(busyMonth);
router.route('/tours-stats').get(checkStatics);
router.route('/top-five-cheapest').get(topFiveHighAndCheapestTour, getAllTours);
router.param('id', checkId);
router
  .route('/:id')
  .get(getTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour)
  .patch(updatedTour);
router.route('/').get(protect, getAllTours).post(createTour);

export default router;
