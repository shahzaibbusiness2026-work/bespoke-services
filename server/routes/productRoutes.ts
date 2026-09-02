import { Router, Request, Response, NextFunction } from 'express';
import { ProductRepository } from '../repositories/productRepository';
import { authenticateUser, requireAdmin } from '../middleware/auth';

export const productRouter = Router();

// GET /api/products - List products with rich filtering, search & pagination
productRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, inStock, search, minPrice, maxPrice, sort, limit, offset } = req.query;

    const result = ProductRepository.findAll({
      category: category ? String(category) : undefined,
      inStock: inStock !== undefined ? inStock === 'true' : undefined,
      search: search ? String(search) : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sort: sort as any,
      limit: limit ? Number(limit) : 50,
      offset: offset ? Number(offset) : 0,
    });

    res.json({
      success: true,
      data: result.products,
      meta: {
        total: result.total,
        count: result.products.length,
        offset: Number(offset || 0),
        limit: Number(limit || 50),
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/featured - Featured and bestseller items
productRouter.get('/featured', (_req: Request, res: Response, next: NextFunction) => {
  try {
    const featured = ProductRepository.getFeatured();
    res.json({ success: true, data: featured });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/categories - Category list with counts
productRouter.get('/categories', (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = ProductRepository.getCategories();
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/lookbooks - Editorial runway lookbooks & pins
productRouter.get('/lookbooks', (_req: Request, res: Response, next: NextFunction) => {
  try {
    const lookbooks = ProductRepository.getLookbooks();
    res.json({ success: true, data: lookbooks });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id - Single product details
productRouter.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = ProductRepository.findById(req.params.id);
    if (!product) {
      res.status(404).json({ success: false, error: `Product with ID '${req.params.id}' not found.` });
      return;
    }
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
});

// POST /api/products - Create a new product (Admin only)
productRouter.post('/', authenticateUser, requireAdmin, (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, subtitle, category, price, description } = req.body;

    if (!name || !category || price === undefined) {
      res.status(400).json({
        success: false,
        error: 'Product name, category, and price are required.',
      });
      return;
    }

    const created = ProductRepository.create(req.body);
    res.status(201).json({
      success: true,
      message: `Product '${created.name}' created in catalog.`,
      data: created,
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/products/:id - Update product details (Admin only)
productRouter.put('/:id', authenticateUser, requireAdmin, (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = ProductRepository.update(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ success: false, error: `Product with ID '${req.params.id}' not found.` });
      return;
    }
    res.json({
      success: true,
      message: `Product '${updated.name}' updated successfully.`,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/products/:id - Remove product (Admin only)
productRouter.delete('/:id', authenticateUser, requireAdmin, (req: Request, res: Response, next: NextFunction) => {
  try {
    const removed = ProductRepository.delete(req.params.id);
    if (!removed) {
      res.status(404).json({ success: false, error: `Product with ID '${req.params.id}' not found.` });
      return;
    }
    res.json({
      success: true,
      message: `Product removed from catalog.`,
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/products/:id/status - Quick toggle inStock or featured (Admin only)
productRouter.patch('/:id/status', authenticateUser, requireAdmin, (req: Request, res: Response, next: NextFunction) => {
  try {
    const { field } = req.body;
    if (!field || !['inStock', 'featured'].includes(field)) {
      res.status(400).json({ success: false, error: "Field must be 'inStock' or 'featured'." });
      return;
    }

    const updated = ProductRepository.toggleStatus(req.params.id, field);
    if (!updated) {
      res.status(404).json({ success: false, error: `Product with ID '${req.params.id}' not found.` });
      return;
    }
    res.json({
      success: true,
      message: `Product ${field} status updated.`,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
});
