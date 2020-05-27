const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');

//* User Routes
router.get(
  '/user/:id',
  userController.getUserId,
  catchErrors(userController.getUser)
);
router.get('/me', authController.onlyAuthUser, userController.getCurrentUser);
router.get(
  '/user/:id/images',
  authController.onlyAuthUser,
  userController.getUserId,
  userController.getUserAllImages
);
router.post('/user/new', catchErrors(userController.createUser));
// router.post('/login', userController.login);
// router.post('/logout', userController.logout);

module.exports = router;
