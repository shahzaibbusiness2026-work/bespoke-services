import { Router, Response, NextFunction } from 'express';
import { OrderRepository } from '../repositories/orderRepository';
import { optionalAuth, AuthenticatedRequest } from '../middleware/auth';

export const orderRouter = Router();

// POST /api/orders - Place an order with server validation
orderRouter.post('/', optionalAuth, (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { customer, shippingMethod, paymentMethod, items, appliedPromoCode, appliedGiftWrap } = req.body;

    if (!customer || !customer.email || !customer.address) {
      res.status(400).json({
        success: false,
        error: 'Complete delivery details and customer email are required.',
      });
      return;
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({
        success: false,
        error: 'Cannot place order with an empty shopping bag.',
      });
      return;
    }

    if (!shippingMethod || !shippingMethod.id) {
      res.status(400).json({
        success: false,
        error: 'Delivery protocol must be selected.',
      });
      return;
    }

    const order = OrderRepository.create({
      customer,
      shippingMethod,
      paymentMethod: paymentMethod || 'Visa Platinum •••• 4892',
      items,
      appliedPromoCode,
      appliedGiftWrap,
    });

    res.status(201).json({
      success: true,
      message: 'Order registered successfully with Atelier vault.',
      data: order,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders - Get orders for user (either from JWT or query ?email=...)
orderRouter.get('/', optionalAuth, (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userEmail = req.user?.email || (req.query.email ? String(req.query.email) : undefined);

    if (!userEmail) {
      // If admin, return all
      if (req.user?.role === 'admin') {
        const all = OrderRepository.findAll();
        res.json({ success: true, data: all });
        return;
      }

      res.status(401).json({
        success: false,
        error: 'Please log in or provide an email to view order history.',
      });
      return;
    }

    const orders = OrderRepository.findByEmail(userEmail);
    res.json({
      success: true,
      data: orders,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/:id - Get order by ID
orderRouter.get('/:id', (req, res, next: NextFunction) => {
  try {
    const order = OrderRepository.findById(req.params.id);
    if (!order) {
      res.status(404).json({
        success: false,
        error: `Order with ID '${req.params.id}' was not found.`,
      });
      return;
    }
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
});
