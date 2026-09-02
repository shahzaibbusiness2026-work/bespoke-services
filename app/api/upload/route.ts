import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { getAdminClient, isSupabaseConfigured } from '@/src/lib/supabase';
import { verifyAdmin, isAuthError } from '@/src/lib/auth-guard';

const UPLOADS_DIR = path.resolve(process.cwd(), 'public', 'uploads');

// Allowed MIME types for upload
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
]);

// Allowed extensions (secondary check)
const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif']);

// Max file size: 10 MB
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export async function POST(req: NextRequest) {
  // Require admin authentication
  const authResult = verifyAdmin(req);
  if (isAuthError(authResult)) return authResult;

  try {
    const formData = await req.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No image file uploaded.' }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: `File size exceeds the 10 MB limit. Uploaded: ${(file.size / 1024 / 1024).toFixed(1)} MB.` },
        { status: 400 }
      );
    }

    // Validate MIME type (server-side — not trusting user header)
    const declaredMime = file.type || '';
    if (!ALLOWED_MIME_TYPES.has(declaredMime)) {
      return NextResponse.json(
        { success: false, error: `File type '${declaredMime || 'unknown'}' is not permitted. Allowed: JPEG, PNG, WebP, AVIF, GIF.` },
        { status: 400 }
      );
    }

    // Validate file extension
    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { success: false, error: `File extension '${ext || 'none'}' is not permitted.` },
        { status: 400 }
      );
    }

    // Sanitize filename
    const cleanBase = path.basename(file.name, ext).toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 80);
    const filename = `${cleanBase}-${Date.now()}${ext}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. If Supabase is configured, upload to Supabase Storage using admin client
    if (isSupabaseConfigured()) {
      const adminClient = getAdminClient();
      const { data: uploadData, error: uploadErr } = await adminClient.storage
        .from('product-media')
        .upload(filename, buffer, {
          contentType: declaredMime || 'image/jpeg',
          upsert: false, // prevent overwriting existing files silently
        });

      if (!uploadErr && uploadData) {
        const { data: publicUrlData } = adminClient.storage
          .from('product-media')
          .getPublicUrl(filename);

        return NextResponse.json({
          success: true,
          message: 'Image uploaded successfully to Supabase Storage.',
          data: {
            url: publicUrlData.publicUrl,
            filename,
            size: file.size,
            mimetype: declaredMime,
            provider: 'supabase-storage',
          },
        });
      } else if (uploadErr) {
        console.error('[Upload] Supabase upload error:', uploadErr.message);
      }
    }

    // 2. Local disk fallback (development only)
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }

    const filePath = path.join(UPLOADS_DIR, filename);
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({
      success: true,
      message: 'Image uploaded successfully.',
      data: {
        url: `/uploads/${filename}`,
        filename,
        size: file.size,
        mimetype: declaredMime,
        provider: 'local-disk',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // Require admin authentication to list media
  const authResult = verifyAdmin(req);
  if (isAuthError(authResult)) return authResult;

  try {
    // 1. Try Supabase Storage
    if (isSupabaseConfigured()) {
      const adminClient = getAdminClient();
      const { data, error } = await adminClient.storage.from('product-media').list();
      if (!error && data && data.length > 0) {
        const mediaList = data.map((item) => {
          const { data: urlData } = adminClient.storage
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
