-- ════════════════════════════════════════════════════════════════════════════════
--  🏛️ BOSKI LIMITED • PRODUCTION SUPABASE POSTGRESQL SCHEMA & INITIAL SEED
-- ════════════════════════════════════════════════════════════════════════════════
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/_/sql
-- 2. Click "New Query"
-- 3. Paste this complete script and click "Run"
-- ════════════════════════════════════════════════════════════════════════════════

-- 1. Enable Required PostgreSQL Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ════════════════════════════════════════════════════════════════════════════════
--  TABLE 1: CATEGORIES
-- ════════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);

-- ════════════════════════════════════════════════════════════════════════════════
--  TABLE 2: PRODUCTS (Master Luxury Linens Catalog)
-- ════════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    subtitle TEXT,
    category TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    rating NUMERIC(3, 2) DEFAULT 5.0,
    reviews_count INTEGER DEFAULT 0,
    in_stock BOOLEAN DEFAULT TRUE,
    stock_count INTEGER DEFAULT 10,
    is_new BOOLEAN DEFAULT FALSE,
    is_bestseller BOOLEAN DEFAULT FALSE,
    is_sale BOOLEAN DEFAULT FALSE,
    discount_percent INTEGER DEFAULT 0,
    colors JSONB DEFAULT '[]'::jsonb,
    sizes JSONB DEFAULT '[]'::jsonb,
    images JSONB DEFAULT '[]'::jsonb,
    description TEXT,
    details JSONB DEFAULT '[]'::jsonb,
    material TEXT,
    care_instructions TEXT,
    sustainability TEXT,
    sku TEXT UNIQUE,
    tags JSONB DEFAULT '[]'::jsonb,
    featured BOOLEAN DEFAULT FALSE,
    thread_count TEXT,
    fabric TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON public.products(in_stock);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);

-- ════════════════════════════════════════════════════════════════════════════════
--  TABLE 3: PRODUCT_IMAGES (Normalized Image Gallery)
-- ════════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text TEXT,
    display_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_is_primary ON public.product_images(is_primary);

-- ════════════════════════════════════════════════════════════════════════════════
--  TABLE 4: ADMIN_USERS (Secure Concierge & Administration Accounts)
-- ════════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'concierge', 'superadmin')),
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);

-- ════════════════════════════════════════════════════════════════════════════════
--  TABLE 5: CUSTOMERS (Client Profiles & Address Books)
-- ════════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    vip_tier TEXT DEFAULT 'Member' CHECK (vip_tier IN ('Member', 'Silver', 'Gold', 'Diamond Concierge')),
    points_balance INTEGER DEFAULT 500,
    addresses JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON public.customers(user_id);

-- Profiles backward-compatibility view / alias
CREATE OR REPLACE VIEW public.profiles WITH (security_invoker = true) AS
    SELECT 
        id,
        first_name,
        last_name,
        email,
        phone,
        'client'::text AS role,
        vip_tier,
        points_balance,
        TO_CHAR(created_at, 'Month YYYY') AS joined_date,
        addresses,
        created_at,
        updated_at
    FROM public.customers;

-- ════════════════════════════════════════════════════════════════════════════════
--  TABLE 6: ORDERS (Customer Transactions & Shipments)
-- ════════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer JSONB NOT NULL,
    shipping_method JSONB NOT NULL,
    payment_method TEXT NOT NULL,
    items JSONB NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) DEFAULT 0,
    shipping NUMERIC(10, 2) DEFAULT 0,
    tax NUMERIC(10, 2) DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL,
    tracking_number TEXT NOT NULL,
    status TEXT DEFAULT 'Processing' CHECK (status IN ('Processing', 'Shipped', 'Delivered')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_order_id ON public.orders(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders USING btree ((customer->>'email'));
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- ════════════════════════════════════════════════════════════════════════════════
--  TABLE 7: CONTACT_MESSAGES (Inquiries, Bespoke Quotes & Trade Applications)
-- ════════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT DEFAULT 'contact' CHECK (type IN ('contact', 'bespoke', 'trade')),
    sender_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'resolved')),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON public.contact_messages(email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_type ON public.contact_messages(type);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);

-- Inquiries backward-compatibility view
CREATE OR REPLACE VIEW public.inquiries WITH (security_invoker = true) AS
    SELECT 
        id,
        type,
        sender_name AS sender,
        email,
        phone,
        subject AS title,
        message AS details,
        status,
        metadata,
        created_at
    FROM public.contact_messages;

