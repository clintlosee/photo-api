const express = require('express');

const router = express.Router();
// const authController = require('../controllers/authController');
const imageController = require('../controllers/imageController');
const userController = require('../controllers/userController');

const { catchErrors } = require('../handlers/errorHandlers');

//* Image Routes
router.get('/images', catchErrors(imageController.getAllImages));

router.get(
  '/image/:id',
  imageController.findImage,
  catchErrors(imageController.getImage)
);

router.post(
  '/image/new',
  userController.getUserId,
  catchErrors(imageController.createImage)
);

router.patch(
  '/image/update/:id',
  imageController.findImage,
  catchErrors(imageController.updateImage)
);

router.delete(
  '/image/delete/:id',
  imageController.findImage,
  catchErrors(imageController.deleteImage)
);

module.exports = router;
