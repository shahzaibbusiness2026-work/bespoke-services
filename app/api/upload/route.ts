import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { supabase, isSupabaseConfigured } from '@/src/lib/supabase';

const UPLOADS_DIR = path.resolve(process.cwd(), 'public', 'uploads');

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No image file uploaded.' }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase() || '.jpg';
    const cleanBase = path.basename(file.name, ext).toLowerCase().replace(/[^a-z0-9]/g, '-');
    const filename = `${cleanBase}-${Date.now()}${ext}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. If Supabase is configured, upload to Supabase Storage
    if (isSupabaseConfigured()) {
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from('product-media')
        .upload(filename, buffer, {
          contentType: file.type || 'image/jpeg',
          upsert: true,
        });

      if (!uploadErr && uploadData) {
        const { data: publicUrlData } = supabase.storage
          .from('product-media')
          .getPublicUrl(filename);

        return NextResponse.json({
          success: true,
          message: 'Image uploaded successfully to Supabase Storage.',
          data: {
            url: publicUrlData.publicUrl,
            filename,
            size: file.size,
            mimetype: file.type,
            provider: 'supabase-storage',
          },
        });
      }
    }

    // 2. Local disk fallback
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }

    const filePath = path.join(UPLOADS_DIR, filename);
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({
      success: true,
      message: 'Image uploaded successfully to local CDN.',
      data: {
        url: `/uploads/${filename}`,
        filename,
        size: file.size,
        mimetype: file.type,
        provider: 'local-disk',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    // 1. Try Supabase Storage
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.storage.from('product-media').list();
      if (!error && data && data.length > 0) {
        const mediaList = data.map((item) => {
          const { data: urlData } = supabase.storage
            .from('product-media')
            .getPublicUrl(item.name);

          return {
            filename: item.name,
            url: urlData.publicUrl,
            size: item.metadata?.size || 0,
            createdAt: item.created_at || new Date().toISOString(),
          };
        });

        return NextResponse.json({ success: true, data: mediaList });
      }
    }

    // 2. Local disk
    if (!fs.existsSync(UPLOADS_DIR)) {
      return NextResponse.json({ success: true, data: [] });
    }

    const files = fs.readdirSync(UPLOADS_DIR);
    const mediaList = files
      .filter((f) => /\.(jpe?g|png|webp|avif|gif)$/i.test(f))
      .map((filename) => {
        const stats = fs.statSync(path.join(UPLOADS_DIR, filename));
        return {
          filename,
          url: `/uploads/${filename}`,
          size: stats.size,
          createdAt: stats.birthtime.toISOString(),
        };
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ success: true, data: mediaList });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
