import { db } from '../data/store';
import { Product, LookbookItem } from '../types';
import { supabase, isSupabaseConfigured } from '../../src/lib/supabase';
import { mapDbProductToProduct, mapProductToDbProduct } from '../../src/lib/db-mappers';

export interface ProductQueryFilters {
  category?: string;
  inStock?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'bestseller';
  limit?: number;
  offset?: number;
}

export class ProductRepository {
  public static findAll(filters: ProductQueryFilters = {}): { products: Product[]; total: number } {
    let list = [...db.get('products')];

    // Category filtering (support 'all', 'bedding', 'curtains', etc.)
    if (filters.category && filters.category !== 'all') {
      const cat = filters.category.toLowerCase();
      list = list.filter((p) => {
        if (cat === 'bedding') {
          return ['bedding', 'sheets', 'duvets'].includes(p.category.toLowerCase());
        }
        return p.category.toLowerCase() === cat;
      });
    }

    // In Stock filter
    if (filters.inStock !== undefined) {
      list = list.filter((p) => p.inStock === filters.inStock);
    }

    // Keyword Search (name, subtitle, description, tags, fabric)
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          (p.fabric && p.fabric.toLowerCase().includes(q))
      );
    }

    // Price Bounds
    if (filters.minPrice !== undefined) {
      list = list.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      list = list.filter((p) => p.price <= filters.maxPrice!);
    }

    // Sorting
    if (filters.sort) {
      switch (filters.sort) {
        case 'price_asc':
          list.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          list.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          list.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
          break;
        case 'bestseller':
          list.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
          break;
      }
    }

    const total = list.length;
    const offset = filters.offset || 0;
    const limit = filters.limit || 50;
    const paginated = list.slice(offset, offset + limit);

    return { products: paginated, total };
  }

  public static findById(id: string): Product | null {
    const list = db.get('products');
    return list.find((p) => p.id === id) || null;
  }

  public static getCategories(): { category: string; count: number }[] {
    const list = db.get('products');
    const counts: Record<string, number> = {};

    list.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });

    return Object.entries(counts).map(([category, count]) => ({ category, count }));
  }

  public static getFeatured(): Product[] {
    const list = db.get('products');
    return list.filter((p) => p.featured || p.isBestSeller);
  }

  public static getLookbooks(): LookbookItem[] {
    return db.get('lookbooks');
  }

  public static create(data: Omit<Product, 'id'>): Product {
    const id = `prod-${Date.now()}`;
    const newProduct: Product = {
      id,
      ...data,
      rating: data.rating || 5.0,
      reviewsCount: data.reviewsCount || 0,
      inStock: data.inStock !== undefined ? data.inStock : true,
      stockCount: data.stockCount || 10,
      colors: data.colors && data.colors.length > 0 ? data.colors : [
        {
          name: 'Natural Flax',
          hex: '#D7C7B3',
          image: (data.images && data.images[0]) || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=85',
        }
      ],
      sizes: data.sizes && data.sizes.length > 0 ? data.sizes : ['Standard'],
      images: data.images && data.images.length > 0 ? data.images : [
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=85',
      ],
      details: data.details && data.details.length > 0 ? data.details : ['Hand-finished in master atelier'],
      tags: data.tags || [data.category],
    };

    db.update('products', (list) => {
      list.unshift(newProduct);
      return list;
    });

    return newProduct;
  }

  public static update(id: string, updates: Partial<Product>): Product | null {
    return db.transaction((state) => {
      const idx = state.products.findIndex((p) => p.id === id);
      if (idx === -1) return null;

      state.products[idx] = {
        ...state.products[idx],
        ...updates,
      };

      return state.products[idx];
    });
  }

  public static delete(id: string): boolean {
    return db.transaction((state) => {
      const initialLen = state.products.length;
      state.products = state.products.filter((p) => p.id !== id);
      return state.products.length < initialLen;
    });
  }

  public static toggleStatus(id: string, field: 'inStock' | 'featured'): Product | null {
    return db.transaction((state) => {
      const product = state.products.find((p) => p.id === id);
      if (!product) return null;

      if (field === 'inStock') {
        product.inStock = !product.inStock;
      } else if (field === 'featured') {
        product.featured = !product.featured;
      }

      return product;
    });
  }

  // ════════════════════════════════════════════════════════════════════════
  // Supabase PostgreSQL Primary Operations (falls back to local JSON store)
  // ════════════════════════════════════════════════════════════════════════

  public static async findAllAsync(filters: ProductQueryFilters = {}): Promise<{
    products: Product[];
    total: number;
    source: 'supabase' | 'local-store';
  }> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase.from('products').select('*', { count: 'exact' });

        if (filters.category && filters.category !== 'all') {
          const cat = filters.category.toLowerCase();
          if (cat === 'bedding') {
            query = query.in('category', ['bedding', 'sheets', 'duvets']);
          } else {
            query = query.ilike('category', cat);
          }
        }

        if (filters.inStock !== undefined) {
          query = query.eq('in_stock', filters.inStock);
        }

        if (filters.search && filters.search.trim()) {
          const q = filters.search.trim();
          query = query.or(`name.ilike.%${q}%,subtitle.ilike.%${q}%,description.ilike.%${q}%`);
        }

        if (filters.minPrice !== undefined) {
          query = query.gte('price', filters.minPrice);
        }
        if (filters.maxPrice !== undefined) {
          query = query.lte('price', filters.maxPrice);
        }

        const limit = filters.limit || 50;
        const offset = filters.offset || 0;

        const { data, count, error } = await query
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);

        if (!error && data) {
          return {
            products: data.map(mapDbProductToProduct),
            total: count || data.length,
            source: 'supabase',
          };
        }
      } catch {
        // Fallback to local
      }
    }

    const local = ProductRepository.findAll(filters);
    return { ...local, source: 'local-store' };
  }

  public static async findByIdAsync(id: string): Promise<{ product: Product | null; source: 'supabase' | 'local-store' }> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
        if (!error && data) {
          return { product: mapDbProductToProduct(data), source: 'supabase' };
        }
      } catch {}
    }
    return { product: ProductRepository.findById(id), source: 'local-store' };
  }

  public static async createAsync(data: Omit<Product, 'id'>): Promise<{ product: Product; source: 'supabase' | 'local-store' }> {
    const id = `prod-${Date.now()}`;
    const productPayload = { ...data, id };

    if (isSupabaseConfigured()) {
      try {
        const dbRecord = mapProductToDbProduct(productPayload);
        const { data: created, error } = await supabase.from('products').insert([dbRecord]).select().single();
        if (!error && created) {
          if (Array.isArray(productPayload.images) && productPayload.images.length > 0) {
            const imageRows = productPayload.images.map((url: string, idx: number) => ({
              product_id: id,
              url,
              display_order: idx,
              is_primary: idx === 0,
            }));
            await supabase.from('product_images').insert(imageRows);
          }
          // Also sync to local memory
          ProductRepository.create(data);
          return { product: mapDbProductToProduct(created), source: 'supabase' };
        }
      } catch {}
    }

    return { product: ProductRepository.create(data), source: 'local-store' };
  }

  public static async deleteAsync(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('product_images').delete().eq('product_id', id);
        const { error } = await supabase.from('products').delete().eq('id', id);
        ProductRepository.delete(id);
        return !error;
      } catch {}
    }
    return ProductRepository.delete(id);
  }
}
