const express = require('express');
const router = express.Router();
const { 
  getAllMembers, 
  getMember, 
  createMember, 
  updateMember, 
  deleteMember 
} = require('../controllers/memberController');
const { authenticateUser, authorizePermissions } = require('../middleware/authentication');

// Public routes
router.route('/').get(getAllMembers);
router.route('/:id').get(getMember);

// Protected routes
router.route('/').post(authenticateUser, authorizePermissions('admin'), createMember);
router.route('/:id')
  .put(authenticateUser, authorizePermissions('admin'), updateMember)
  .delete(authenticateUser, authorizePermissions('admin'), deleteMember);

module.exports = router; 