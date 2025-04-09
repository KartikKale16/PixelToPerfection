const Gallery = require('../models/Gallery');

// @desc    Create a new gallery image
// @route   POST /api/gallery
// @access  Private (Admin)
exports.createGalleryImage = async (req, res, next) => {
  try {
    // Check if user exists
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    // Add uploader to the gallery data
    req.body.uploadedBy = req.user.id;

    // Handle image upload
    if (req.file) {
      // Create URL for the uploaded image
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      req.body.imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
    } else if (!req.body.imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image or provide an image URL'
      });
    }

    // Create gallery image
    const galleryImage = await Gallery.create(req.body);

    res.status(201).json({
      success: true,
      data: galleryImage
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all gallery images
// @route   GET /api/gallery
// @access  Public
exports.getGalleryImages = async (req, res, next) => {
  try {
    // Initialize query
    let query = Gallery.find();

    // Filter by category if provided
    if (req.query.category) {
      query = query.find({ category: req.query.category });
    }

    // Sort by date (newest first by default)
    query = query.sort('-createdAt');

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Gallery.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Populate uploader info
    query = query.populate('uploadedBy', 'username fullName');

    // Execute query
    const galleryImages = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: galleryImages.length,
      pagination,
      data: galleryImages
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single gallery image
// @route   GET /api/gallery/:id
// @access  Public
exports.getGalleryImage = async (req, res, next) => {
  try {
    const galleryImage = await Gallery.findById(req.params.id).populate('uploadedBy', 'username fullName');

    if (!galleryImage) {
      return res.status(404).json({
        success: false,
        message: 'Gallery image not found'
      });
    }

    res.status(200).json({
      success: true,
      data: galleryImage
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update gallery image
// @route   PUT /api/gallery/:id
// @access  Private (Admin)
exports.updateGalleryImage = async (req, res, next) => {
  try {
    let galleryImage = await Gallery.findById(req.params.id);

    if (!galleryImage) {
      return res.status(404).json({
        success: false,
        message: 'Gallery image not found'
      });
    }

    // Ensure user is admin or the uploader
    if (galleryImage.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this gallery image'
      });
    }

    // Handle new image upload
    if (req.file) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      req.body.imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
    }

    // Update gallery image
    galleryImage = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('uploadedBy', 'username fullName');

    res.status(200).json({
      success: true,
      data: galleryImage
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete gallery image
// @route   DELETE /api/gallery/:id
// @access  Private (Admin)
exports.deleteGalleryImage = async (req, res, next) => {
  try {
    const galleryImage = await Gallery.findById(req.params.id);

    if (!galleryImage) {
      return res.status(404).json({
        success: false,
        message: 'Gallery image not found'
      });
    }

    // Ensure user is admin or the uploader
    if (galleryImage.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this gallery image'
      });
    }

    await galleryImage.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Gallery image deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}; 