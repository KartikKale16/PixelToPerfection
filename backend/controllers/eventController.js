const Event = require('../models/Event');

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (Admin)
exports.createEvent = async (req, res, next) => {
  try {
    // Check if user exists
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    // Add organizer (current user) to the event data
    req.body.organizer = req.user.id;

    // Handle tags (convert comma-separated string to array if needed)
    if (req.body.tags && typeof req.body.tags === 'string') {
      req.body.tags = req.body.tags.split(',').map(tag => tag.trim());
    }

    // Handle date-time strings
    if (req.body.startDate && req.body.startTime) {
      req.body.startDateTime = new Date(`${req.body.startDate}T${req.body.startTime}`);
      // Remove the individual fields
      delete req.body.startDate;
      delete req.body.startTime;
    }
    
    if (req.body.endDate && req.body.endTime) {
      req.body.endDateTime = new Date(`${req.body.endDate}T${req.body.endTime}`);
      // Remove the individual fields
      delete req.body.endDate;
      delete req.body.endTime;
    }

    // Handle image upload
    if (req.file) {
      // In a production environment, you might use a cloud storage service
      // For simplicity, we'll use a local path here
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      req.body.image = `${baseUrl}/uploads/${req.file.filename}`;
    }

    // Create event
    const event = await Event.create(req.body);

    res.status(201).json({
      success: true,
      event
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res, next) => {
  try {
    // Initialize query
    let query = Event.find();

    // Implement filtering
    if (req.query.tag) {
      query = query.find({ tags: { $in: [req.query.tag] } });
    }

    // Sort by date
    if (req.query.sort === 'upcoming') {
      query = query.find({ startDateTime: { $gte: new Date() } }).sort('startDateTime');
    } else if (req.query.sort === 'past') {
      query = query.find({ startDateTime: { $lt: new Date() } }).sort('-startDateTime');
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Event.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Populate organizer
    query = query.populate('organizer', 'username fullName');

    // Execute query
    const events = await query;

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
      count: events.length,
      pagination,
      data: events
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'username fullName');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Admin and Event Organizer)
exports.updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Ensure user is event organizer or admin
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event'
      });
    }

    // Handle tags (convert comma-separated string to array if needed)
    if (req.body.tags && typeof req.body.tags === 'string') {
      req.body.tags = req.body.tags.split(',').map(tag => tag.trim());
    }

    // Handle date-time strings
    if (req.body.startDate && req.body.startTime) {
      req.body.startDateTime = new Date(`${req.body.startDate}T${req.body.startTime}`);
      // Remove the individual fields
      delete req.body.startDate;
      delete req.body.startTime;
    }
    
    if (req.body.endDate && req.body.endTime) {
      req.body.endDateTime = new Date(`${req.body.endDate}T${req.body.endTime}`);
      // Remove the individual fields
      delete req.body.endDate;
      delete req.body.endTime;
    }

    // Handle image upload
    if (req.file) {
      // In a production environment, you might use a cloud storage service
      // For simplicity, we'll use a local path here
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      req.body.image = `${baseUrl}/uploads/${req.file.filename}`;
    }

    // Update event
    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('organizer', 'username fullName');

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Admin and Event Organizer)
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Ensure user is event organizer or admin
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event'
      });
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}; 