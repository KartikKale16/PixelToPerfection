const express = require('express');
const { 
  createEvent, 
  getEvents, 
  getEvent, 
  updateEvent, 
  deleteEvent 
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', getEvents);
router.get('/:id', getEvent);

// Protected routes - require authentication
router.post('/', protect, authorize('admin', 'member'), upload.single('image'), createEvent);
router.put('/:id', protect, upload.single('image'), updateEvent);
router.delete('/:id', protect, deleteEvent);

module.exports = router; 