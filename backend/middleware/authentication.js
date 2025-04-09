const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const authenticateUser = async (req, res, next) => {
  // Check header for token
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication invalid'
    });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Attach the user to the request object
    req.user = {
      id: payload.userId,
      name: payload.name,
      role: payload.role
    };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication invalid'
    });
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to access this route'
      });
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  authorizePermissions,
}; 