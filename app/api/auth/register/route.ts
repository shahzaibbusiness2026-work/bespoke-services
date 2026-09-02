import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/src/lib/supabase';
import { AuthService } from '@/server/services/authService';

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, password, phone } = await req.json();

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { success: false, error: 'First name, last name, and email are required.' },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured() && password) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone,
            role: 'client',
          },
        },
      });

      if (!error && data.user) {
        const user = {
          id: data.user.id,
          firstName,
          lastName,
          email,
          phone,
          role: 'client' as const,
          vipTier: 'Member' as const,
          pointsBalance: 500,
          joinedDate: 'Recently',
          addresses: [],
        };
        return NextResponse.json({
          success: true,
          message: 'Account created with Supabase Auth.',
          data: { user, token: data.session?.access_token },
        });
      }
    }

    const { user, token } = await AuthService.register({
      firstName,
      lastName,
      email,
      password,
      phone,
    });

    return NextResponse.json({
      success: true,
      message: 'Account created successfully.',
      data: { user, token },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
