import { db } from '../data/store';
import { Collection, CollectionSeason, CollectionStatus } from '../types';

export interface CollectionQueryFilters {
  season?: CollectionSeason | string;
  year?: number;
  status?: CollectionStatus | string;
  search?: string;
  featured?: boolean;
}

export class CollectionRepository {
  public static findAll(filters: CollectionQueryFilters = {}): Collection[] {
    let list = [...(db.get('collections') || [])];

    if (filters.season && filters.season !== 'all') {
      list = list.filter((c) => c.season.toLowerCase() === filters.season!.toLowerCase());
    }

    if (filters.status && filters.status !== 'all') {
      list = list.filter((c) => c.status.toLowerCase() === filters.status!.toLowerCase());
    }

    if (filters.year) {
      list = list.filter((c) => c.year === filters.year);
    }

    if (filters.featured !== undefined) {
      list = list.filter((c) => c.featured === filters.featured);
    }

    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          (c.story && c.story.toLowerCase().includes(q)) ||
          (c.designInspiration && c.designInspiration.toLowerCase().includes(q))
      );
    }

    // Sort active first, then upcoming, then draft, then archived
    const statusPriority: Record<string, number> = {
      active: 1,
      upcoming: 2,
      draft: 3,
      archived: 4,
    };

    return list.sort((a, b) => {
      const pA = statusPriority[a.status] || 99;
      const pB = statusPriority[b.status] || 99;
      if (pA !== pB) return pA - pB;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  public static findById(idOrSlug: string): Collection | null {
    const list = db.get('collections') || [];
    return list.find((c) => c.id === idOrSlug || c.slug === idOrSlug) || null;
  }

  public static create(data: Omit<Collection, 'id' | 'createdAt'>): Collection {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCollection: Collection = {
      ...data,
      id: `col-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`,
      slug,
      gallery: data.gallery || [],
      productIds: data.productIds || [],
      productCount: data.productIds ? data.productIds.length : (data.productCount || 0),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return db.transaction((state) => {
      if (!state.collections) {
        state.collections = [];
      }
      state.collections.unshift(newCollection);
      return newCollection;
    });
  }

  public static update(id: string, updates: Partial<Collection>): Collection {
    return db.transaction((state) => {
      if (!state.collections) {
        state.collections = [];
      }
      const index = state.collections.findIndex((c) => c.id === id);
      if (index === -1) {
        throw new Error(`Collection with ID '${id}' not found.`);
      }

      const existing = state.collections[index];
      const updated: Collection = {
        ...existing,
        ...updates,
        productCount: updates.productIds ? updates.productIds.length : existing.productCount,
        updatedAt: new Date().toISOString(),
      };

      state.collections[index] = updated;
      return updated;
    });
  }

  public static delete(id: string): boolean {
    return db.transaction((state) => {
      if (!state.collections) return false;
      const index = state.collections.findIndex((c) => c.id === id);
      if (index === -1) return false;
      state.collections.splice(index, 1);
      return true;
    });
  }
}
