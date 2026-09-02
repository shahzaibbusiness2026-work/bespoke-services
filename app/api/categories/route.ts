import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/src/lib/supabase';
import { CategoryRepository } from '@/server/repositories/categoryRepository';

export async function GET() {
  try {
    // Primary: Supabase PostgreSQL
    if (isSupabaseConfigured()) {
      const { data: catRows, error: catErr } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (!catErr && catRows && catRows.length > 0) {
        // Enrich with product counts
        const { data: prodCounts } = await supabase
          .from('products')
          .select('category');

        const countMap: Record<string, number> = {};
        (prodCounts || []).forEach((p: any) => {
          const cat = (p.category || '').toLowerCase();
          countMap[cat] = (countMap[cat] || 0) + 1;
        });

        const result = catRows.map((c: any) => ({
          category: c.slug || c.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          count: countMap[c.slug] || countMap[c.name.toLowerCase()] || 0,
          label: c.name,
        }));

        return NextResponse.json({
          success: true,
          data: result,
          meta: { source: 'supabase-postgresql' },
        });
      }
    }

    // Graceful Fallback: Local Store
    const list = CategoryRepository.getAll();
    return NextResponse.json({
      success: true,
      data: list,
      meta: { source: 'local-store' },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();
    if (!name) {
      return NextResponse.json({ success: false, error: 'Category name is required.' }, { status: 400 });
    }

    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

    // Primary: Supabase PostgreSQL
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('categories')
        .insert([{ name: name.trim(), slug }])
        .select()
        .single();

      if (!error && data) {
        CategoryRepository.create(name); // keep local in sync
        return NextResponse.json({
          success: true,
          data: { category: slug, count: 0, label: name },
          message: `Category '${name}' created in Supabase PostgreSQL.`,
          meta: { source: 'supabase-postgresql' },
        });
      }
    }

    // Graceful Fallback: Local Store
    const created = CategoryRepository.create(name);
    return NextResponse.json({
      success: true,
      data: created,
      message: `Category '${created}' created successfully.`,
      meta: { source: 'local-store' },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let name = searchParams.get('name') || searchParams.get('category');
    if (!name) {
      try {
        const body = await req.json();
        name = body.name || body.category;
      } catch {}
    }

    if (!name) {
      return NextResponse.json({ success: false, error: 'Category name is required.' }, { status: 400 });
    }

    const decoded = decodeURIComponent(name).trim();
    const slug = decoded.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (isSupabaseConfigured()) {
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

    CategoryRepository.delete(decoded);

    return NextResponse.json({
      success: true,
      message: `Category "${decoded}" deleted successfully.`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

