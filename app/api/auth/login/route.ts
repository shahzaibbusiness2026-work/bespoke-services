import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase, isSupabaseConfigured } from '@/src/lib/supabase';
import { AuthService } from '@/server/services/authService';
import { User } from '@/src/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Email is required for authentication.' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || password.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Password is required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // ── Path 1: Supabase PostgreSQL authentication ──────────────────────────
    if (isSupabaseConfigured()) {
      // 1A. Check admin_users table (hashed password) for admin/concierge accounts
      const { data: adminRecord, error: adminErr } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', cleanEmail)
        .single();

      if (!adminErr && adminRecord && adminRecord.password_hash) {
        const isPasswordValid = bcrypt.compareSync(password, adminRecord.password_hash);

        if (!isPasswordValid) {
          // Found the admin account but wrong password — fail immediately
          return NextResponse.json(
            { success: false, error: 'Invalid email or password.' },
            { status: 401 }
          );
        }

        // Update last_login timestamp
        await supabase
          .from('admin_users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', adminRecord.id);

        const adminUser: User = {
          id: String(adminRecord.id),
          firstName: adminRecord.first_name || 'Master',
          lastName: adminRecord.last_name || 'Concierge',
          name: `${adminRecord.first_name || 'Master'} ${adminRecord.last_name || 'Concierge'}`,
          email: adminRecord.email,
          role: 'admin',
          vipTier: 'Diamond Concierge',
          pointsBalance: 15000,
          joinedDate: 'Atelier Director',
          addresses: [],
        };

        const token = AuthService.generateToken(adminUser);

        return NextResponse.json({
          success: true,
          message: 'Admin authenticated successfully.',
          data: { user: adminUser, token },
          meta: { source: 'supabase-postgresql' },
        });
      }

      // 1B. Supabase Auth for registered customer accounts
      const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (!authErr && authData.user) {
        const { data: customerRecord } = await supabase
          .from('customers')
          .select('*')
          .eq('user_id', authData.user.id)
          .single();

        const user: User = {
          id: authData.user.id,
          firstName: customerRecord?.first_name || authData.user.user_metadata?.first_name || 'Client',
          lastName: customerRecord?.last_name || authData.user.user_metadata?.last_name || 'Member',
          name: `${customerRecord?.first_name || 'Client'} ${customerRecord?.last_name || 'Member'}`,
          email: authData.user.email || cleanEmail,
          role: 'client',
          vipTier: customerRecord?.vip_tier || 'Member',
          pointsBalance: customerRecord?.points_balance || 500,
          joinedDate: 'Patron',
          addresses: customerRecord?.addresses || [],
        };

        return NextResponse.json({
          success: true,
          message: 'Authentication successful.',
          data: { user, token: authData.session?.access_token },
          meta: { source: 'supabase-postgresql' },
        });
      }

      // Supabase auth returned an error — report it
      if (authErr) {
        return NextResponse.json(
          { success: false, error: 'Invalid email or password.' },
          { status: 401 }
        );
      }
    }

    // ── Path 2: Local repository fallback (when Supabase is not configured) ─
    try {
      const { user, token } = await AuthService.login(cleanEmail, password);
      return NextResponse.json({
        success: true,
        message: 'Authentication successful.',
        data: { user, token },
        meta: { source: 'local-store' },
      });
    } catch (err: any) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 401 }
      );
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
