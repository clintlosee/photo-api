const mongoose = require('mongoose');
const Portfolio = require('../models/Portfolio');

// Get all
exports.getAllPortfolioItems = async (req, res) => {
  try {
    const portfolios = await Portfolio.find();
    res.json(portfolios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get one
exports.getPortfolioItem = async (req, res) => {
  res.send(res.portfolio);
};

// Create one
exports.createPortfolioItem = async (req, res) => {
  const portfolioItem = new Portfolio({
    name: req.body.name,
    description: req.body.description,
  });

  try {
    const newPortfolioItem = await portfolioItem.save();
    res.status(201).json(newPortfolioItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update one
exports.updatePortfolioItem = async (req, res) => {
  if (req.body.name) {
    res.portfolio.name = req.body.name;
  }
  if (req.body.description) {
    res.portfolio.description = req.body.description;
  }

  try {
    const updatedPortfolio = await res.portfolio.save();
    res.json(updatedPortfolio);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

// Delete one
exports.deletePortfolioItem = async (req, res) => {
  try {
    await res.portfolio.remove();
    res.json({ message: 'Deleted portfolio item' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

//* Middleware to get portfolio id from req
exports.getPortfolio = async (req, res, next) => {
  const portfolioId = req.params.id;

  let portfolio;
  try {
    if (!mongoose.Types.ObjectId.isValid(portfolioId)) {
      return res.status(400).json({ message: 'No portfolio item for this id' });
    }

    portfolio = await Portfolio.findById(portfolioId);
    if (!portfolio) {
      return res.status(404).json({ message: 'Cannot find portfolio item' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.portfolio = portfolio;
  next();
};
