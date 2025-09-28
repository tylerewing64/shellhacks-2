const AuthService = require('../services/AuthService');
const ApiResponse = require('../views/ApiResponse');

class AuthController {
  static async register(req, res) {
    try {
      const { email, password, firstName, lastName, phone } = req.body;
      
      // Validate required fields
      if (!email || !password || !firstName || !lastName) {
        return ApiResponse.error(res, 'Missing required fields', 400);
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return ApiResponse.error(res, 'Invalid email format', 400);
      }
      
      // Validate password strength
      if (password.length < 6) {
        return ApiResponse.error(res, 'Password must be at least 6 characters', 400);
      }
      
      const userId = await AuthService.createUser({
        email,
        password,
        firstName,
        lastName,
        phone
      });
      
      // Generate JWT token
      const token = AuthService.generateToken({ id: userId, email });
      
      return ApiResponse.success(res, {
        message: 'User created successfully',
        token,
        user: {
          id: userId,
          email,
          firstName,
          lastName
        }
      }, 201);
      
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.message === 'User already exists') {
        return ApiResponse.error(res, 'User already exists', 400);
      }
      
      return ApiResponse.error(res, 'Internal server error', 500);
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Validate required fields
      if (!email || !password) {
        return ApiResponse.error(res, 'Email and password are required', 400);
      }
      
      const user = await AuthService.findUserByEmail(email);
      
      if (!user) {
        return ApiResponse.error(res, 'Invalid credentials', 401);
      }
      
      const validPassword = await AuthService.verifyPassword(user.id, password);
      
      if (!validPassword) {
        return ApiResponse.error(res, 'Invalid credentials', 401);
      }
      
      // Generate JWT token
      const token = AuthService.generateToken(user);
      
      return ApiResponse.success(res, {
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name
        }
      });
      
    } catch (error) {
      console.error('Login error:', error);
      return ApiResponse.error(res, 'Internal server error', 500);
    }
  }

  static async verifyToken(req, res) {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        return ApiResponse.unauthorized(res, 'Access token required');
      }

      const decoded = AuthService.verifyToken(token);
      
      return ApiResponse.success(res, {
        message: 'Token is valid',
        user: {
          userId: decoded.userId,
          email: decoded.email
        }
      });
      
    } catch (error) {
      console.error('Token verification error:', error);
      return ApiResponse.forbidden(res, 'Invalid token');
    }
  }
}

module.exports = AuthController;
