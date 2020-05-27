const passport = require('passport');

exports.onlyAuthUser = passport.authenticate('jwt', { session: false });

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
  return res.json({ status: 'You are now logged out!' });
};
