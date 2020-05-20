const mongoose = require('mongoose');
const User = require('../models/User');

// Get user
exports.getUser = async (req, res) => {
  res.send(req.params.id);
};

//* Middleware to get user id from req
exports.getUserId = async (req, res, next) => {
  const userId = req.params.id;

  let portfolio;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'No user found for this id' });
    }

    portfolio = await User.findById(userId);
    if (!portfolio) {
      return res.status(404).json({ message: 'Cannot find user' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.portfolio = portfolio;
  next();
};
