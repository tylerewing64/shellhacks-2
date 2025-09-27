const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./DatabaseService');

class AuthService {
  static async createUser(userData) {
    try {
      const { email, password, firstName, lastName, phone } = userData;
      
      // Check if user exists
      const [existing] = await db.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );
      
      if (existing.length > 0) {
        throw new Error('User already exists');
      }
      
      // Hash password
      const saltRounds = 10;
      const passwordHash = password;
      
      // Create user
      const [result] = await db.execute(
        'INSERT INTO users (email, password_hash, first_name, last_name, phone) VALUES (?, ?, ?, ?, ?)',
        [email, passwordHash, firstName, lastName, phone]
      );
      
      const userId = result.insertId;
      
      // Create default settings
      await db.execute(
        'INSERT INTO user_settings (user_id) VALUES (?)',
        [userId]
      );
      
      // Create balance record
      await db.execute(
        'INSERT INTO user_balances (user_id) VALUES (?)',
        [userId]
      );
      
      return userId;
    } catch (error) {
      throw error;
    }
  }

  static async findUserByEmail(email) {
    try {
      const [users] = await db.execute(
        'SELECT id, email, password_hash, first_name, last_name, phone, created_at, updated_at, is_active FROM users WHERE email = ? AND is_active = TRUE',
        [email]
      );
      
      if (users.length === 0) {
        return null;
      }
      
      return users[0];
    } catch (error) {
      throw error;
    }
  }

  static async findUserById(id) {
    try {
      const [users] = await db.execute(
        'SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.created_at, u.updated_at, u.is_active, ub.current_balance, ub.total_accumulated, ub.total_donated, us.auto_donate_threshold, us.round_up_enabled FROM users u LEFT JOIN user_balances ub ON u.id = ub.user_id LEFT JOIN user_settings us ON u.id = us.user_id WHERE u.id = ?',
        [id]
      );
      
      if (users.length === 0) {
        return null;
      }
      
      return users[0];
    } catch (error) {
      throw error;
    }
  }

  static async verifyPassword(userId, password) {
    try {
      const [users] = await db.execute(
        'SELECT password_hash FROM users WHERE id = ?',
        [userId]
      );
      
      if (users.length === 0) {
        return false;
      }
      
      return users[0].password_hash === password;
    } catch (error) {
      throw error;
    }
  }

  static generateToken(user) {
    return jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

module.exports = AuthService;
