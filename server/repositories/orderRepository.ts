import { db } from '../data/store';
import { OrderDetails, CartItem } from '../types';

export interface CreateOrderPayload {
  customer: OrderDetails['customer'];
  shippingMethod: OrderDetails['shippingMethod'];
  paymentMethod: string;
  items: CartItem[];
  appliedPromoCode?: string;
  appliedGiftWrap?: boolean;
}

export class OrderRepository {
  public static create(payload: CreateOrderPayload): OrderDetails {
    return db.transaction((state) => {
      // 1. Calculate server-verified pricing
      let subtotal = 0;
      for (const item of payload.items) {
        const liveProduct = state.products.find((p) => p.id === item.product.id);
        const unitPrice = liveProduct ? liveProduct.price : item.product.price;
        subtotal += unitPrice * item.quantity;
      }

      // 2. Validate & apply promo discount
      let discount = 0;
      if (payload.appliedPromoCode) {
        const promo = state.promoCodes.find(
          (p) => p.code.toUpperCase() === payload.appliedPromoCode!.toUpperCase()
        );
        if (promo) {
          discount = Math.round((subtotal * promo.discountPercent) / 100);
        }
      }

      const giftWrapFee = payload.appliedGiftWrap ? 15 : 0;
      const shippingFee = payload.shippingMethod.price;
      const taxableAmount = Math.max(0, subtotal - discount + giftWrapFee + shippingFee);
      const tax = Math.round(taxableAmount * 0.07 * 100) / 100; // 7% standard VAT/Tax
      const grandTotal = Math.round((taxableAmount + tax) * 100) / 100;

      // 3. Generate sequential identifiers
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const orderId = `LL-${new Date().getFullYear()}-${randomSuffix}`;
      const methodId = payload.shippingMethod?.id || 'STD';
      const trackingNumber = `BOSKI-${methodId.toUpperCase()}-${Date.now().toString().slice(-6)}-EXP`;

      const newOrder: OrderDetails = {
        orderId,
        date: new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
        customer: payload.customer,
        shippingMethod: payload.shippingMethod,
        paymentMethod: payload.paymentMethod,
        items: payload.items,
        subtotal,
        discount,
        shipping: shippingFee + giftWrapFee,
        tax,
        total: grandTotal,
        trackingNumber,
        status: 'Processing',
      };

      state.orders.unshift(newOrder);

      // 4. Update customer points balance if registered
      const user = state.users.find(
        (u) => u.email.toLowerCase() === payload.customer.email.toLowerCase()
      );
      if (user) {
        const pointsEarned = Math.round(grandTotal * 10);
        user.pointsBalance += pointsEarned;

        // Auto-upgrade VIP tier based on points
        if (user.pointsBalance >= 15000) user.vipTier = 'Diamond Concierge';
        else if (user.pointsBalance >= 8000) user.vipTier = 'Gold';
        else if (user.pointsBalance >= 3000) user.vipTier = 'Silver';
      }

      return newOrder;
    });
  }

  public static findByEmail(email: string): OrderDetails[] {
    const orders = db.get('orders');
    return orders.filter((o) => o.customer.email.toLowerCase() === email.toLowerCase());
  }

  public static findById(orderId: string): OrderDetails | null {
    const orders = db.get('orders');
    return orders.find((o) => o.orderId.toUpperCase() === orderId.toUpperCase()) || null;
  }

  public static findAll(): OrderDetails[] {
    return db.get('orders');
  }
}
