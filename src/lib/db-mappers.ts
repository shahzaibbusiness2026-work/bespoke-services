import { Product, OrderDetails, User } from '../types';
import { ConsolidatedInquiry } from '../services/api';

/**
 * Transforms a Supabase PostgreSQL row into the application Product model.
 * Bridges Postgres snake_case column names to React frontend camelCase.
 */
export function mapDbProductToProduct(row: any): Product {
  if (!row) return {} as Product;

  return {
    id: String(row.id),
    name: row.name || 'Untitled Piece',
    subtitle: row.subtitle || '',
    category: row.category || 'bedding',
    price: Number(row.price || 0),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    rating: Number(row.rating || 5.0),
    reviewsCount: Number(row.reviews_count ?? row.rating_count ?? 0),
    ratingCount: Number(row.reviews_count ?? row.rating_count ?? 0),
    inStock: Boolean(row.in_stock ?? true),
    stockCount: Number(row.stock_count ?? 10),
    isNew: Boolean(row.is_new ?? false),
    isBestSeller: Boolean(row.is_bestseller ?? false),
    isSale: Boolean(row.is_sale ?? false),
    discountPercent: row.discount_percent ? Number(row.discount_percent) : undefined,
    colors: Array.isArray(row.colors) ? row.colors : [],
    sizes: Array.isArray(row.sizes) ? row.sizes : [],
    images: Array.isArray(row.images) ? row.images : [],
    description: row.description || '',
    details: Array.isArray(row.details) ? row.details : [],
    material: row.material || '',
    careInstructions: row.care_instructions || row.careInstructions || '',
    sustainability: row.sustainability || '',
    sku: row.sku || `BOS-${String(row.id).toUpperCase()}`,
    tags: Array.isArray(row.tags) ? row.tags : [],
    featured: Boolean(row.featured ?? false),
    threadCount: row.thread_count || row.threadCount || undefined,
    fabric: row.fabric || undefined,
  };
}

/**
 * Transforms an application Product model into a Supabase PostgreSQL row.
 * Bridges frontend camelCase to Postgres snake_case column names.
 */
export function mapProductToDbProduct(prod: Partial<Product>): Record<string, any> {
  const dbRecord: Record<string, any> = {};

  if (prod.id !== undefined) dbRecord.id = prod.id;
  if (prod.name !== undefined) dbRecord.name = prod.name;
  if (prod.subtitle !== undefined) dbRecord.subtitle = prod.subtitle;
  if (prod.category !== undefined) dbRecord.category = prod.category;
  if (prod.price !== undefined) dbRecord.price = Number(prod.price);
  if (prod.originalPrice !== undefined) dbRecord.original_price = Number(prod.originalPrice);
  if (prod.rating !== undefined) dbRecord.rating = Number(prod.rating);
  if (prod.reviewsCount !== undefined) dbRecord.reviews_count = Number(prod.reviewsCount);
  if (prod.inStock !== undefined) dbRecord.in_stock = Boolean(prod.inStock);
  if (prod.stockCount !== undefined) dbRecord.stock_count = Number(prod.stockCount);
  if (prod.isNew !== undefined) dbRecord.is_new = Boolean(prod.isNew);
  if (prod.isBestSeller !== undefined) dbRecord.is_bestseller = Boolean(prod.isBestSeller);
  if (prod.isSale !== undefined) dbRecord.is_sale = Boolean(prod.isSale);
  if (prod.discountPercent !== undefined) dbRecord.discount_percent = Number(prod.discountPercent);
  if (prod.colors !== undefined) dbRecord.colors = prod.colors;
  if (prod.sizes !== undefined) dbRecord.sizes = prod.sizes;
  if (prod.images !== undefined) dbRecord.images = prod.images;
  if (prod.description !== undefined) dbRecord.description = prod.description;
  if (prod.details !== undefined) dbRecord.details = prod.details;
  if (prod.material !== undefined) dbRecord.material = prod.material;
  if (prod.careInstructions !== undefined) dbRecord.care_instructions = prod.careInstructions;
  if (prod.sustainability !== undefined) dbRecord.sustainability = prod.sustainability;
  if (prod.sku !== undefined) dbRecord.sku = prod.sku;
  if (prod.tags !== undefined) dbRecord.tags = prod.tags;
  if (prod.featured !== undefined) dbRecord.featured = Boolean(prod.featured);
  if (prod.threadCount !== undefined) dbRecord.thread_count = prod.threadCount;
  if (prod.fabric !== undefined) dbRecord.fabric = prod.fabric;

  dbRecord.updated_at = new Date().toISOString();
  return dbRecord;
}

/**
 * Transforms a Supabase PostgreSQL row into the application OrderDetails model.
 */
export function mapDbOrderToOrder(row: any): OrderDetails {
  return {
    orderId: row.order_id || row.orderId || String(row.id),
    date: row.created_at ? new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent',
    customer: row.customer || {},
    shippingMethod: row.shipping_method || row.shippingMethod || {},
    paymentMethod: row.payment_method || row.paymentMethod || 'Credit Card',
    items: Array.isArray(row.items) ? row.items : [],
    subtotal: Number(row.subtotal || 0),
    discount: Number(row.discount || 0),
    shipping: Number(row.shipping || 0),
    tax: Number(row.tax || 0),
    total: Number(row.total || 0),
    trackingNumber: row.tracking_number || row.trackingNumber || 'PENDING-DISPATCH',
    status: row.status || 'Processing',
  };
}

/**
 * Transforms an application OrderDetails model into a Supabase PostgreSQL row.
 */
export function mapOrderToDbOrder(order: Partial<OrderDetails>): Record<string, any> {
  return {
    order_id: order.orderId,
    customer: order.customer,
    shipping_method: order.shippingMethod,
    payment_method: order.paymentMethod,
    items: order.items,
    subtotal: Number(order.subtotal || 0),
    discount: Number(order.discount || 0),
    shipping: Number(order.shipping || 0),
    tax: Number(order.tax || 0),
    total: Number(order.total || 0),
    tracking_number: order.trackingNumber || 'ATELIER-DISPATCH-PENDING',
    status: order.status || 'Processing',
  };
}

/**
 * Transforms a Supabase contact_messages row into ConsolidatedInquiry.
 */
export function mapDbMessageToInquiry(row: any): ConsolidatedInquiry {
  return {
    id: String(row.id),
    type: row.type || 'contact',
    sender: row.sender_name || row.sender || 'Patron',
    email: row.email || '',
    phone: row.phone || undefined,
    title: row.subject || row.title || 'General Inquiry',
    details: row.message || row.details || '',
    status: row.status || 'pending',
    submittedAt: row.created_at || new Date().toISOString(),
  };
}

/**
 * Transforms a Supabase customer row into the application User model.
 */
export function mapDbCustomerToUser(row: any): User {
  return {
    id: String(row.id),
    firstName: row.first_name || 'Client',
    lastName: row.last_name || 'Member',
    name: `${row.first_name || 'Client'} ${row.last_name || 'Member'}`,
    email: row.email,
    phone: row.phone || undefined,
    role: 'client',
    vipTier: row.vip_tier || 'Member',
    pointsBalance: Number(row.points_balance || 500),
    joinedDate: row.created_at ? new Date(row.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recent',
    addresses: Array.isArray(row.addresses) ? row.addresses : [],
  };
}
