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
  const members = await Member.find({ active: true }).sort('priority');
  res.status(StatusCodes.OK).json({ members, count: members.length });
};

// @desc    Get single member
// @route   GET /api/members/:id
// @access  Public
const getMember = async (req, res) => {
  const { id: memberId } = req.params;
  const member = await Member.findOne({ _id: memberId });

  if (!member) {
    throw new NotFoundError(`No member found with id: ${memberId}`);
  }

  res.status(StatusCodes.OK).json({ member });
};

// @desc    Update member
// @route   PUT /api/members/:id
// @access  Private (Admin)
const updateMember = async (req, res) => {
  const { id: memberId } = req.params;
  
  const member = await Member.findOneAndUpdate(
    { _id: memberId }, 
    req.body, 
    { new: true, runValidators: true }
  );

  if (!member) {
    throw new NotFoundError(`No member found with id: ${memberId}`);
  }

  res.status(StatusCodes.OK).json({ member });
};

// @desc    Delete member
// @route   DELETE /api/members/:id
// @access  Private (Admin)
const deleteMember = async (req, res) => {
  const { id: memberId } = req.params;
  
  const member = await Member.findOneAndDelete({ _id: memberId });

  if (!member) {
    throw new NotFoundError(`No member found with id: ${memberId}`);
  }

  res.status(StatusCodes.OK).json({ msg: 'Member removed successfully' });
};

module.exports = {
  getAllMembers,
  getMember,
  createMember,
  updateMember,
  deleteMember,
}; 