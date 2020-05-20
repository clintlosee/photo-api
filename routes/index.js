const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
const portfolioController = require('../controllers/portfolioController');

const { catchErrors } = require('../handlers/errorHandlers');

//* User Routes
router.get(
  '/user/:id',
  userController.getUserId,
  catchErrors(userController.getUser)
);

//* Portfolio Routes
router.get('/portfolio', catchErrors(portfolioController.getAllPortfolioItems));

router.get(
  '/portfolio/:id',
  portfolioController.getPortfolio,
  catchErrors(portfolioController.getPortfolioItem)
);

router.post(
  '/portfolio/new',
  catchErrors(portfolioController.createPortfolioItem)
);

router.patch(
  '/portfolio/update/:id',
  portfolioController.getPortfolio,
  catchErrors(portfolioController.updatePortfolioItem)
);

router.delete(
  '/portfolio/delete/:id',
  portfolioController.getPortfolio,
  catchErrors(portfolioController.deletePortfolioItem)
);

module.exports = router;
