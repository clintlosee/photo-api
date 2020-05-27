const mongoose = require('mongoose');
// const passport = require('passport');
const User = require('../models/User');

// Get user
exports.getUser = async (req, res) => {
  res.send(req.params.id);
};

// Get user with all images
exports.getUserAllImages = async (req, res) => {
  const { user } = res;
  // const foundUser = await User.findOne({ _id: req.params.id }).populate('img');
  res.json(user);
};

// Get current user
exports.getCurrentUser = function(req, res, next) {
  const { user } = res;

  if (!user) {
    return res.sendStatus(422);
  }

  return res.json(user.toAuthJSON());
};

// Create user
exports.createUser = async (req, res) => {
  const userData = req.body;

  if (!userData.email) {
    return res.status(422).json({
      errors: {
        email: 'Email is required',
        message: 'Email is required',
      },
    });
  }

  if (!userData.password) {
    return res.status(422).json({
      errors: {
        password: 'Password is required',
        message: 'Password is required',
      },
    });
  }

  if (userData.password !== userData.passwordConfirmation) {
    return res.status(422).json({
      errors: {
        password: 'Passwords do not match',
        message: 'Passwords do not match',
      },
    });
  }

  const user = new User(userData);

  try {
    user.save((errors, savedUser) => {
      if (errors) {
        return res.status(422).json({ errors });
      }
      return res.status(201).json(savedUser);
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//* Middleware to get user id from req
exports.getUserId = async (req, res, next) => {
  const userId = req.params.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'No user found for this id' });
    }

    await User.find({ _id: userId }).exec((errors, user) => {
      if (errors) {
        return res.status(422).send({ message: errors });
      }
      if (!user) {
        return res.status(404).json({ message: 'Cannot find user' });
      }
      res.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
