import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/src/lib/supabase';
import { CategoryRepository } from '@/server/repositories/categoryRepository';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const decoded = decodeURIComponent(id).trim();
    const slug = decoded.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .or(`slug.eq.${slug},name.ilike.${decoded}`)
        .single();

      if (!error && data) {
        return NextResponse.json({ success: true, data });
      }
    }

    const all = CategoryRepository.getAll();
    const found = all.find((c) => c.category === slug || c.category === decoded.toLowerCase());
    if (found) {
      return NextResponse.json({ success: true, data: found });
    }

    return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Category identifier is required.' }, { status: 400 });
    }

    const decoded = decodeURIComponent(id).trim();
    const slug = decoded.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // 1. Primary: Supabase PostgreSQL
    if (isSupabaseConfigured()) {
      // Check if products are actively linked to this category
      const { data: linkedProds } = await supabase
        .from('products')
        .select('id, name')
        .or(`category.eq.${slug},category.eq.${decoded.toLowerCase()}`)
        .limit(1);

      if (linkedProds && linkedProds.length > 0) {
        return NextResponse.json(
          {
            success: false,
            error: `Cannot delete category "${decoded}" because it has active products. Please reassign or delete the products first.`,
          },
          { status: 400 }
        );
      }

      const { error: delErr } = await supabase
        .from('categories')
        .delete()
        .or(`slug.eq.${slug},name.ilike.${decoded}`);

      if (delErr) {
        return NextResponse.json({ success: false, error: delErr.message }, { status: 500 });
      }
    }

    // 2. Sync Local Store
    CategoryRepository.delete(decoded);

    return NextResponse.json({
      success: true,
      message: `Category "${decoded}" deleted successfully.`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
