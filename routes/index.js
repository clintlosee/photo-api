const express = require('express');

const router = express.Router();
// const userController = require('../controllers/userController');
const portfolioController = require('../controllers/portfolioController');

const { catchErrors } = require('../handlers/errorHandlers');

router.get('/portfolio', catchErrors(portfolioController.getAllPortfolioItems));
router.post(
  '/newportfolio',
  catchErrors(portfolioController.createPortfolioItem)
);

module.exports = router;
