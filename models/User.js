const mongoose = require('mongoose');

// mongoose.Promise = global.Promise;
const { Schema } = mongoose;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const userSchema = new Schema(
  {
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
    // images: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Image',
    //   },
    // ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

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
    gravatar: this.gravatar,
    images: this.images, // TODO populate images
    token: this.generateJWT(),
  };
};

userSchema.virtual('gravatar').get(function() {
  const hash = md5(this.email);
  return `https://gravatar.com/avatar/${hash}?s=200`;
});

// Find reviews where the stores _id property === the reviews store property
userSchema.virtual('images', {
  ref: 'Image',
  localField: '_id',
  foreignField: 'creator',
});

function autopopulate(next) {
  this.populate('images');
  next();
}

userSchema.pre('find', autopopulate);
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);

// exports.getMeetups = function(req, res) {
//   Meetup.find({})
//     .populate('category')
//     .populate('joinedPeople')
//     .exec((errors, meetups) => {
//       if (errors) {
//         return res.status(422).send({ errors });
//       }

//       return res.json(meetups);
//     });
// };

// exports.getMeetupById = function(req, res) {
//   const { id } = req.params;

//   Meetup.findById(id)
//     .populate('meetupCreator', 'name id avatar')
//     .populate('category')
//     .populate({ path: 'joinedPeople', options: { limit: 5, sort: { username: -1 } } })
//     .exec((errors, meetup) => {
//       if (errors) {
//         return res.status(422).send({ errors });
//       }

//       return res.json(meetup);
//     });
// };
