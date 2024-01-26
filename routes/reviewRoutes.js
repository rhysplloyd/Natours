const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });
// merge params allows access to params when coming from the tour routes

// Require all users to be logged in to access review routes
router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    reviewController.setTourUserIds,
    authController.checkReviewer,
    reviewController.createReview,
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    reviewController.setTourUserIds,
    authController.restrictTo('user', 'admin'),
    authController.checkReviewer,
    reviewController.updateReview,
  )
  .delete(
    authController.checkReviewer,
    reviewController.deleteReview,
  );

// POST /tour/1234/reviews
// GET /tour/1234/reviews
// GET /tour/1234/reviews/5678

router
  .route('/:tourId/reviews')
  .post(
    reviewController.setTourUserIds,
    authController.checkReviewer,
    reviewController.createReview,
  );

module.exports = router;
