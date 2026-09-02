import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { UserRepository } from '../repositories/userRepository';
import { User } from '../types';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export const authenticateUser = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Authentication token required.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const decoded = AuthService.verifyToken(token);

  if (!decoded || !decoded.id) {
    res.status(401).json({ success: false, error: 'Invalid or expired session token.' });
    return;
  }

  const userRecord = UserRepository.findById(decoded.id);
  if (!userRecord) {
    res.status(401).json({ success: false, error: 'User account not found.' });
    return;
  }

  req.user = UserRepository.toPublicUser(userRecord);
  next();
};

export const optionalAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const decoded = AuthService.verifyToken(token);
    if (decoded && decoded.id) {
      const userRecord = UserRepository.findById(decoded.id);
      if (userRecord) {
        req.user = UserRepository.toPublicUser(userRecord);
      }
    }
  }
  next();
};

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({
      success: false,
      error: 'Restricted access: Master Atelier administrator privileges required.',
    });
    return;
  }
  next();
};
