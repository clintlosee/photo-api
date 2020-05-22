const mongoose = require('mongoose');
const passport = require('passport');
const User = require('../models/User');

// Get user
exports.getUser = async (req, res) => {
  res.send(req.params.id);
};

// Get current user
exports.getCurrentUser = function(req, res, next) {
  const { user } = req;

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

exports.login = function(req, res, next) {
  const { email, password } = req.body;

  if (!email) {
    return res.status(422).json({
      errors: {
        email: 'Email is required',
        message: 'Email is required',
      },
    });
  }

  if (!password) {
    return res.status(422).json({
      errors: {
        password: 'Password is required',
        message: 'Password is required',
      },
    });
  }

  return passport.authenticate('local', { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(422).send({
        errors: {
          message: 'Invalid password or email!',
        },
      });
    }

    return res.json(user.toAuthJSON());
  })(req, res, next);
};

exports.logout = function(req, res) {
  req.logout();
  return res.json({ status: 'Session destroyed' });
};

//* Middleware to get user id from req
exports.getUserId = async (req, res, next) => {
  const userId = req.params.id;

  let user;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'No user found for this id' });
    }

    user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Cannot find user' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.user = user;
  next();
};
