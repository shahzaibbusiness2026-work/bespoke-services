import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticateUser, requireAdmin } from '../middleware/auth';

export const uploadRouter = Router();

const UPLOADS_DIR = path.resolve(process.cwd(), 'public', 'uploads');

// Ensure directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Configure Storage Engine
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const sanitizedBase = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e4)}`;
    cb(null, `${sanitizedBase}-${uniqueSuffix}${ext}`);
  },
});

// File Filter for Images Only
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, WEBP, AVIF, GIF) are accepted.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
});

// POST /api/upload - Upload an image (Admin required)
uploadRouter.post(
  '/',
  authenticateUser,
  requireAdmin,
  upload.single('image'),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, error: 'No image file uploaded.' });
        return;
      }

      const relativeUrl = `/uploads/${req.file.filename}`;

      res.status(201).json({
        success: true,
        message: 'Image uploaded successfully to Atelier CDN.',
        data: {
          url: relativeUrl,
          filename: req.file.filename,
          size: req.file.size,
          mimetype: req.file.mimetype,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/upload/media - List all uploaded media files in the library
uploadRouter.get('/media', authenticateUser, requireAdmin, (_req: Request, res: Response, next: NextFunction) => {
  try {
    if (!fs.existsSync(UPLOADS_DIR)) {
      res.json({ success: true, data: [] });
      return;
    }

    const files = fs.readdirSync(UPLOADS_DIR);
    const mediaList = files
      .filter((f) => /\.(jpe?g|png|webp|avif|gif)$/i.test(f))
      .map((filename) => {
        const stats = fs.statSync(path.join(UPLOADS_DIR, filename));
        return {
          filename,
          url: `/uploads/${filename}`,
          size: stats.size,
          createdAt: stats.birthtime.toISOString(),
        };
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({ success: true, data: mediaList });
  } catch (err) {
    next(err);
  }
});
