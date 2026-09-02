import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const imagesDir = path.join(rootDir, 'public', 'images');
const docsDir = path.join(rootDir, 'docs', 'reference-designs');

// 1. Create directory structures
const directories = [
  path.join(imagesDir, 'brand'),
  path.join(imagesDir, 'hero'),
  path.join(imagesDir, 'categories'),
  path.join(imagesDir, 'products'),
  path.join(imagesDir, 'editorial'),
  path.join(imagesDir, 'bespoke'),
  path.join(imagesDir, 'rooms'),
  path.join(imagesDir, 'hospitality'),
  path.join(imagesDir, 'social'),
  path.join(imagesDir, 'avatars'),
  path.join(imagesDir, 'reference-designs'),
  docsDir,
];

for (const dir of directories) {
  fs.mkdirSync(dir, { recursive: true });
}

console.log('✓ Directory hierarchy created.');

// 2. Brand assets
const faviconSrc = path.join(rootDir, 'public', 'favicon.svg');
const faviconDest = path.join(imagesDir, 'brand', 'favicon.svg');
if (fs.existsSync(faviconSrc)) {
  fs.copyFileSync(faviconSrc, faviconDest);
  console.log('✓ Copied brand favicon to public/images/brand/favicon.svg');
}

// Create logo-monogram.svg if not present
const monogramPath = path.join(imagesDir, 'brand', 'logo-monogram.svg');
const monogramContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 48" width="200" height="48" fill="none">
  <text x="10" y="32" font-family="'Libre Caslon Text', Georgia, serif" font-size="24" font-weight="500" letter-spacing="0.22em" fill="#1a1c1b">BOSKI</text>
  <text x="125" y="32" font-family="'DM Sans', sans-serif" font-size="12" font-weight="600" letter-spacing="0.3em" fill="#c9a227">LIMITED</text>
