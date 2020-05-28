const express = require('express');

const router = express.Router();
const authController = require('../controllers/authController');
// const { catchErrors } = require('../handlers/errorHandlers');

router.post('/login', authController.login);
router.post('/logout', authController.logout);

module.exports = router;
