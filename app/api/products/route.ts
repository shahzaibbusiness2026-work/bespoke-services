import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/src/lib/supabase';
import { ProductRepository } from '@/server/repositories/productRepository';
import { mapDbProductToProduct, mapProductToDbProduct } from '@/src/lib/db-mappers';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const inStock = searchParams.has('inStock') ? searchParams.get('inStock') === 'true' : undefined;
    const search = searchParams.get('search') || undefined;
    const limit = searchParams.has('limit') ? Number(searchParams.get('limit')) : 50;

    // Primary: Query Supabase PostgreSQL if configured
    if (isSupabaseConfigured()) {
      let query = supabase.from('products').select('*', { count: 'exact' });

      if (category && category !== 'all') {
        query = query.ilike('category', category);
      }
      if (inStock !== undefined) {
        query = query.eq('in_stock', inStock);
      }
      if (search) {
        query = query.or(`name.ilike.%${search}%,subtitle.ilike.%${search}%,description.ilike.%${search}%`);
      }

      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .limit(limit);

      if (!error && data && data.length > 0) {
        const mappedProducts = data.map(mapDbProductToProduct);
        return NextResponse.json({
          success: true,
          data: mappedProducts,
          meta: {
            total: count || data.length,
            count: mappedProducts.length,
            source: 'supabase-postgresql',
          },
        });
      }
    }

    // Graceful Fallback: Local store repository
    const result = ProductRepository.findAll({
      category,
      inStock,
      search,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: result.products,
      meta: {
        total: result.total,
        count: result.products.length,
        source: 'local-store',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, category, price } = body;

    if (!name || !category || price === undefined) {
      return NextResponse.json(
        { success: false, error: 'Product name, category, and price are required.' },
        { status: 400 }
      );
    }

    const productId = body.id || `prod-${Date.now()}`;
    const productPayload = { ...body, id: productId };

    // Primary: Insert into Supabase
    if (isSupabaseConfigured()) {
      const dbRecord = mapProductToDbProduct(productPayload);

      const { data, error } = await supabase
        .from('products')
        .insert([dbRecord])
        .select()
        .single();

      if (!error && data) {
        // Sync normalized product_images table if images are provided
        if (Array.isArray(body.images) && body.images.length > 0) {
          const imageRows = body.images.map((imgUrl: string, idx: number) => ({
            product_id: productId,
            url: imgUrl,
            display_order: idx,
            is_primary: idx === 0,
          }));
          await supabase.from('product_images').insert(imageRows);
        }

        return NextResponse.json({
          success: true,
          data: mapDbProductToProduct(data),
          message: `Product '${name}' created in Supabase PostgreSQL.`,
          meta: { source: 'supabase-postgresql' },
        });
      }
    }

    // Graceful Fallback: Local store repository
    const created = ProductRepository.create(productPayload);
    return NextResponse.json({
      success: true,
      data: created,
      message: `Product '${created.name}' created in catalog.`,
      meta: { source: 'local-store' },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
