import { Router, Request, Response, NextFunction } from 'express';
import { PromoRepository } from '../repositories/promoRepository';

export const promoRouter = Router();

// POST /api/promo/validate
promoRouter.post('/validate', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, subtotal } = req.body;
    const result = PromoRepository.validate(code, Number(subtotal || 0));

    if (!result.valid) {
      res.status(400).json({
        success: false,
        error: result.message,
      });
      return;
    }

    res.json({
      success: true,
      message: result.message,
      data: result.promo,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/promo - List public promos
promoRouter.get('/', (_req: Request, res: Response, next: NextFunction) => {
  try {
    const list = PromoRepository.findAll();
    res.json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
});
