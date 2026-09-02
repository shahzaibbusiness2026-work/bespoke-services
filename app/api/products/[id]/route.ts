import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/src/lib/supabase';
import { ProductRepository } from '@/server/repositories/productRepository';
import { mapDbProductToProduct, mapProductToDbProduct } from '@/src/lib/db-mappers';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Primary: Supabase PostgreSQL
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (!error && data) {
        return NextResponse.json({
          success: true,
          data: mapDbProductToProduct(data),
          meta: { source: 'supabase-postgresql' },
        });
      }
    }

    // Graceful Fallback: Local Store
    const product = ProductRepository.findById(id);
    if (!product) {
      return NextResponse.json({ success: false, error: `Product '${id}' not found.` }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: product,
      meta: { source: 'local-store' },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    // Primary: Supabase PostgreSQL
    if (isSupabaseConfigured()) {
      const dbRecord = mapProductToDbProduct(body);

      const { data, error } = await supabase
        .from('products')
        .update(dbRecord)
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        // If images provided, update product_images
        if (Array.isArray(body.images)) {
          await supabase.from('product_images').delete().eq('product_id', id);
          if (body.images.length > 0) {
            const imageRows = body.images.map((imgUrl: string, idx: number) => ({
              product_id: id,
              url: imgUrl,
              display_order: idx,
              is_primary: idx === 0,
            }));
            await supabase.from('product_images').insert(imageRows);
          }
        }

        return NextResponse.json({
          success: true,
          data: mapDbProductToProduct(data),
          message: 'Product updated in Supabase PostgreSQL.',
          meta: { source: 'supabase-postgresql' },
        });
      }
    }

    // Graceful Fallback: Local Store
    const updated = ProductRepository.update(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: `Product '${id}' not found.` }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Product updated successfully.',
      meta: { source: 'local-store' },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Primary: Supabase PostgreSQL
    if (isSupabaseConfigured()) {
      await supabase.from('product_images').delete().eq('product_id', id);
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (!error) {
        // Also remove from local fallback for consistency
        ProductRepository.delete(id);
        return NextResponse.json({
          success: true,
          message: `Product '${id}' deleted from Supabase catalog.`,
          meta: { source: 'supabase-postgresql' },
        });
      }
    }

    // Graceful Fallback: Local Store
    ProductRepository.delete(id);
    return NextResponse.json({
      success: true,
      message: 'Product removed from catalog.',
      meta: { source: 'local-store' },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { field } = await req.json();

    // Field mapping from camelCase to snake_case if applicable
    const fieldMap: Record<string, string> = {
      inStock: 'in_stock',
      isNew: 'is_new',
      isBestSeller: 'is_bestseller',
      isSale: 'is_sale',
      featured: 'featured',
    };

    const dbField = fieldMap[field] || field;

    const updated = ProductRepository.toggleStatus(id, field);
    if (!updated) {
      return NextResponse.json({ success: false, error: `Product '${id}' not found.` }, { status: 404 });
    }

    if (isSupabaseConfigured()) {
      await supabase
        .from('products')
        .update({ [dbField]: (updated as any)[field] })
        .eq('id', id);
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: `Product ${field} status updated.`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
