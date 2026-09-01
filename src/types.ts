export interface ProductColor {
  name: string;
  hex: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: 'bedding' | 'sheets' | 'duvets' | 'curtains' | 'throws' | 'blankets' | 'pillows' | string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockCount: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  isSale?: boolean;
  discountPercent?: number;
  colors: ProductColor[];
  sizes: string[];
  images: string[];
  description: string;
  details: string[];
  material: string;
  careInstructions: string;
  sustainability: string;
  sku: string;
  tags: string[];
  featured?: boolean;
  threadCount?: string;
  fabric?: string;
}

export interface CartItem {
  id: string; // unique item id based on product + color + size
  product: Product;
  selectedColor: ProductColor;
  selectedSize: string;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
  addedAt: number;
}

export interface LookbookHotspot {
  id: string;
  productId: string;
  xPercent: number; // 0 to 100
  yPercent: number; // 0 to 100
  title: string;
  price: number;
}

export interface LookbookItem {
  id: string;
  title: string;
  season: string;
  subtitle: string;
  image: string;
  hotspots: LookbookHotspot[];
}

export interface Review {
  id: string;
  author: string;
  location: string;
  rating: number;
  title: string;
  date: string;
  comment: string;
  verified: boolean;
  productName: string;
  avatar?: string;
  fitRating?: 'Runs small' | 'True to size' | 'Runs large';
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  description: string;
  minSpend?: number;
}

export interface Currency {
  code: string;
  symbol: string;
  rate: number; // relative to USD
  label: string;
}

export interface Address {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  vipTier: 'Member' | 'Silver' | 'Gold' | 'Diamond Concierge';
  pointsBalance: number;
  joinedDate: string;
  addresses: Address[];
}

export interface OrderDetails {
  orderId: string;
  date: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  shippingMethod: {
    id: string;
    name: string;
    price: number;
    estimatedDays: string;
  };
  paymentMethod: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  trackingNumber: string;
  status: 'Processing' | 'Shipped' | 'Delivered';
}

export interface BespokeInquiry {
  fullName: string;
  email: string;
  projectType: string;
  details?: string;
  imageFileName?: string;
  submittedAt: string;
}

export interface TradeInquiry {
  companyName: string;
  contactPerson: string;
  businessEmail: string;
  phone: string;
  professionalId: string;
  orderVolume: string;
  projectDetails?: string;
  submittedAt: string;
}
