const Member = require('../models/Member');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

// @desc    Create a new member
// @route   POST /api/members
// @access  Private (Admin)
const createMember = async (req, res, next) => {
  try {
    // Check if user exists
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    // Add creator to the member data
    req.body.createdBy = req.user.id;

    // Handle image upload
    if (req.file) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      req.body.image = `${baseUrl}/uploads/${req.file.filename}`;
    }

    // Create member
    const member = await Member.create(req.body);

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: member
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all members
// @route   GET /api/members
// @access  Public
const getAllMembers = async (req, res) => {
  try {
    const members = await Member.find({ active: true })
                               .sort('priority')
                               .populate('createdBy', 'username fullName');
                               
    res.status(StatusCodes.OK).json({ 
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'Failed to fetch members'
    });
  }
};

// @desc    Get single member
// @route   GET /api/members/:id
// @access  Public
const getMember = async (req, res) => {
  try {
    const { id: memberId } = req.params;
    const member = await Member.findOne({ _id: memberId })
                             .populate('createdBy', 'username fullName');

    if (!member) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: `No member found with id: ${memberId}`
      });
    }

    res.status(StatusCodes.OK).json({ 
      success: true,
      data: member
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'Failed to fetch member'
    });
  }
};

// @desc    Update member
// @route   PUT /api/members/:id
// @access  Private (Admin)
const updateMember = async (req, res) => {
  try {
    const { id: memberId } = req.params;
    
    // Handle image upload
    if (req.file) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      req.body.image = `${baseUrl}/uploads/${req.file.filename}`;
    }

    const member = await Member.findOneAndUpdate(
      { _id: memberId }, 
      req.body, 
      { new: true, runValidators: true }
    ).populate('createdBy', 'username fullName');

    if (!member) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: `No member found with id: ${memberId}`
      });
    }

    res.status(StatusCodes.OK).json({ 
      success: true,
      data: member 
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'Failed to update member'
    });
  }
};

// @desc    Delete member
// @route   DELETE /api/members/:id
// @access  Private (Admin)
const deleteMember = async (req, res) => {
  try {
    const { id: memberId } = req.params;
    
    const member = await Member.findOneAndDelete({ _id: memberId });

    if (!member) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: `No member found with id: ${memberId}`
      });
    }

    res.status(StatusCodes.OK).json({ 
      success: true,
      message: 'Member removed successfully' 
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'Failed to delete member'
    });
  }
};

module.exports = {
  getAllMembers,
  getMember,
  createMember,
  updateMember,
  deleteMember,
}; 