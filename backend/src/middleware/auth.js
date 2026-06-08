import { verifyToken } from '../utils/jwt.js';
import { User } from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new AppError('Missing or invalid authorization header', 401, 'Unauthorized');
    }

    const token = header.slice(7);
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new AppError('User not found', 401, 'Unauthorized');
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    if (error.isOperational) {
      return res.status(error.statusCode).json({
        success: false,
        error: error.error,
        message: error.message,
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token',
    });
  }
}
