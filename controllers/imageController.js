const mongoose = require('mongoose');
const Image = require('../models/Image');

//* Get all images
exports.getAllImages = async (req, res) => {
  try {
    const images = await Image.find();
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//* Get one image
exports.getImage = async (req, res) => {
  res.send(res.image);
};

//* Create one image
exports.createImage = async (req, res) => {
  const imageData = req.body;

  if (!imageData.name) {
    return res.status(422).json({
      errors: {
        name: 'Name is required',
        message: 'Name is required',
      },
    });
  }
  if (!imageData.creator) {
    return res.status(422).json({
      errors: {
        creator: 'Creator is required',
        message: 'Creator is required',
      },
    });
  }

  const image = new Image(imageData);

  try {
    await image.save((errors, savedImage) => {
      if (errors) {
        return res.status(422).json({ message: errors });
      }
      return res.status(201).json(savedImage);
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//* Create one image
exports.createNewImage = async (req, res) => {
  const { user } = req;
  const imageData = req.body;

  if (!imageData.name) {
    return res.status(422).json({
      errors: {
        name: 'Image name is required',
        message: 'Image name is required',
      },
    });
  }
  if (!user) {
    return res.status(422).json({
      errors: {
        creator: 'User is required',
        message: 'User is required',
      },
    });
  }

  const image = new Image({ ...imageData, creator: user });

  try {
    await image.save((errors, savedImage) => {
      if (errors) {
        return res.status(422).json({ message: errors });
      }
      return res.status(201).json(savedImage);
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//* Update one image
exports.updateImage = async (req, res) => {
  if (req.body.name) {
    res.image.name = req.body.name;
  }
  if (req.body.description) {
    res.image.description = req.body.description;
  }
  res.image.updatedAt = Date.now();

  try {
    const updatedImage = await res.image.save();
    res.json(updatedImage);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

//* Delete one image
exports.deleteImage = async (req, res) => {
  try {
    await res.image.remove();
    res.json({ message: 'Deleted image' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

//* Middleware to get image id from req
exports.findImage = async (req, res, next) => {
  const imageId = req.params.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(imageId)) {
      return res.status(400).json({ message: 'No image for this id' });
    }

    await Image.findById(imageId)
      .populate('creator')
      .exec((errors, image) => {
        console.log('image:', image);
        if (errors) {
          return res.status(422).send({ message: errors });
        }
        if (!image) {
          return res.status(404).json({ message: 'Cannot find image' });
        }
        res.image = image;
        next();
      });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
