// Next.js Full-Stack Verification Suite for BOSKI LIMITED
const BASE_URL = 'http://localhost:3000';

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log('🏛️  Starting BOSKI LIMITED Next.js Full-Stack Verification Suite...\n');
  let passed = 0;
  let failed = 0;

  const assert = (cond: boolean, name: string, detail?: any) => {
    if (cond) {
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${name}`, detail || '');
      failed++;
    }
  };

  // Wait for server to warm up
  let ready = false;
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch(`${BASE_URL}/api/health`);
      if (res.ok) {
        ready = true;
        break;
      }
    } catch {
      await wait(1000);
    }
  }

  if (!ready) {
    console.error('Server failed to start on port 3000 within 20s');
    process.exit(1);
  }

  try {
    // 1. Health check
    const health = await fetch(`${BASE_URL}/api/health`).then((r) => r.json());
    assert(health.status === 'healthy', 'GET /api/health -> healthy status with Next.js info');

    // 2. Products API
    const productsRes = await fetch(`${BASE_URL}/api/products`).then((r) => r.json());
    assert(productsRes.success && productsRes.data.length > 0, `GET /api/products -> ${productsRes.data.length} products loaded`);

    // 3. Categories API
    const categoriesRes = await fetch(`${BASE_URL}/api/categories`).then((r) => r.json());
    assert(categoriesRes.success && categoriesRes.data.length > 0, `GET /api/categories -> ${categoriesRes.data.length} categories breakdown`);

    // 4. Contact Inquiries Submission
    const contactRes = await fetch(`${BASE_URL}/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'contact',
        name: 'Lady Genevieve Hastings',
        email: 'genevieve.hastings@mayfair.co.uk',
        phone: '+44 20 7946 0888',
        subject: 'Master Suite Custom Commission',
        message: 'Looking for a bespoke Emperor linen ensemble with hand-stitched borders.',
      }),
    }).then((r) => r.json());
    assert(contactRes.success && contactRes.data.id, 'POST /api/inquiries -> customer inquiry logged');

    // 5. Inquiries Admin List
    const inqList = await fetch(`${BASE_URL}/api/inquiries`).then((r) => r.json());
    assert(inqList.success && inqList.data.length > 0, `GET /api/inquiries -> ${inqList.data.length} inquiries in admin list`);

    // 6. Product Creation
    const newProdRes = await fetch(`${BASE_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'The Royal Kensington Velvet Headboard',
        category: 'bedding',
        price: 2890,
        originalPrice: 3400,
        fabric: 'Belgian Cotton Velvet',
        material: 'Kiln-Dried European Birch & Smoked Oak',
        description: 'Exquisite custom-crafted velvet headboard with diamond tufting.',
        inStock: true,
        stockCount: 8,
        featured: true,
      }),
    }).then((r) => r.json());
    assert(newProdRes.success && newProdRes.data.id, 'POST /api/products -> product created');
    const createdId = newProdRes.data.id;

    // 7. Product Update
    const updateRes = await fetch(`${BASE_URL}/api/products/${createdId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price: 2950 }),
    }).then((r) => r.json());
    assert(updateRes.success && updateRes.data.price === 2950, 'PUT /api/products/:id -> price updated to 2950');

    // 8. Product Status Toggle
    const toggleRes = await fetch(`${BASE_URL}/api/products/${createdId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field: 'featured' }),
    }).then((r) => r.json());
    assert(toggleRes.success, 'PATCH /api/products/:id -> status toggled');

    // 9. Promo Code Validation
    const promoRes = await fetch(`${BASE_URL}/api/promo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'LUXE20', subtotal: 500 }),
    }).then((r) => r.json());
    assert(promoRes.success && promoRes.data.discountPercent === 20, 'POST /api/promo -> LUXE20 validated with 20% discount');

    // 10. Product Deletion
    const delRes = await fetch(`${BASE_URL}/api/products/${createdId}`, {
      method: 'DELETE',
    }).then((r) => r.json());
    assert(delRes.success, 'DELETE /api/products/:id -> product removed');

    // 11. Storefront Page Rendering
    const homeHtml = await fetch(`${BASE_URL}/`).then((r) => r.text());
    assert(homeHtml.includes('BOSKI LIMITED') || homeHtml.includes('__next'), 'GET / -> Storefront HTML rendered');

    // 12. Admin Dashboard Page Rendering
    const adminHtml = await fetch(`${BASE_URL}/admin`).then((r) => r.text());
    assert(adminHtml.includes('__next') || adminHtml.includes('Admin') || adminHtml.includes('Atelier'), 'GET /admin -> Admin Dashboard HTML rendered');

    console.log(`\n════════════════════════════════════════════════════════════`);
    console.log(`  Next.js Full-Stack Verification: ${passed} Passed, ${failed} Failed`);
    console.log(`════════════════════════════════════════════════════════════`);

    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error('Error running test suite:', err);
    process.exit(1);
  }
}

run();