</svg>`;
if (!fs.existsSync(monogramPath)) {
  fs.writeFileSync(monogramPath, monogramContent, 'utf-8');
  console.log('✓ Created brand monogram in public/images/brand/logo-monogram.svg');
}

// 3. Move and reorganize reference design folder
const oldRefDesignDir = path.join(rootDir, 'reference design');
if (fs.existsSync(oldRefDesignDir)) {
  const folders = fs.readdirSync(oldRefDesignDir);
  for (const folder of folders) {
    const oldPath = path.join(oldRefDesignDir, folder);
    const cleanFolder = folder.replace(/_/g, '-');
    const newPath = path.join(docsDir, cleanFolder);
    fs.cpSync(oldPath, newPath, { recursive: true });
  }
  console.log('✓ Reorganized raw design specs into docs/reference-designs/');
}

// 4. Copy and cleanly rename reference design screenshots
const publicRefDesigns = path.join(rootDir, 'public', 'assets', 'reference-designs');
const refDesignMap = {
  'homepage-desktop.png': 'screen-homepage-desktop.png',
  'bedding-collection.png': 'screen-bedding-collection.png',
  'product-detail.png': 'screen-product-detail.png',
  'bespoke-quote-service.png': 'screen-bespoke-quote-service.png',
  'bulk-orders-trade.png': 'screen-bulk-orders-trade.png',
  'my-account-dashboard.png': 'screen-account-dashboard.png',
  'my-wishlist.png': 'screen-my-wishlist.png',
  'sign-in-sign-up-modal.png': 'screen-auth-modal.png',
  'user-profile-card.png': 'screen-user-profile-card.png',
};

if (fs.existsSync(publicRefDesigns)) {
  for (const [srcName, destName] of Object.entries(refDesignMap)) {
    const src = path.join(publicRefDesigns, srcName);
    const dest = path.join(imagesDir, 'reference-designs', destName);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
    }
  }
  console.log('✓ Organized reference design screenshots in public/images/reference-designs/');
}

// 5. Download remote assets with graceful error handling
const downloadList = [
  // Hero
  { url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=2000&q=85', dest: 'hero/couture-linen-atelier.jpg' },
  { url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2000&q=85', dest: 'hero/raw-silk-loom.jpg' },
  { url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=2000&q=85', dest: 'hero/handcrafted-bedding.jpg' },
  { url: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=2000&q=85', dest: 'hero/atelier-editorial-drape.jpg' },

  // Categories
  { url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=85', dest: 'categories/category-bedding.jpg' },
  { url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=85', dest: 'categories/category-cushions.jpg' },
  { url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85', dest: 'categories/category-throws.jpg' },
  { url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85', dest: 'categories/category-fabrics.jpg' },
  { url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1200&q=85', dest: 'categories/category-bespoke.jpg' },
  { url: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=85', dest: 'categories/category-tableware.jpg' },
  { url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85', dest: 'categories/category-accessories.jpg' },

  // Products
  { url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=85', dest: 'products/product-sateen-ivory.jpg' },
  { url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1200&q=85', dest: 'products/product-sateen-cloud.jpg' },
  { url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=85', dest: 'products/product-linen-duvet-natural.jpg' },
  { url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85', dest: 'products/product-linen-drape-flax.jpg' },
  { url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85', dest: 'products/product-alpaca-throw-oatmeal.jpg' },
  { url: 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1200&q=85', dest: 'products/product-percale-chalk.jpg' },

  // Editorial
  { url: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1600&q=85', dest: 'editorial/lookbook-master-suite.jpg' },
  { url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1600&q=85', dest: 'editorial/lookbook-coastal-sanctuary.jpg' },
  { url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=85', dest: 'editorial/editorial-canvas-01.jpg' },
  { url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=85', dest: 'editorial/editorial-canvas-02.jpg' },
  { url: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1000&q=85', dest: 'editorial/editorial-canvas-03.jpg' },
  { url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=85', dest: 'editorial/editorial-canvas-04.jpg' },
  { url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=85', dest: 'editorial/editorial-canvas-05.jpg' },
  { url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=85', dest: 'editorial/editorial-canvas-06.jpg' },
  { url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=85', dest: 'editorial/editorial-canvas-07.jpg' },

  // Bespoke
  { url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80', dest: 'bespoke/texture-raw-mulberry-silk.jpg' },
  { url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80', dest: 'bespoke/texture-belgian-flax.jpg' },
  { url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80', dest: 'bespoke/texture-cashmere-blend.jpg' },
  { url: 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?auto=format&fit=crop&w=600&q=80', dest: 'bespoke/texture-organic-cotton.jpg' },
  { url: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1600&q=80', dest: 'bespoke/bespoke-atelier-artisan.jpg' },

  // Rooms
  { url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80', dest: 'rooms/room-minimal-penthouse.jpg' },
  { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80', dest: 'rooms/room-modern-loft.jpg' },
  { url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1600&q=80', dest: 'rooms/room-classical-salon.jpg' },
  { url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80', dest: 'rooms/room-atelier-suite.jpg' },

  // Hospitality
  { url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=85', dest: 'hospitality/hospitality-suite-interior.jpg' },

  // Social
  { url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80', dest: 'social/social-loom-detail.jpg' },
  { url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80', dest: 'social/social-linen-sheets.jpg' },
  { url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80', dest: 'social/social-fabric-swatch.jpg' },
  { url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80', dest: 'social/social-morning-light.jpg' },
  { url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80', dest: 'social/social-minimal-bedroom.jpg' },
  { url: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=600&q=80', dest: 'social/social-curated-interior.jpg' },

  // Avatars
  { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', dest: 'avatars/avatar-eleanor-vance.jpg' },
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', dest: 'avatars/avatar-julian-montgomery.jpg' },
  { url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80', dest: 'avatars/avatar-camille-laurent.jpg' },
];

async function downloadFile(url, targetPath) {
  const fullPath = path.join(imagesDir, targetPath);
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).size > 1000) {
    return; // already downloaded
  }

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to download ${url}: ${res.statusText}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  fs.writeFileSync(fullPath, Buffer.from(arrayBuffer));
  console.log(`✓ Downloaded ${targetPath} (${Math.round(arrayBuffer.byteLength / 1024)} KB)`);
}

async function run() {
  console.log('Fetching and saving local image assets...');
  for (const item of downloadList) {
    try {
      await downloadFile(item.url, item.dest);
    } catch (err) {
      console.warn(`! Warning downloading ${item.dest}:`, err.message);
    }
  }
  console.log('✓ All asset downloads finished.');
}

run().catch(console.error);
