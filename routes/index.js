const express = require('express');

const router = express.Router();
const userRouter = require('./userRoutes');
const portfolioRouter = require('./portfolioRoutes');

router.use(userRouter);
router.use(portfolioRouter);

module.exports = router;
