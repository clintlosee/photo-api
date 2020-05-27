const mongoose = require('mongoose');

const { Schema } = mongoose;
const slug = require('slugs');

const imageSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  slug: String,
  description: {
    type: String,
    trim: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  // mainImageName: {
  //   type: String,
  //   required: true,
  // },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

imageSchema.pre('save', async function(next) {
  if (!this.isModified('name')) {
    next(); // skip it
    return; // stop function from running
  }
  this.slug = slug(this.name);
  // find other images with slug of same name or name-1, etc
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const imageWithSlug = await this.constructor.find({ slug: slugRegEx });
  if (imageWithSlug.length) {
    this.slug = `${this.slug}-${imageWithSlug.length + 1}`;
  }
  next();
});

module.exports = mongoose.model('Image', imageSchema);
