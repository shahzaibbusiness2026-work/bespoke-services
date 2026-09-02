import { NextRequest, NextResponse } from 'next/server';
import { CollectionRepository } from '@/server/repositories/collectionRepository';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const season = searchParams.get('season') || undefined;
    const status = searchParams.get('status') || undefined;
    const year = searchParams.has('year') ? Number(searchParams.get('year')) : undefined;
    const search = searchParams.get('search') || undefined;
    const featured = searchParams.has('featured') ? searchParams.get('featured') === 'true' : undefined;

    const collections = CollectionRepository.findAll({
      season,
      status,
      year,
      search,
      featured,
    });

    return NextResponse.json({
      success: true,
      data: collections,
      meta: {
        total: collections.length,
        count: collections.length,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.name || !body.season || !body.coverImage) {
      return NextResponse.json(
        { success: false, error: 'Collection name, season, and cover image are required.' },
        { status: 400 }
      );
    }

    const newCollection = CollectionRepository.create({
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: body.description || '',
      story: body.story || '',
      designInspiration: body.designInspiration || '',
      craftsmanship: body.craftsmanship || '',
      materialPhilosophy: body.materialPhilosophy || '',
      season: body.season,
      year: Number(body.year) || new Date().getFullYear(),
      status: body.status || 'draft',
      coverImage: body.coverImage,
      gallery: Array.isArray(body.gallery) ? body.gallery : [],
      launchDate: body.launchDate || new Date().toISOString().split('T')[0],
      featured: Boolean(body.featured),
      homepageVisible: body.homepageVisible !== undefined ? Boolean(body.homepageVisible) : true,
      seoTitle: body.seoTitle || `${body.name} | BOSKI LIMITED Atelier`,
      seoDescription: body.seoDescription || body.description || '',
      productIds: Array.isArray(body.productIds) ? body.productIds : [],
    });

    return NextResponse.json(
      {
        success: true,
        data: newCollection,
        message: `Collection '${newCollection.name}' created successfully.`,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
