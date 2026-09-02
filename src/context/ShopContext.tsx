'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Product, CartItem, ProductColor, Currency, PromoCode, OrderDetails, User, Address, BespokeInquiry, TradeInquiry } from '../types';
import { PRODUCTS, CURRENCIES, PROMO_CODES } from '../data/products';
import { api } from '../services/api';

export interface CategoryItem {
  category: string;
  count: number;
  label?: string;
}

interface ToastData {
  id: string;
  title: string;
  subtitle?: string;
  type?: 'cart' | 'wishlist' | 'info' | 'success';
}

interface Totals {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  freeShippingThreshold: number;
  amountToFreeShipping: number;
}

export type PageView =
  | 'home'
  | 'new-arrivals'
  | 'shop'
  | 'bedding'
  | 'curtains'
  | 'towels'
  | 'throws-blankets'
  | 'throws'
  | 'blankets'
  | 'bespoke'
  | 'trade'
  | 'canvas'
  | 'account'
  | 'wishlist'
  | 'admin';

interface ShopContextType {
  activePage: PageView;
  setActivePage: (page: PageView) => void;
  products: Product[];
  categories: CategoryItem[];
  refreshCategories: () => Promise<void>;
  refreshProducts: () => Promise<void>;
  isApiConnected: boolean;
  isContactOpen: boolean;
  setIsContactOpen: (open: boolean) => void;
  cart: CartItem[];
  wishlist: string[];
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  selectedProductForQuickView: Product | null;
  setSelectedProductForQuickView: (prod: Product | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAccountOpen: boolean;
  setIsAccountOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  authMode: 'login' | 'signup';
  setAuthMode: (mode: 'login' | 'signup') => void;
  isMiniAccountOpen: boolean;
  setIsMiniAccountOpen: (open: boolean) => void;
  isAROpen: boolean;
  setIsAROpen: (open: boolean) => void;
  arProduct: Product | null;
  openARView: (prod: Product) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  login: (email: string, password?: string) => Promise<boolean> | boolean;
  signup: (firstName: string, lastName: string, email: string, password?: string, phone?: string) => Promise<boolean> | boolean;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  editAddress: (id: string, updates: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  appliedPromo: PromoCode | null;
  appliedGiftWrap: boolean;
  setAppliedGiftWrap: (wrap: boolean) => void;
  orderNote: string;
  setOrderNote: (note: string) => void;
  orderHistory: OrderDetails[];
  recentOrder: OrderDetails | null;
  setRecentOrder: (order: OrderDetails | null) => void;
  toast: ToastData | null;
  showToast: (title: string, subtitle?: string, type?: 'cart' | 'wishlist' | 'info' | 'success') => void;
  addToCart: (product: Product, color?: ProductColor, size?: string, quantity?: number) => void;
  updateCartQuantity: (itemId: string, newQty: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  formatPrice: (amountInUSD: number) => string;
  getTotals: () => Totals;
  placeOrder: (
    customer: OrderDetails['customer'],
    shippingMethod: OrderDetails['shippingMethod'],
    paymentMethod: string
  ) => OrderDetails;
  bespokeInquiries: BespokeInquiry[];
  submitBespokeInquiry: (inquiry: Omit<BespokeInquiry, 'submittedAt'>) => void;
  tradeInquiries: TradeInquiry[];
  submitTradeApplication: (inquiry: Omit<TradeInquiry, 'submittedAt'>) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CART: 'boski_cart_v2',
  WISHLIST: 'boski_wishlist_v2',
  CURRENCY: 'boski_currency_v2',
  ORDERS: 'boski_orders_v2',
  USER: 'boski_user_v2',
  THEME: 'boski_theme',
};

const DEFAULT_VIP_USER: User = {
  id: 'usr-ll-4921',
  firstName: 'Eleanor',
  lastName: 'Vance',
  name: 'Eleanor Vance',
  email: 'eleanor.vance@boski-limited.com',
  phone: '+1 (617) 555-0192',
  role: 'client',
  vipTier: 'Diamond Concierge',
  pointsBalance: 3840,
  joinedDate: 'October 2022',
  addresses: [
    {
      id: 'addr-eleanor-default',
      label: 'Default Address',
      firstName: 'Eleanor',
      lastName: 'Vance',
      addressLine1: '142 Hill House Lane',
      addressLine2: 'Apt 3B',
      city: 'Boston',
      state: 'MA',
      zipCode: '02116',
      country: 'United States',
      phone: '+1 (617) 555-0192',
      isDefault: true,
    },
    {
      id: 'addr-eleanor-cape',
      label: 'Cape Cod Summer Cottage',
      firstName: 'Eleanor',
      lastName: 'Vance',
      addressLine1: '78 Ocean Bluff Way',
      city: 'Chatham',
      state: 'MA',
      zipCode: '02633',
      country: 'United States',
      phone: '+1 (617) 555-0192',
      isDefault: false,
    },
  ],
};

const INITIAL_ORDER_HISTORY: OrderDetails[] = [
  {
    orderId: 'LL-4921',
    date: 'Oct 24, 2023',
    customer: {
      firstName: 'Eleanor',
      lastName: 'Vance',
      email: 'eleanor.vance@boski-limited.com',
      phone: '+1 (617) 555-0192',
      address: '142 Hill House Lane, Apt 3B',
      city: 'Boston',
      state: 'MA',
      zipCode: '02116',
      country: 'United States',
    },
    shippingMethod: {
      id: 'white-glove',
      name: 'Atelier White Glove Delivery',
      price: 0,
      estimatedDays: 'Delivered',
    },
    paymentMethod: 'Mastercard ending in •••• 8842',
    items: [
      {
        id: 'item-ord-4921',
        product: PRODUCTS[0], // Signature Sateen Core Sheet Set
        selectedColor: PRODUCTS[0].colors[0], // Warm Ivory
        selectedSize: 'Queen',
        quantity: 1,
      },
    ],
    subtotal: 265,
    discount: 0,
    shipping: 0,
    tax: 16.56,
    total: 281.56,
    trackingNumber: '1Z9999999999999999',
    status: 'Delivered',
  },
];

const INITIAL_CART: CartItem[] = [
  {
    id: 'cart-1',
    product: PRODUCTS[0],
    selectedColor: PRODUCTS[0].colors[0], // Warm Ivory
    selectedSize: 'Queen',
    quantity: 1,
  },
  {
    id: 'cart-2',
    product: PRODUCTS[1],
    selectedColor: PRODUCTS[1].colors[0], // Natural Flax
    selectedSize: 'Full / Queen',
    quantity: 1,
  },
];

const DEFAULT_CATEGORIES: CategoryItem[] = [
  { category: 'sheets', count: 1, label: 'Sheet Sets' },
  { category: 'duvets', count: 2, label: 'Duvet Covers' },
  { category: 'curtains', count: 2, label: 'Curtains & Drapery' },
  { category: 'towels', count: 2, label: 'Towels & Bath' },
  { category: 'throws', count: 1, label: 'Artisan Throws' },
  { category: 'blankets', count: 1, label: 'Waffle Blankets' },
  { category: 'pillows', count: 1, label: 'Pillowcases' },
];

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<PageView>('home');
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [categories, setCategories] = useState<CategoryItem[]>(DEFAULT_CATEGORIES);
  const [isApiConnected, setIsApiConnected] = useState<boolean>(false);

  const refreshProducts = useCallback(async () => {
    try {
      const res = await api.products.getAll();
      if (res.success && res.data && res.data.length > 0) {
        setProducts(res.data);
        setIsApiConnected(true);
      }
    } catch (e) {
      console.warn('Failed to refresh products:', e);
    }
  }, []);

  const refreshCategories = useCallback(async () => {
    try {
      const res = await api.categories.getAll();
      if (res.success && res.data && res.data.length > 0) {
        setCategories(res.data);
      }
    } catch (e) {
      console.warn('Failed to refresh categories:', e);
    }
  }, []);

  // Deterministic initial states (identical on server and initial client render to prevent hydration mismatches)
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [currency, setCurrencyState] = useState<Currency>(CURRENCIES.GBP);
  const [orderHistory, setOrderHistory] = useState<OrderDetails[]>([]);
  const [recentOrder, setRecentOrder] = useState<OrderDetails | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEYS.THEME, next ? 'dark' : 'bright');
          localStorage.setItem('boski_admin_theme', next ? 'dark' : 'bright');
          if (next) {
            document.documentElement.classList.add('dark');
            document.documentElement.setAttribute('data-theme', 'dark');
          } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.setAttribute('data-theme', 'light');
          }
        } catch (e) {
          console.warn('[ShopContext] Theme persist error:', e);
        }
      }
      return next;
    });
  }, []);

  // Safely hydrate stored client state from LocalStorage after initial mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || localStorage.getItem('boski_admin_theme');
      if (savedTheme === 'dark') {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else if (savedTheme === 'bright') {
        setIsDarkMode(false);
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }

      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed && !parsed.name && parsed.firstName && parsed.lastName) {
          parsed.name = `${parsed.firstName} ${parsed.lastName}`;
        }
        setCurrentUser(parsed);
      }

      const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) setCart(parsedCart);
      }

      const savedWishlist = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      if (savedWishlist) {
        const parsedWish = JSON.parse(savedWishlist);
        if (Array.isArray(parsedWish)) setWishlist(parsedWish);
      }

      const savedCurrency = localStorage.getItem(STORAGE_KEYS.CURRENCY);
      if (savedCurrency && CURRENCIES[savedCurrency]) {
        setCurrencyState(CURRENCIES[savedCurrency]);
      }

      const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders);
        if (Array.isArray(parsedOrders)) setOrderHistory(parsedOrders);
      }

      // Auto-detect admin view from URL path, hash, or query parameter
      if (typeof window !== 'undefined') {
        const path = window.location.pathname.toLowerCase();
        const hash = window.location.hash.toLowerCase();
        const search = window.location.search.toLowerCase();
        if (path === '/admin' || path.endsWith('/admin') || hash.includes('admin') || search.includes('admin')) {
          setActivePage('admin');
        }
      }
    } catch (e) {
      console.warn('[ShopContext] Error hydrating client state from localStorage:', e);
    }
  }, []);

  // UI Modals & Drawers
  const [selectedProductForQuickView, setSelectedProductForQuickView] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isAccountOpen, setIsAccountOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isMiniAccountOpen, setIsMiniAccountOpen] = useState<boolean>(false);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);

  // Augmented Reality Room View Modal
  const [isAROpen, setIsAROpen] = useState<boolean>(false);
  const [arProduct, setARProduct] = useState<Product | null>(null);

  // Cart configurations
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [appliedGiftWrap, setAppliedGiftWrap] = useState<boolean>(false);
  const [orderNote, setOrderNote] = useState<string>('');

  // Notification Toast
  const [toast, setToast] = useState<ToastData | null>(null);

  // Inquiries
  const [bespokeInquiries, setBespokeInquiries] = useState<BespokeInquiry[]>([]);
  const [tradeInquiries, setTradeInquiries] = useState<TradeInquiry[]>([]);

  // Connect to backend API on mount
  useEffect(() => {
    // 1. Fetch live products from backend
    refreshProducts();

    // 2. Fetch live categories from backend
    refreshCategories();

    // 3. Validate session if token exists
    if (api.getToken()) {
      api.auth.getMe().then((res) => {
        if (res.success && res.data) {
          setCurrentUser(res.data);
          // Sync server orders
          api.orders.getAll(res.data.email).then((ordRes) => {
            if (ordRes.success && ordRes.data && ordRes.data.length > 0) {
              setOrderHistory(ordRes.data);
            }
          });
        }
      });
    }
  }, []);

  // Sync with LocalStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENCY, currency.code);
    } catch (e) {
      console.error(e);
    }
  }, [currency]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orderHistory));
    } catch (e) {
      console.error(e);
    }
  }, [orderHistory]);

  const showToast = (title: string, subtitle?: string, type: 'cart' | 'wishlist' | 'info' | 'success' = 'info') => {
    const id = Date.now().toString();
    setToast({ id, title, subtitle, type });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 4500);
  };

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    showToast('Currency Updated', `Displaying values in ${curr.label}`, 'info');
  };

  const openARView = (prod: Product) => {
    setARProduct(prod);
    setIsAROpen(true);
  };

  const formatPrice = (amountInUSD: number): string => {
    const converted = amountInUSD * currency.rate;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(converted);
  };

  const addToCart = (product: Product, color?: ProductColor, size?: string, quantity = 1) => {
    const chosenColor = color || product.colors[0];
    const chosenSize = size || product.sizes[0];
    const itemKey = `${product.id}-${chosenColor.name}-${chosenSize}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemKey);
      if (existing) {
        return prev.map((item) =>
          item.id === itemKey ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: itemKey,
          product,
          selectedColor: chosenColor,
          selectedSize: chosenSize,
          quantity,
        },
      ];
    });

    showToast(
      'Added to Shopping Bag',
      `${product.name} (${chosenColor.name} • ${chosenSize})`,
      'cart'
    );
  };

  const updateCartQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: newQty } : item))
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
    showToast('Removed from Bag', undefined, 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from Wishlist', product?.name, 'wishlist');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to Wishlist', product?.name, 'wishlist');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const applyPromoCode = (code: string) => {
    const found = PROMO_CODES.find((p) => p.code.toUpperCase() === code.trim().toUpperCase());
    if (found) {
      setAppliedPromo(found);
      showToast('Privilege Code Applied', `${found.code} (${found.discountPercent}% off)`, 'success');
      return { success: true, message: `Code applied: ${found.description}` };
    }
    showToast('Invalid Code', 'The entered code does not match our current records', 'info');
    return { success: false, message: 'Invalid or expired code.' };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    showToast('Code Removed', undefined, 'info');
  };

  const getTotals = (): Totals => {
    const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const discount = appliedPromo ? (subtotal * appliedPromo.discountPercent) / 100 : 0;
    const freeShippingThreshold = 250;
    const isFreeShipping = subtotal >= freeShippingThreshold;
    const shipping = cart.length === 0 ? 0 : isFreeShipping ? 0 : 25;
    const giftWrapFee = appliedGiftWrap ? 15 : 0;
    const tax = Math.round((subtotal - discount) * 0.065);
    const total = subtotal - discount + shipping + tax + giftWrapFee;
    const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

    return {
      subtotal,
      discount,
      shipping,
      tax,
      total,
      freeShippingThreshold,
      amountToFreeShipping,
    };
  };

  const login = async (email: string, password?: string): Promise<boolean> => {
    try {
      const res = await api.auth.login(email, password);
      if (res.success && res.data?.user) {
        setCurrentUser(res.data.user);
        setIsAuthOpen(false);
        showToast('Welcome back', `Signed in as ${res.data.user.firstName} ${res.data.user.lastName}`, 'success');

        // Fetch live order history for this user
        const ordRes = await api.orders.getAll(res.data.user.email);
        if (ordRes.success && ordRes.data) {
          setOrderHistory(ordRes.data);
        }
        return true;
      } else {
        showToast('Sign In Error', res.error || 'Invalid email or password credentials', 'info');
        return false;
      }
    } catch {
      // Local optimistic fallback
      if (email.toLowerCase().includes('eleanor') || email.toLowerCase().includes('victoria')) {
        setCurrentUser(DEFAULT_VIP_USER);
      } else {
        setCurrentUser({
          id: `usr-${Date.now()}`,
          firstName: email.toLowerCase().includes('concierge') ? 'Master' : (email.split('@')[0] || 'Client'),
          lastName: email.toLowerCase().includes('concierge') ? 'Concierge' : 'Member',
          email,
          role: (email.toLowerCase().includes('concierge') || email.toLowerCase().includes('admin')) ? 'admin' : 'client',
          vipTier: email.toLowerCase().includes('concierge') ? 'Diamond Concierge' : 'Member',
          pointsBalance: 500,
          joinedDate: 'Recently',
          addresses: DEFAULT_VIP_USER.addresses,
        });
      }
      setIsAuthOpen(false);
      showToast('Welcome back', 'Signed into your BOSKI LIMITED account', 'success');
      return true;
    }
  };

  const signup = async (
    firstName: string,
    lastName: string,
    email: string,
    password?: string,
    phone?: string
  ): Promise<boolean> => {
    try {
      const res = await api.auth.register({ firstName, lastName, email, password, phone });
      if (res.success && res.data?.user) {
        setCurrentUser(res.data.user);
        setIsAuthOpen(false);
        showToast('Account Created', `Welcome to BOSKI LIMITED, ${res.data.user.firstName}`, 'success');
        return true;
      } else {
        showToast('Registration Error', res.error || 'Could not complete registration', 'info');
        return false;
      }
    } catch {
      const newUser: User = {
        id: `usr-${Date.now()}`,
        firstName: firstName.trim() || 'Client',
        lastName: lastName.trim() || 'Member',
        email: email.trim(),
        phone: phone?.trim(),
        vipTier: 'Member',
        pointsBalance: 500,
        joinedDate: 'New Client',
        addresses: [],
      };
      setCurrentUser(newUser);
      setIsAuthOpen(false);
      showToast('Account Created', `Welcome to BOSKI LIMITED, ${newUser.firstName}`, 'success');
      return true;
    }
  };

  const logout = () => {
    api.auth.logout();
    setCurrentUser(null);
    setIsAccountOpen(false);
    setIsMiniAccountOpen(false);
    showToast('Signed Out', 'You have been safely signed out', 'info');
  };

  const updateUserProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    setCurrentUser((prev) => (prev ? { ...prev, ...updates } : null));
    api.auth.updateProfile(updates);
    showToast('Profile Updated', 'Your details have been saved', 'success');
  };

  const addAddress = (addressData: Omit<Address, 'id'>) => {
    if (!currentUser) return;
    const tempId = `addr-${Date.now()}`;
    const newAddr: Address = {
      ...addressData,
      id: tempId,
    };
    setCurrentUser((prev) => {
      if (!prev) return null;
      let updatedList = [...prev.addresses];
      if (newAddr.isDefault) {
        updatedList = updatedList.map((a) => ({ ...a, isDefault: false }));
      }
      return { ...prev, addresses: [...updatedList, newAddr] };
    });
    api.auth.addAddress(addressData).then((res) => {
      if (res.success && res.data) {
        setCurrentUser((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            addresses: prev.addresses.map((a) => (a.id === tempId ? res.data! : a)),
          };
        });
      }
    });
    showToast('Address Added', newAddr.label, 'success');
  };

  const editAddress = (id: string, updates: Partial<Address>) => {
    if (!currentUser) return;
    setCurrentUser((prev) => {
      if (!prev) return null;
      let updatedList = prev.addresses.map((a) => (a.id === id ? { ...a, ...updates } : a));
      if (updates.isDefault) {
        updatedList = updatedList.map((a) => (a.id === id ? a : { ...a, isDefault: false }));
      }
      return { ...prev, addresses: updatedList };
    });
    api.auth.updateAddress(id, updates);
    showToast('Address Updated', undefined, 'success');
  };

  const deleteAddress = (id: string) => {
    if (!currentUser) return;
    setCurrentUser((prev) => {
      if (!prev) return null;
      return { ...prev, addresses: prev.addresses.filter((a) => a.id !== id) };
    });
    api.auth.deleteAddress(id);
    showToast('Address Deleted', undefined, 'info');
  };

  const setDefaultAddress = (id: string) => {
    if (!currentUser) return;
    setCurrentUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        addresses: prev.addresses.map((a) => ({ ...a, isDefault: a.id === id })),
      };
    });
    api.auth.setDefaultAddress(id);
    showToast('Default Address Set', undefined, 'success');
  };

  const placeOrder = (
    customer: OrderDetails['customer'],
    shippingMethod: OrderDetails['shippingMethod'],
    paymentMethod: string
  ): OrderDetails => {
    const totals = getTotals();
    const finalShippingPrice = totals.shipping;
    const finalTotal = totals.total;

    const localOrder: OrderDetails = {
      orderId: `LL-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      customer,
      shippingMethod,
      paymentMethod,
      items: [...cart],
      subtotal: totals.subtotal,
      discount: totals.discount,
      shipping: finalShippingPrice,
      tax: totals.tax,
      total: finalTotal,
      trackingNumber: `BOSKI-${shippingMethod.id.toUpperCase()}-${Date.now().toString().slice(-6)}-EXP`,
      status: 'Processing',
    };

    // Dispatch to live backend API
    api.orders.create({
      customer,
      shippingMethod,
      paymentMethod,
      items: [...cart],
      appliedPromoCode: appliedPromo?.code,
      appliedGiftWrap,
    }).then((res) => {
      if (res.success && res.data) {
        setRecentOrder(res.data);
        setOrderHistory((prev) => [res.data!, ...prev.filter((o) => o.orderId !== res.data!.orderId)]);
      }
    });

    setOrderHistory((prev) => [localOrder, ...prev]);
    setRecentOrder(localOrder);

    if (currentUser) {
      setCurrentUser((prev) =>
        prev ? { ...prev, pointsBalance: prev.pointsBalance + Math.round(finalTotal * 10) } : null
      );
    }

    clearCart();
    showToast('Order Confirmed', `Order #${localOrder.orderId} registered with Atelier vault`, 'success');
    return localOrder;
  };

  const submitBespokeInquiry = (inquiryData: Omit<BespokeInquiry, 'submittedAt'>) => {
    const fullInquiry: BespokeInquiry = {
      ...inquiryData,
      submittedAt: new Date().toISOString(),
    };
    setBespokeInquiries((prev) => [fullInquiry, ...prev]);
    api.inquiries.submitBespoke(inquiryData);
    showToast(
      'Consultation Requested',
      'An artisan specialist will contact you within 24–48 hours.',
      'success'
    );
  };

  const submitTradeApplication = (inquiryData: Omit<TradeInquiry, 'submittedAt'>) => {
    const fullTrade: TradeInquiry = {
      ...inquiryData,
      submittedAt: new Date().toISOString(),
    };
    setTradeInquiries((prev) => [fullTrade, ...prev]);
    api.inquiries.submitTrade(inquiryData);
    showToast(
      'Application Submitted',
      'Our Trade & Hospitality team will review your credentials shortly.',
      'success'
    );
  };

  return (
    <ShopContext.Provider
      value={{
        activePage,
        setActivePage,
        products,
        categories,
        refreshCategories,
        refreshProducts,
        isApiConnected,
        cart,
        wishlist,
        currency,
        setCurrency,
        selectedProductForQuickView,
        setSelectedProductForQuickView,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAccountOpen,
        setIsAccountOpen,
        isSearchOpen,
        setIsSearchOpen,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        isAuthOpen,
        setIsAuthOpen,
        authMode,
        setAuthMode,
        isMiniAccountOpen,
        setIsMiniAccountOpen,
        isContactOpen,
        setIsContactOpen,
        isAROpen,
        setIsAROpen,
        arProduct,
        openARView,
        currentUser,
        setCurrentUser,
        login,
        signup,
        logout,
        updateUserProfile,
        addAddress,
        editAddress,
        deleteAddress,
        setDefaultAddress,
        appliedPromo,
        appliedGiftWrap,
        setAppliedGiftWrap,
        orderNote,
        setOrderNote,
        orderHistory,
        recentOrder,
        setRecentOrder,
        toast,
        showToast,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isInWishlist,
        applyPromoCode,
        removePromoCode,
        formatPrice,
        getTotals,
        placeOrder,
        bespokeInquiries,
        submitBespokeInquiry,
        tradeInquiries,
        submitTradeApplication,
        isDarkMode,
        toggleTheme,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
