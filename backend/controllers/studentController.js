const Student = require('../models/Student');
const { StatusCodes } = require('http-status-codes');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({}).sort({ createdAt: -1 });
    res.status(StatusCodes.OK).json({ 
      success: true, 
      count: students.length, 
      data: students 
    });
  } catch (error) {
    console.error('Error getting students:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Failed to get students' 
    });
  }
};

// Get a single student
exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        message: 'Student not found' 
      });
    }
    
    res.status(StatusCodes.OK).json({ 
      success: true, 
      data: student 
    });
  } catch (error) {
    console.error('Error getting student:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Failed to get student' 
    });
  }
};

// Create a student
exports.createStudent = async (req, res) => {
  try {
    // Add createdBy field from the authenticated user if available
    if (req.user && req.user.userId) {
      req.body.createdBy = req.user.userId;
    }
    
    const student = await Student.create(req.body);
    
    res.status(StatusCodes.CREATED).json({ 
      success: true, 
      data: student 
    });
  } catch (error) {
    console.error('Error creating student:', error);
    
    // Handle duplicate key error (student ID already exists)
    if (error.code === 11000) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Student ID (Seat No.) already exists'
      });
    }
    
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Failed to create student: ' + error.message 
    });
  }
};

// Update a student
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        message: 'Student not found' 
      });
    }
    
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(StatusCodes.OK).json({ 
      success: true, 
      data: updatedStudent 
    });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Failed to update student' 
    });
  }
};

// Delete a student
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        message: 'Student not found' 
      });
    }
    
    await student.deleteOne();
    
    res.status(StatusCodes.OK).json({ 
      success: true, 
      message: 'Student deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Failed to delete student' 
    });
  }
};

// Import students from CSV
exports.importStudentsCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Please upload a CSV file'
      });
    }
    
    const results = [];
    const csvFilePath = path.join(__dirname, '..', 'uploads', req.file.filename);
    
    // Get createdBy from authenticated user if available
    const createdBy = req.user && req.user.userId ? req.user.userId : undefined;
    
    // Parse CSV file
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (data) => {
        // Extract name and seat number (student ID) from CSV
        if (data['Name'] && data['Seat No.']) {
          const studentData = {
            name: data['Name'],
            studentId: data['Seat No.'],
            active: true
          };
          
          // Add createdBy if available
          if (createdBy) {
            studentData.createdBy = createdBy;
          }
          
          results.push(studentData);
        }
      })
      .on('end', async () => {
        // Delete the CSV file after processing
        if (fs.existsSync(csvFilePath)) {
          fs.unlinkSync(csvFilePath);
        }
        
        if (results.length === 0) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'No valid data found in CSV or missing required columns (Name, Seat No.)'
          });
        }
        
        // Insert students in batch
        try {
          // Use insertMany with ordered: false to continue even if some insertions fail
          const insertResult = await Student.insertMany(results, { ordered: false });
          
          res.status(StatusCodes.OK).json({
            success: true,
            message: 'Students imported successfully',
            count: insertResult.length
          });
        } catch (error) {
          // Extract successfully inserted documents count
          const insertedCount = error.insertedDocs ? error.insertedDocs.length : 0;
          
          // If some documents were inserted but some failed (likely duplicates)
          if (insertedCount > 0) {
            return res.status(StatusCodes.PARTIAL_CONTENT).json({
              success: true,
              message: `${insertedCount} students imported successfully. Some entries were skipped due to duplicates.`,
              count: insertedCount
            });
          }
          
          // If all failed
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Failed to import students. All entries might be duplicates.'
          });
        }
      });
  } catch (error) {
    console.error('Error importing students from CSV:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to import students from CSV'
    });
  }
}; 