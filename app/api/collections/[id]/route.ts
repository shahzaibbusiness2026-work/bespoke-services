import { NextRequest, NextResponse } from 'next/server';
import { CollectionRepository } from '@/server/repositories/collectionRepository';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const collection = CollectionRepository.findById(id);

    if (!collection) {
      return NextResponse.json(
        { success: false, error: `Collection '${id}' not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: collection,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await req.json();

    const updated = CollectionRepository.update(id, updates);
    return NextResponse.json({
      success: true,
      data: updated,
      message: `Collection '${updated.name}' updated successfully.`,
    });
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
    const deleted = CollectionRepository.delete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: `Collection '${id}' not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Collection '${id}' removed from archive.`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