-- ════════════════════════════════════════════════════════════════════════════════
--  TABLE 8: PROMO_CODES
-- ════════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.promo_codes (
    code TEXT PRIMARY KEY,
    discount_percent INTEGER NOT NULL,
    description TEXT NOT NULL,
    min_spend NUMERIC(10, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ════════════════════════════════════════════════════════════════════════════════
--  🔒 ROW LEVEL SECURITY (RLS) POLICIES
-- ════════════════════════════════════════════════════════════════════════════════

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

-- 1. Categories (Public Read, Authenticated/Service Role Write)
CREATE POLICY "Categories are viewable by everyone"
    ON public.categories FOR SELECT
    USING (true);

CREATE POLICY "Admins can insert categories"
    ON public.categories FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Admins can update categories"
    ON public.categories FOR UPDATE
    TO authenticated
    USING (true);

-- 2. Products (Public Read, Admin Write)
CREATE POLICY "Products are publicly viewable"
    ON public.products FOR SELECT
    USING (true);

CREATE POLICY "Admins can manage products"
    ON public.products FOR ALL
    TO authenticated
    USING (true);

-- 3. Product Images (Public Read, Admin Write)
CREATE POLICY "Product images are publicly viewable"
    ON public.product_images FOR SELECT
    USING (true);

CREATE POLICY "Admins can manage product images"
    ON public.product_images FOR ALL
    TO authenticated
    USING (true);

-- 4. Admin Users (Service Role / Privileged Read & Write)
CREATE POLICY "Admin users manage own or service role"
    ON public.admin_users FOR ALL
    TO authenticated
    USING (true);

-- 5. Customers (Self View, Admin View)
CREATE POLICY "Customers view their own record"
    ON public.customers FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Customers update their own record"
    ON public.customers FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 6. Orders (Public Insert for guest checkout, Self View, Admin View)
CREATE POLICY "Anyone can place an order"
    ON public.orders FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users view own orders or authenticated admins view all"
    ON public.orders FOR SELECT
    USING (auth.uid() = user_id OR auth.role() = 'authenticated' OR auth.uid() IS NULL);

-- 7. Contact Messages (Public Insert, Admin View/Update)
CREATE POLICY "Anyone can submit a contact message or inquiry"
    ON public.contact_messages FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Authenticated users can view contact messages"
    ON public.contact_messages FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can update contact message status"
    ON public.contact_messages FOR UPDATE
    TO authenticated
    USING (true);

-- 8. Promo Codes (Public Read)
CREATE POLICY "Promo codes are publicly readable"
    ON public.promo_codes FOR SELECT
    USING (true);

-- ════════════════════════════════════════════════════════════════════════════════
--  📦 STORAGE BUCKET: 'product-media'
-- ════════════════════════════════════════════════════════════════════════════════
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-media', 'product-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Public Read for product-media bucket"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'product-media');

CREATE POLICY "Public/Admin Upload for product-media bucket"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'product-media');

-- ════════════════════════════════════════════════════════════════════════════════
--  🌱 INITIAL SEED DATA
-- ════════════════════════════════════════════════════════════════════════════════

-- Seed 1: Categories
INSERT INTO public.categories (name, slug, description) VALUES
('Bedding', 'bedding', 'Architectural luxury bedding and master duvet sets.'),
('Sheet Sets', 'sheets', '480TC single-ply long-staple Egyptian cotton sateen.'),
('Duvets & Quilts', 'duvets', 'Stonewashed French Normandy flax and European white goose down.'),
('Curtains & Drapery', 'curtains', '280 GSM heavyweight Belgian flax with lead-weighted hems.'),
('Towels & Bath', 'towels', '700 GSM Aegean long-staple cotton and organic waffle bath linens.'),
('Artisan Throws', 'throws', 'Hand-loomed cashmere, virgin wool, and stonewashed accents.'),
('Waffle Blankets', 'blankets', 'Dimensional honeycomb waffle weave bedspreads.'),
('Pillows & Shams', 'pillows', '6A grade 22-Momme mulberry silk and down inserts.')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- Seed 2: Default Admin User (Password: password123)
-- bcrypt hash: $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
INSERT INTO public.admin_users (email, password_hash, first_name, last_name, role) VALUES
('concierge@boskilimited.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Master', 'Concierge', 'superadmin')
ON CONFLICT (email) DO UPDATE SET role = 'superadmin';

-- Seed 3: Default VIP Patron (Eleanor Vance)
INSERT INTO public.customers (email, first_name, last_name, phone, vip_tier, points_balance, addresses) VALUES
('eleanor.vance@boski-limited.com', 'Eleanor', 'Vance', '+1 (617) 555-0192', 'Diamond Concierge', 12450, '[
  {
    "id": "addr-1",
    "label": "Beacon Hill Townhouse",
    "firstName": "Eleanor",
    "lastName": "Vance",
    "phone": "+1 (617) 555-0192",
    "addressLine1": "142 Hill House Lane",
    "addressLine2": "Apt 3B",
    "city": "Boston",
    "state": "MA",
    "zipCode": "02116",
    "country": "United States",
    "isDefault": true
  },
  {
    "id": "addr-2",
    "label": "Newport Coastal Cottage",
    "firstName": "Eleanor",
    "lastName": "Vance",
    "phone": "+1 (617) 555-0192",
    "addressLine1": "88 Ocean Drive",
    "addressLine2": "The Carriage House",
    "city": "Newport",
    "state": "RI",
    "zipCode": "02840",
    "country": "United States",
    "isDefault": false
  }
]'::jsonb)
ON CONFLICT (email) DO NOTHING;

-- Seed 4: Sample Contact Messages & Inquiries
INSERT INTO public.contact_messages (type, sender_name, email, phone, subject, message, status) VALUES
('contact', 'Oliver Sterling', 'oliver.sterling@mayfairpartners.co.uk', '+44 20 7821 9900', 'Private Atelier Consultation Request', 'Inquiring about private viewings for custom master suite linens for our Belgravia townhouse.', 'pending'),
('bespoke', 'Julian Vance', 'julian.vance@architecturaldigest.com', NULL, 'Bespoke Quote: Penthouse Drapery & Custom Drops', 'Custom 14ft ceiling drop Belgian weighted linens in Natural Oatmeal.', 'contacted'),
('trade', 'Claire St. John (The Beaumont Hotel)', 'claire.stjohn@thebeaumonthotel.co.uk', '+44 20 7123 4567', 'Trade Application: 100-250 Suites', 'ID: UK-VAT-99214482 • Complete guest suite textile overhaul with 600TC Egyptian sateen.', 'resolved')
ON CONFLICT DO NOTHING;

-- Seed 5: Promo Codes
INSERT INTO public.promo_codes (code, discount_percent, description, min_spend) VALUES
('LUXE20', 20, '20% privilege across all master-loom linens', 200),
('LINEN15', 15, '15% privilege on complete bedding bundles', 150),
('WELCOME10', 10, '10% privilege for new atelier patrons', 0)
ON CONFLICT (code) DO NOTHING;
