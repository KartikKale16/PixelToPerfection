const express = require('express');
const { 
  createGalleryImage, 
  getGalleryImages, 
  getGalleryImage, 
  updateGalleryImage, 
  deleteGalleryImage 
} = require('../controllers/galleryController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', getGalleryImages);
router.get('/:id', getGalleryImage);

// Protected routes - require authentication
router.post('/', protect, authorize('admin'), upload.single('image'), createGalleryImage);
router.put('/:id', protect, authorize('admin'), upload.single('image'), updateGalleryImage);
router.delete('/:id', protect, authorize('admin'), deleteGalleryImage);

module.exports = router; 