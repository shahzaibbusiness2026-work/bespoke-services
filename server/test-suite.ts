// Automated Comprehensive Verification Suite for BOSKI LIMITED
const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🏛️  Starting BOSKI LIMITED Full-Stack Backend Verification Suite...\n');
  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean, testName: string, detail?: any) => {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`, detail || '');
      failed++;
    }
  };

  try {
    // 1. Health Check
    const healthRes = await fetch(`${BASE_URL}/health`).then((r) => r.json());
    assert(healthRes.status === 'healthy', 'GET /api/health returns healthy status');

    // 2. Categories API
    const catRes = await fetch(`${BASE_URL}/categories`).then((r) => r.json());
    assert(catRes.success && catRes.data.length > 0, 'GET /api/categories returns category breakdown');

    // 3. Admin Authentication
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'concierge@boskilimited.com',
        password: 'password123',
      }),
    }).then((r) => r.json());
    assert(
      adminLoginRes.success && adminLoginRes.data.user.role === 'admin' && adminLoginRes.data.token,
      'POST /api/auth/login authenticates Master Admin and issues admin JWT'
    );
    const adminToken = adminLoginRes.data.token;

    // 4. Product Creation via Admin
    const createProdRes = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        name: 'The Sovereign Emperor Velvet Bedframe',
        subtitle: 'Hand-Tufted Architectural Belgian Velvet with Smoked Oak Base',
        category: 'bedding',
        price: 3450,
        originalPrice: 4200,
        fabric: 'Royal Cotton Velvet & French Smoked Oak',
        threadCount: 'Architectural Frame',
        material: 'Solid Kiln-Dried European Oak & High-Resilience Core',
        description: 'A monument of understated luxury. Designed for grand primary suites.',
        inStock: true,
        stockCount: 5,
        featured: true,
        colors: [
          {
            name: 'Onyx Charcoal',
            hex: '#1A1C1B',
            image: 'https://images.unsplash.com/photo-1540518614846-7ede433c4550',
          },
        ],
        sizes: ['King', 'Super King', 'Emperor'],
        images: ['https://images.unsplash.com/photo-1540518614846-7ede433c4550'],
      }),
    }).then((r) => r.json());
    assert(
      createProdRes.success && createProdRes.data.id && createProdRes.data.name.includes('Sovereign'),
      'POST /api/products creates new product in database'
    );
    const createdProductId = createProdRes.data.id;

    // 5. Product Update via Admin
    const updateProdRes = await fetch(`${BASE_URL}/products/${createdProductId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        price: 3600,
        stockCount: 4,
      }),
    }).then((r) => r.json());
    assert(
      updateProdRes.success && updateProdRes.data.price === 3600,
      'PUT /api/products/:id updates price and inventory'
    );

    // 6. Product Status Toggle (InStock / Featured)
    const toggleStatusRes = await fetch(`${BASE_URL}/products/${createdProductId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ field: 'featured' }),
    }).then((r) => r.json());
    assert(toggleStatusRes.success, 'PATCH /api/products/:id/status toggles product flags');

    // 7. Category Management via Admin
    const testCategoryName = `velvet-craft-${Date.now()}`;
    const createCatRes = await fetch(`${BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ name: testCategoryName }),
    }).then((r) => r.json());
    assert(createCatRes.success, 'POST /api/categories adds custom product category');

    // 8. Customer Contact Form Submission
    const contactRes = await fetch(`${BASE_URL}/inquiries/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Lord Hamilton Grey',
        email: 'hamilton.grey@mayfair-manor.com',
        phone: '+44 20 7946 0123',
        subject: 'Custom Atelier Bedframe Commission',
        message: 'Interested in commissioning a bespoke Emperor frame in bespoke Sage Velvet.',
      }),
    }).then((r) => r.json());
    assert(contactRes.success && contactRes.data.id, 'POST /api/inquiries/contact logs customer support message');

    // 9. Admin Consolidated Inquiries Inbox
    const allInquiriesRes = await fetch(`${BASE_URL}/inquiries/all`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    }).then((r) => r.json());
    assert(
      allInquiriesRes.success && allInquiriesRes.data.length > 0,
      'GET /api/inquiries/all returns consolidated inbox across contact, bespoke & trade'
    );

    // 10. Update Inquiry Resolution Status
    const inquiryToUpdate = allInquiriesRes.data[0];
    const updateInqStatusRes = await fetch(`${BASE_URL}/inquiries/${inquiryToUpdate.id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ status: 'contacted' }),
    }).then((r) => r.json());
    assert(updateInqStatusRes.success, 'PATCH /api/inquiries/:id/status updates status to contacted');

    // 11. Image Upload via Multer
    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
    const fakeImageData = 'GIF89a\x01\x00\x01\x00\x80\x00\x00\xff\xff\xff\x00\x00\x00!\xf9\x04\x01\x00\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;';
    const bodyParts = [
      `--${boundary}`,
      'Content-Disposition: form-data; name="image"; filename="test-swatch.gif"',
      'Content-Type: image/gif',
      '',
      fakeImageData,
      `--${boundary}--`,
      '',
    ].join('\r\n');

    const uploadRes = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        Authorization: `Bearer ${adminToken}`,
      },
      body: bodyParts,
    }).then((r) => r.json());
    assert(uploadRes.success && uploadRes.data.url.startsWith('/uploads/'), 'POST /api/upload uploads image to /uploads CDN');

    // 12. Media Gallery Listing
    const mediaListRes = await fetch(`${BASE_URL}/upload/media`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    }).then((r) => r.json());
    assert(mediaListRes.success && mediaListRes.data.length > 0, 'GET /api/upload/media lists uploaded media assets');

    // 13. Delete Test Product
    const deleteProdRes = await fetch(`${BASE_URL}/products/${createdProductId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    }).then((r) => r.json());
    assert(deleteProdRes.success, 'DELETE /api/products/:id deletes product from catalog');

    console.log(`\n════════════════════════════════════════════════════════════`);
    console.log(`  Full-Stack Verification: ${passed} Passed, ${failed} Failed`);
    console.log(`════════════════════════════════════════════════════════════`);

    if (failed > 0) process.exit(1);
  } catch (error: any) {
    console.error('Unexpected error running test suite:', error);
    process.exit(1);
  }
}

runTests();
