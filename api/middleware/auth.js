const AuthService = require('../services/AuthService');
const ApiResponse = require('../views/ApiResponse');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return ApiResponse.unauthorized(res, 'Access token required');
  }

  try {
    const user = AuthService.verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    return ApiResponse.forbidden(res, 'Invalid token');
  }
};

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const user = AuthService.verifyToken(token);
      req.user = user;
    } catch (error) {
      // Token is invalid, but continue without user
    }
  }
  next();
};

module.exports = {
  authenticateToken,
  optionalAuth
};
