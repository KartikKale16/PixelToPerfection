const express = require('express');
const router = express.Router();
const { 
  getAllStudents, 
  getStudent, 
  createStudent, 
  updateStudent, 
  deleteStudent,
  importStudentsCSV
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const csvUpload = require('../middleware/csvUpload');

// Public routes
router.get('/', getAllStudents);
router.get('/:id', getStudent);
router.post('/', upload.single('image'), createStudent);
router.post('/import-csv', csvUpload.single('csvFile'), importStudentsCSV);

// Protected routes
router.put('/:id', protect, authorize('admin'), upload.single('image'), updateStudent);
router.delete('/:id', protect, authorize('admin'), deleteStudent);

module.exports = router; 