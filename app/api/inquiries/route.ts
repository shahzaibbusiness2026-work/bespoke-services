import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/src/lib/supabase';
import { InquiryRepository } from '@/server/repositories/inquiryRepository';
import { mapDbMessageToInquiry } from '@/src/lib/db-mappers';

export async function GET() {
  try {
    // Primary: Supabase PostgreSQL (contact_messages table)
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const mappedInquiries = data.map(mapDbMessageToInquiry);
        return NextResponse.json({
          success: true,
          data: mappedInquiries,
          meta: { source: 'supabase-postgresql' },
        });
      }
    }

    // Graceful Fallback: Local Store
    const list = InquiryRepository.getAllConsolidated();
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
    const body = await req.json();
    const type = body.type || 'contact';

    let saved: any;
    if (type === 'contact') {
      saved = InquiryRepository.saveContact({
        name: body.name,
        email: body.email,
        phone: body.phone,
        subject: body.subject || 'General Customer Service Inquiry',
        message: body.message,
      });
    } else if (type === 'bespoke') {
      saved = InquiryRepository.saveBespoke(body);
    } else if (type === 'trade') {
      saved = InquiryRepository.saveTrade(body);
    }

    // Primary: Supabase PostgreSQL
    if (isSupabaseConfigured()) {
      const senderName = body.name || body.fullName || body.contactPerson || 'Patron';
      const subject = body.subject || body.projectType || body.orderVolume || 'Atelier Inquiry';
      const message = body.message || body.details || body.projectDetails || '';
      const email = body.email || body.businessEmail;

      const { data, error } = await supabase.from('contact_messages').insert([
        {
          type,
          sender_name: senderName,
          email,
          phone: body.phone,
          subject,
          message,
          status: 'pending',
          metadata: body,
        },
      ]).select().single();

      if (!error && data) {
        return NextResponse.json({
          success: true,
          data: mapDbMessageToInquiry(data),
          message: 'Inquiry registered with Atelier Concierge.',
          meta: { source: 'supabase-postgresql' },
        });
      }
    }

    // Graceful Fallback: Local Store
    return NextResponse.json({
      success: true,
      data: saved,
      message: 'Inquiry registered with Atelier Concierge.',
      meta: { source: 'local-store' },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Inquiry ID and status are required.' }, { status: 400 });
    }

    // Update local store
    InquiryRepository.updateStatus(id, status);

    // Primary: Supabase PostgreSQL
    if (isSupabaseConfigured()) {
      await supabase.from('contact_messages').update({ status }).eq('id', id);
    }

    return NextResponse.json({
      success: true,
      message: `Inquiry status marked as '${status}'.`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
