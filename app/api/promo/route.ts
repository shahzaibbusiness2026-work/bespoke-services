import { NextRequest, NextResponse } from 'next/server';
import { PromoRepository } from '@/server/repositories/promoRepository';

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json();
    const result = PromoRepository.validate(code, Number(subtotal || 0));

    if (!result.valid) {
      return NextResponse.json({ success: false, error: result.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      data: result.promo,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
