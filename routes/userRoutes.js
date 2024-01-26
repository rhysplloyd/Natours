const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post(
  '/forgotPassword',
  authController.forgotPassword,
);
router.patch(
  '/resetPassword/:token',
  authController.resetPassword,
);

// DO NOT PLACE PROTECTED ROUTES ABOVE THIS LINE
// Protects all subsequent router middlewares in this file.
router.use(authController.protect);

router.patch(
  '/changePassword',
  authController.changePassword,
);

router.get(
  '/me',
  userController.getMe,
  userController.getUser,
);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe,
);
router.delete('/deactivate', userController.deleteMe);

// Admin restricted routes
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
