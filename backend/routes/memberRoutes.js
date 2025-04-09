const express = require('express');
const router = express.Router();
const { 
  getAllMembers, 
  getMember, 
  createMember, 
  updateMember, 
  deleteMember 
} = require('../controllers/memberController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', getAllMembers);
router.get('/:id', getMember);

// Protected routes
router.post('/', protect, authorize('admin'), upload.single('image'), createMember);
router.put('/:id', protect, authorize('admin'), upload.single('image'), updateMember);
router.delete('/:id', protect, authorize('admin'), deleteMember);

module.exports = router; 