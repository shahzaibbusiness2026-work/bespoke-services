import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/src/lib/supabase';
import { OrderRepository } from '@/server/repositories/orderRepository';
import { mapDbOrderToOrder, mapOrderToDbOrder } from '@/src/lib/db-mappers';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    // Primary: Supabase PostgreSQL
    if (isSupabaseConfigured()) {
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (email) {
        query = query.eq('customer->>email', email);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        const mappedOrders = data.map(mapDbOrderToOrder);
        return NextResponse.json({
          success: true,
          data: mappedOrders,
          meta: { source: 'supabase-postgresql' },
        });
      }
    }

    // Graceful Fallback: Local Store
    const orders = email ? OrderRepository.findByEmail(email) : OrderRepository.findAll();
    return NextResponse.json({
      success: true,
      data: orders,
      meta: { source: 'local-store' },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Create local order model first to ensure IDs and tracking are assigned
    const order = OrderRepository.create(body);

    // Primary: Supabase PostgreSQL
    if (isSupabaseConfigured()) {
      const dbRecord = mapOrderToDbOrder(order);

      const { data, error } = await supabase
        .from('orders')
        .insert([dbRecord])
        .select()
        .single();

      if (!error && data) {
        return NextResponse.json({
          success: true,
          data: mapDbOrderToOrder(data),
          message: 'Order registered successfully with Atelier vault.',
          meta: { source: 'supabase-postgresql' },
        });
      }
    }

    // Graceful Fallback: Local Store
    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order registered successfully with Atelier vault.',
      meta: { source: 'local-store' },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
