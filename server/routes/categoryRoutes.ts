import { Router, Request, Response, NextFunction } from 'express';
import { CategoryRepository } from '../repositories/categoryRepository';
import { authenticateUser, requireAdmin } from '../middleware/auth';

export const categoryRouter = Router();

// GET /api/categories - Public listing of categories with inventory counts
categoryRouter.get('/', (_req: Request, res: Response, next: NextFunction) => {
  try {
    const list = CategoryRepository.getAll();
    res.json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
});

// POST /api/categories - Add a new category (Admin only)
categoryRouter.post('/', authenticateUser, requireAdmin, (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ success: false, error: 'Category name is required.' });
      return;
    }

    const created = CategoryRepository.create(name);
    res.status(201).json({
      success: true,
      message: `Category '${created}' created successfully.`,
      data: created,
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/categories/:name - Remove a category (Admin only)
categoryRouter.delete('/:name', authenticateUser, requireAdmin, (req: Request, res: Response, next: NextFunction) => {
  try {
    const removed = CategoryRepository.delete(req.params.name);
    if (!removed) {
      res.status(404).json({ success: false, error: `Category '${req.params.name}' not found.` });
      return;
    }
    res.json({
      success: true,
      message: `Category '${req.params.name}' removed successfully.`,
    });
  } catch (err) {
    next(err);
  }
});
