import { db } from '../data/store';
import { PromoCode } from '../types';

export class PromoRepository {
  public static validate(
    code: string,
    subtotal: number = 0
  ): { valid: boolean; promo?: PromoCode; message: string } {
    if (!code || !code.trim()) {
      return { valid: false, message: 'Please enter a valid promotional code' };
    }

    const cleanCode = code.trim().toUpperCase();
    const codes = db.get('promoCodes');
    const match = codes.find((p) => p.code.toUpperCase() === cleanCode);

    if (!match) {
      return { valid: false, message: `Promo code "${cleanCode}" is unrecognized or expired.` };
    }

    if (match.minSpend && subtotal < match.minSpend) {
      return {
        valid: false,
        promo: match,
        message: `Promo code requires a minimum spend of $${match.minSpend}.`,
      };
    }

    return {
      valid: true,
      promo: match,
      message: `${match.discountPercent}% VIP privilege applied: ${match.description}`,
    };
  }

  public static findAll(): PromoCode[] {
    return db.get('promoCodes');
  }
}
