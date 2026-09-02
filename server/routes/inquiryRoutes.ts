import { Router, Request, Response, NextFunction } from 'express';
import { InquiryRepository } from '../repositories/inquiryRepository';
import { authenticateUser, requireAdmin } from '../middleware/auth';

export const inquiryRouter = Router();

// POST /api/inquiries/contact - General customer contact / showroom inquiry
inquiryRouter.post('/contact', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({
        success: false,
        error: 'Your name, email address, and message are required.',
      });
      return;
    }

    const saved = InquiryRepository.saveContact({
      name,
      email,
      phone,
      subject: subject || 'General Customer Service Inquiry',
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Your message has been received. Our concierge will respond within 24 hours.',
      data: saved,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/inquiries/bespoke - Custom made-to-measure quotation
inquiryRouter.post('/bespoke', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fullName, email, projectType, details, imageFileName } = req.body;

    if (!fullName || !email || !projectType) {
      res.status(400).json({
        success: false,
        error: 'Full name, email, and project type are required.',
      });
      return;
    }

    const saved = InquiryRepository.saveBespoke({
      fullName,
      email,
      projectType,
      details,
      imageFileName,
    });

    res.status(201).json({
      success: true,
      message: 'Bespoke inquiry received. Master artisan will review within 24 hours.',
      data: saved,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/inquiries/trade - Trade & Hospitality account application
inquiryRouter.post('/trade', (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      companyName,
      contactPerson,
      businessEmail,
      phone,
      professionalId,
      orderVolume,
      projectDetails,
    } = req.body;

    if (!companyName || !contactPerson || !businessEmail || !phone || !professionalId || !orderVolume) {
      res.status(400).json({
        success: false,
        error: 'All company, contact, and procurement credentials are required.',
      });
      return;
    }

    const saved = InquiryRepository.saveTrade({
      companyName,
      contactPerson,
      businessEmail,
      phone,
      professionalId,
      orderVolume,
      projectDetails,
    });

    res.status(201).json({
      success: true,
      message: 'Trade credentials submitted. An account executive will contact you with wholesale pricing.',
      data: saved,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/inquiries/all - Consolidated inbox across all inquiries (Admin only)
inquiryRouter.get('/all', authenticateUser, requireAdmin, (_req: Request, res: Response, next: NextFunction) => {
  try {
    const list = InquiryRepository.getAllConsolidated();
    res.json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/inquiries/:id/status - Update resolution status (Admin only)
inquiryRouter.patch('/:id/status', authenticateUser, requireAdmin, (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    if (!status || !['pending', 'contacted', 'resolved'].includes(status)) {
      res.status(400).json({ success: false, error: "Status must be 'pending', 'contacted', or 'resolved'." });
      return;
    }

    const updated = InquiryRepository.updateStatus(req.params.id, status);
    if (!updated) {
      res.status(404).json({ success: false, error: 'Inquiry record not found.' });
      return;
    }

    res.json({ success: true, message: `Inquiry status marked as '${status}'.` });
  } catch (err) {
    next(err);
  }
});

// GET /api/inquiries/bespoke (Admin only)
inquiryRouter.get('/bespoke', authenticateUser, requireAdmin, (_req: Request, res: Response, next: NextFunction) => {
  try {
    const list = InquiryRepository.getAllBespoke();
    res.json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
});

// GET /api/inquiries/trade (Admin only)
inquiryRouter.get('/trade', authenticateUser, requireAdmin, (_req: Request, res: Response, next: NextFunction) => {
  try {
    const list = InquiryRepository.getAllTrade();
    res.json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
});
