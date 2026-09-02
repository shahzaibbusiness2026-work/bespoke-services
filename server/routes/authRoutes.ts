import { Router, Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { UserRepository } from '../repositories/userRepository';
import { authenticateUser, AuthenticatedRequest } from '../middleware/auth';

export const authRouter = Router();

// POST /api/auth/register
authRouter.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    if (!firstName || !lastName || !email) {
      res.status(400).json({
        success: false,
        error: 'First name, last name, and email are required.',
      });
      return;
    }

    const { user, token } = await AuthService.register({
      firstName,
      lastName,
      email,
      password,
      phone,
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      data: { user, token },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
authRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        error: 'Email is required for authentication.',
      });
      return;
    }

    const { user, token } = await AuthService.login(email, password);

    res.json({
      success: true,
      message: 'Authentication successful.',
      data: { user, token },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me - Retrieve current authenticated profile
authRouter.get('/me', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    data: req.user,
  });
});

// PUT /api/auth/profile - Update user profile
authRouter.put('/profile', authenticateUser, (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const updated = UserRepository.updateProfile(req.user!.id, req.body);
    if (!updated) {
      res.status(404).json({ success: false, error: 'User account not found.' });
      return;
    }
    res.json({
      success: true,
      message: 'Profile updated successfully.',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/address - Add new address
authRouter.post('/address', authenticateUser, (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const newAddress = UserRepository.addAddress(req.user!.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Address saved to address book.',
      data: newAddress,
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/auth/address/:id - Edit address
authRouter.put('/address/:id', authenticateUser, (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const updatedAddress = UserRepository.updateAddress(req.user!.id, req.params.id, req.body);
    if (!updatedAddress) {
      res.status(404).json({ success: false, error: 'Address record not found.' });
      return;
    }
    res.json({
      success: true,
      message: 'Address updated successfully.',
      data: updatedAddress,
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/auth/address/:id - Remove address
authRouter.delete('/address/:id', authenticateUser, (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const deleted = UserRepository.deleteAddress(req.user!.id, req.params.id);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Address record not found.' });
      return;
    }
    res.json({
      success: true,
      message: 'Address removed successfully.',
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/auth/address/:id/default - Set default address
authRouter.put('/address/:id/default', authenticateUser, (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    UserRepository.setDefaultAddress(req.user!.id, req.params.id);
    res.json({
      success: true,
      message: 'Default address updated.',
    });
  } catch (err) {
    next(err);
  }
});
