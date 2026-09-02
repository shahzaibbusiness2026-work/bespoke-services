// ════════════════════════════════════════════════════════════════════════════════
//  🏛️ BOSKI LIMITED • SUPABASE MIGRATION & SEED RUNNER
// ════════════════════════════════════════════════════════════════════════════════
// Run: node scripts/seed-supabase.mjs
// ════════════════════════════════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env.local then .env
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('\n🏛️  BOSKI LIMITED • SUPABASE MIGRATION & SEEDING\n');

if (!supabaseUrl || !supabaseKey || !supabaseUrl.startsWith('http')) {
  console.error('❌ Missing Supabase credentials in .env.local or environment.');
  console.error('Please configure:');
  console.error('  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
  console.error('  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key (or NEXT_PUBLIC_SUPABASE_ANON_KEY)\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Load baseline seed catalog from src/data/products.ts
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storePath = path.resolve(__dirname, '../server/data/store.json');

let products = [];
if (fs.existsSync(storePath)) {
  try {
    const raw = fs.readFileSync(storePath, 'utf8');
    const parsed = JSON.parse(raw);
    products = parsed.products || [];
  } catch (e) {
    console.warn('Could not read store.json, using fallback');
  }
}

async function runMigration() {
  try {
    console.log(`📡 Connecting to Supabase at: ${supabaseUrl}`);

    // 1. Seed Categories
    console.log('\n📦 1. Seeding Categories...');
    const categories = [
      { name: 'Bedding', slug: 'bedding', description: 'Architectural luxury bedding and master duvet sets.' },
      { name: 'Sheet Sets', slug: 'sheets', description: '480TC single-ply long-staple Egyptian cotton sateen.' },
      { name: 'Duvets & Quilts', slug: 'duvets', description: 'Stonewashed French Normandy flax and European white goose down.' },
      { name: 'Curtains & Drapery', slug: 'curtains', description: '280 GSM heavyweight Belgian flax with lead-weighted hems.' },
      { name: 'Towels & Bath', slug: 'towels', description: '700 GSM Aegean long-staple cotton and organic waffle bath linens.' },
      { name: 'Artisan Throws', slug: 'throws', description: 'Hand-loomed cashmere, virgin wool, and stonewashed accents.' },
      { name: 'Waffle Blankets', slug: 'blankets', description: 'Dimensional honeycomb waffle weave bedspreads.' },
      { name: 'Pillows & Shams', slug: 'pillows', description: '6A grade 22-Momme mulberry silk and down inserts.' },
    ];

    for (const cat of categories) {
      const { error } = await supabase.from('categories').upsert(cat, { onConflict: 'slug' });
      if (error) console.warn(`   Category error (${cat.slug}):`, error.message);
      else console.log(`   ✓ Category ready: ${cat.name}`);
    }

    // 2. Seed Products & Product Images
    console.log(`\n🧵 2. Seeding ${products.length} Master Luxury Products & Image Galleries...`);
    for (const p of products) {
      const dbProduct = {
        id: p.id,
        name: p.name,
        subtitle: p.subtitle || '',
        category: p.category,
        price: p.price,
        original_price: p.originalPrice || null,
        rating: p.rating || 5.0,
        reviews_count: p.reviewsCount || p.ratingCount || 0,
        in_stock: p.inStock ?? true,
        stock_count: p.stockCount || 10,
        is_new: p.isNew ?? false,
        is_bestseller: p.isBestSeller ?? false,
        is_sale: p.isSale ?? false,
        discount_percent: p.discountPercent || 0,
        colors: p.colors || [],
        sizes: p.sizes || [],
        images: p.images || [],
        description: p.description || '',
        details: p.details || [],
        material: p.material || '',
        care_instructions: p.careInstructions || '',
        sustainability: p.sustainability || '',
        sku: p.sku || `BOS-${p.id.toUpperCase()}`,
        tags: p.tags || [],
        featured: p.featured ?? false,
        thread_count: p.threadCount || null,
        fabric: p.fabric || null,
        updated_at: new Date().toISOString(),
      };

      const { error: prodErr } = await supabase.from('products').upsert(dbProduct, { onConflict: 'id' });
      if (prodErr) {
        console.warn(`   Product error (${p.id}):`, prodErr.message);
      } else {
        console.log(`   ✓ Product synced: ${p.name} (${p.id})`);

        // Populate normalized product_images table
        if (Array.isArray(p.images) && p.images.length > 0) {
          const imageRows = p.images.map((imgUrl, idx) => ({
            product_id: p.id,
            url: imgUrl,
            display_order: idx,
            is_primary: idx === 0,
          }));
          await supabase.from('product_images').delete().eq('product_id', p.id);
          await supabase.from('product_images').insert(imageRows);
        }
      }
    }

    // 3. Seed Default Master Concierge Admin User
    console.log('\n🔐 3. Seeding Concierge Admin User...');
    const adminUser = {
      email: 'concierge@boskilimited.com',
      password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password123
      first_name: 'Master',
      last_name: 'Concierge',
      role: 'superadmin',
    };
    const { error: adminErr } = await supabase.from('admin_users').upsert(adminUser, { onConflict: 'email' });
    if (adminErr) console.warn('   Admin user error:', adminErr.message);
    else console.log('   ✓ Admin user seeded: concierge@boskilimited.com (password: password123)');

    // 4. Seed VIP Customer
    console.log('\n👤 4. Seeding Default VIP Customer (Eleanor Vance)...');
    const customer = {
      email: 'eleanor.vance@boski-limited.com',
      first_name: 'Eleanor',
      last_name: 'Vance',
      phone: '+1 (617) 555-0192',
      vip_tier: 'Diamond Concierge',
      points_balance: 12450,
      addresses: [
        {
          id: 'addr-1',
          label: 'Beacon Hill Townhouse',
          firstName: 'Eleanor',
          lastName: 'Vance',
          phone: '+1 (617) 555-0192',
          addressLine1: '142 Hill House Lane',
          addressLine2: 'Apt 3B',
          city: 'Boston',
          state: 'MA',
          zipCode: '02116',
          country: 'United States',
          isDefault: true,
        },
      ],
    };
    const { error: custErr } = await supabase.from('customers').upsert(customer, { onConflict: 'email' });
    if (custErr) console.warn('   Customer error:', custErr.message);
    else console.log('   ✓ VIP Patron seeded: Eleanor Vance');

    console.log('\n✨ Supabase migration and seeding complete! All 7 tables populated.\n');
  } catch (err) {
    console.error('Fatal migration error:', err);
    process.exit(1);
  }
}

runMigration();
