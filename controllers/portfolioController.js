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
// Delete one
