import {
  Product,
  User,
  Address,
  OrderDetails,
  BespokeInquiry,
  TradeInquiry,
  PromoCode,
  LookbookItem,
} from '../types';

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'pending' | 'contacted' | 'resolved';
  submittedAt: string;
}

export interface ConsolidatedInquiry {
  id: string;
  type: 'contact' | 'bespoke' | 'trade';
  sender: string;
  email: string;
  phone?: string;
  title: string;
  details: string;
  status: 'pending' | 'contacted' | 'resolved';
  submittedAt: string;
}

export interface MediaFile {
  filename: string;
  url: string;
  size: number;
  createdAt: string;
}

const API_BASE = '/api';
const TOKEN_KEY = 'boski_jwt_token';

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem(TOKEN_KEY);
    }
  }

  public setToken(token: string | null): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    }
  }

  public getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem(TOKEN_KEY);
    }
    return this.token;
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ success: boolean; data?: T; error?: string; message?: string; meta?: any }> {
    const isFormData = options.body instanceof FormData;
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (!isFormData && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    const currentToken = this.getToken();
    if (currentToken) {
      headers['Authorization'] = `Bearer ${currentToken}`;
    }

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });

      const json = await res.json();
      if (!res.ok) {
        return {
          success: false,
          error: json.error || `HTTP error ${res.status}`,
        };
      }

      return json;
    } catch (err: any) {
      console.warn(`[ApiClient] Request to ${endpoint} failed:`, err.message);
      return {
        success: false,
        error: err.message || 'Network connection failed.',
      };
    }
  }

  // --- Products API ---
  public products = {
    getAll: async (params: {
      category?: string;
      search?: string;
      inStock?: boolean;
      sort?: string;
      limit?: number;
    } = {}) => {
      const query = new URLSearchParams();
      if (params.category) query.set('category', params.category);
      if (params.search) query.set('search', params.search);
      if (params.inStock !== undefined) query.set('inStock', String(params.inStock));
      if (params.sort) query.set('sort', params.sort);
      if (params.limit) query.set('limit', String(params.limit));

      const qs = query.toString();
      return this.request<Product[]>(`/products${qs ? `?${qs}` : ''}`);
    },

    getById: async (id: string) => {
      return this.request<Product>(`/products/${id}`);
    },

    getFeatured: async () => {
      return this.request<Product[]>('/products/featured');
    },

    getCategories: async () => {
      return this.request<{ category: string; count: number }[]>('/products/categories');
    },

    getLookbooks: async () => {
      return this.request<LookbookItem[]>('/products/lookbooks');
    },

    // Admin CRUD
    create: async (productData: Omit<Product, 'id'>) => {
      return this.request<Product>('/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      });
    },

    update: async (id: string, updates: Partial<Product>) => {
      return this.request<Product>(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },

    delete: async (id: string) => {
      return this.request(`/products/${id}`, {
        method: 'DELETE',
      });
    },

    toggleStatus: async (id: string, field: 'inStock' | 'featured') => {
      return this.request<Product>(`/products/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ field }),
      });
    },
  };

  // --- Image & Media Upload API ---
  public upload = {
    image: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);

      return this.request<{ url: string; filename: string; size: number; mimetype: string }>('/upload', {
        method: 'POST',
        body: formData,
      });
    },

    getMediaList: async () => {
      return this.request<MediaFile[]>('/upload');
    },
  };

  // --- Category Management API ---
  public categories = {
    getAll: async () => {
      return this.request<{ category: string; count: number }[]>('/categories');
    },

    create: async (name: string) => {
      return this.request<string>('/categories', {
        method: 'POST',
        body: JSON.stringify({ name }),
      });
    },

    delete: async (name: string) => {
      return this.request(`/categories/${encodeURIComponent(name)}`, {
        method: 'DELETE',
      });
    },
  };

  // --- Authentication & Profile API ---
  public auth = {
    register: async (data: {
      firstName: string;
      lastName: string;
      email: string;
      password?: string;
      phone?: string;
    }) => {
      const res = await this.request<{ user: User; token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (res.success && res.data?.token) {
        this.setToken(res.data.token);
      }
      return res;
    },

    login: async (email: string, password?: string) => {
      const res = await this.request<{ user: User; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (res.success && res.data?.token) {
        this.setToken(res.data.token);
      }
      return res;
    },

    getMe: async () => {
      return this.request<User>('/auth/me');
    },

    logout: () => {
      this.setToken(null);
    },

    updateProfile: async (updates: Partial<User>) => {
      return this.request<User>('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },

    addAddress: async (address: Omit<Address, 'id'>) => {
      return this.request<Address>('/auth/address', {
        method: 'POST',
        body: JSON.stringify(address),
      });
    },

    updateAddress: async (id: string, updates: Partial<Address>) => {
      return this.request<Address>(`/auth/address/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },

    deleteAddress: async (id: string) => {
      return this.request(`/auth/address/${id}`, {
        method: 'DELETE',
      });
    },

    setDefaultAddress: async (id: string) => {
      return this.request(`/auth/address/${id}/default`, {
        method: 'PUT',
      });
    },
  };

  // --- Orders & Checkout API ---
  public orders = {
    create: async (payload: {
      customer: OrderDetails['customer'];
      shippingMethod: OrderDetails['shippingMethod'];
      paymentMethod: string;
      items: OrderDetails['items'];
      appliedPromoCode?: string;
      appliedGiftWrap?: boolean;
    }) => {
      return this.request<OrderDetails>('/orders', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },

    getAll: async (email?: string) => {
      const query = email ? `?email=${encodeURIComponent(email)}` : '';
      return this.request<OrderDetails[]>(`/orders${query}`);
    },

    getById: async (id: string) => {
      return this.request<OrderDetails>(`/orders/${id}`);
    },
  };

  // --- Inquiries & Messages API ---
  public inquiries = {
    submitContact: async (data: { name: string; email: string; phone?: string; subject?: string; message: string }) => {
      return this.request<ContactInquiry>('/inquiries/contact', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    submitBespoke: async (data: Omit<BespokeInquiry, 'id' | 'submittedAt'>) => {
      return this.request<BespokeInquiry>('/inquiries/bespoke', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    submitTrade: async (data: Omit<TradeInquiry, 'id' | 'submittedAt'>) => {
      return this.request<TradeInquiry>('/inquiries/trade', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    getAll: async () => {
      return this.request<ConsolidatedInquiry[]>('/inquiries/all');
    },

    updateStatus: async (id: string, status: 'pending' | 'contacted' | 'resolved') => {
      return this.request(`/inquiries/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    },
  };

  // --- Promo Validation API ---
  public promo = {
    validate: async (code: string, subtotal: number = 0) => {
      return this.request<PromoCode>('/promo/validate', {
        method: 'POST',
        body: JSON.stringify({ code, subtotal }),
      });
    },
  };
}

export const api = new ApiClient();
