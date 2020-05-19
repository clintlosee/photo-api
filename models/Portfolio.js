const mongoose = require('mongoose');
const slug = require('slugs');

const portfolioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: String,
  description: {
    type: String,
    trim: true,
  },
  createdDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

portfolioSchema.pre('save', async function(next) {
  if (!this.isModified('name')) {
    next(); // skip it
    return; // stop function from running
  }
  this.slug = slug(this.name);
  // find other stores with slug of same name or name-1, etc
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const portfoliosWithSlug = await this.constructor.find({ slug: slugRegEx });
  if (portfoliosWithSlug.length) {
    this.slug = `${this.slug}-${portfoliosWithSlug.length + 1}`;
  }
  next();
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
