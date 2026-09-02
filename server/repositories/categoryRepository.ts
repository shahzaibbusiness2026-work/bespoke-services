import { db } from '../data/store';

export class CategoryRepository {
  public static getAll(): { category: string; count: number }[] {
    const products = db.get('products') || [];
    const registered = db.get('categories') || [
      'bedding',
      'sheets',
      'duvets',
      'curtains',
      'towels',
      'throws',
      'blankets',
      'pillows',
    ];

    const counts: Record<string, number> = {};

    // Count products per category
    products.forEach((p) => {
      const cat = p.category.toLowerCase();
      counts[cat] = (counts[cat] || 0) + 1;
    });

    // Ensure all registered categories appear even if count is 0
    registered.forEach((c) => {
      const lower = c.toLowerCase();
      if (counts[lower] === undefined) {
        counts[lower] = 0;
      }
    });

    return Object.entries(counts).map(([category, count]) => ({ category, count }));
  }

  public static create(name: string): string {
    const clean = name.trim().toLowerCase();
    if (!clean) throw new Error('Category name cannot be empty.');

    return db.transaction((state) => {
      if (!state.categories) {
        state.categories = ['bedding', 'sheets', 'duvets', 'curtains', 'towels', 'throws', 'blankets', 'pillows'];
      }

      if (state.categories.some((c) => c.toLowerCase() === clean)) {
        throw new Error(`Category '${clean}' already exists.`);
      }

      state.categories.push(clean);
      return clean;
    });
  }

  public static delete(name: string): boolean {
    const clean = name.trim().toLowerCase();
    const slug = clean.replace(/[^a-z0-9]+/g, '-');
    return db.transaction((state) => {
      if (!state.categories) {
        state.categories = ['bedding', 'sheets', 'duvets', 'curtains', 'towels', 'throws', 'blankets', 'pillows'];
      }
      const initial = state.categories.length;
      state.categories = state.categories.filter((c) => {
        const cLower = c.toLowerCase();
        const cSlug = cLower.replace(/[^a-z0-9]+/g, '-');
        return cLower !== clean && cSlug !== slug && cLower !== slug;
      });
      return state.categories.length < initial;
    });
  }
}
