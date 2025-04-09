const path = require('path');
const multer = require('multer');

// Set storage engine for CSV files
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function(req, file, cb) {
    cb(null, `csv-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Check file type for CSV
const fileFilter = (req, file, cb) => {
  // Allow CSV files
  if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
    cb(null, true);
  } else {
    cb(new Error('Please upload a CSV file'), false);
  }
};

// Initialize CSV upload
const csvUpload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB max file size
  fileFilter: fileFilter
});

module.exports = csvUpload; 