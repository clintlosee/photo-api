const mongoose = require('mongoose');

// mongoose.Promise = global.Promise;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
// const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Please Supply a Name',
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Invalid Email Address'],
    required: 'Please Supply an Email Address',
  },
  password: {
    type: String,
    minlength: [4, 'Too short, min is 4 characters'],
    maxlength: [32, 'Too long, max is 32 characters'],
    required: 'Password is required',
  },
  // resetPasswordToken: String,
  // resetPasswordExpires: Date,
});

userSchema.pre('save', function(next) {
  const user = this;

  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) {
        return next(err);
      }

      user.password = hash;
      next();
    });
  });
});

// Every user have access to this methods
userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return callback(err);
    }

    callback(null, isMatch);
  });
};

userSchema.methods.generateJWT = function() {
  return jwt.sign(
    {
      email: this.email,
      id: this._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

userSchema.methods.toAuthJSON = function() {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    token: this.generateJWT(),
  };
};

userSchema.virtual('gravatar').get(function() {
  const hash = md5(this.email);
  return `https://gravatar.com/avatar/${hash}?s=200`;
});

// userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);
