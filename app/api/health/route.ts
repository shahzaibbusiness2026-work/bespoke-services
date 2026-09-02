import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/src/lib/supabase';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    platform: 'BOSKI LIMITED Next.js Full-Stack API',
    supabaseConnected: isSupabaseConfigured(),
    version: '2.0.0',
    timestamp: new Date().toISOString(),
  });
}
