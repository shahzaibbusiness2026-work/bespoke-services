import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/server/services/authService';

interface DecodedToken {
  id: string;
  email: string;
  role: string;
  vipTier?: string;
}

type AuthSuccess = { user: DecodedToken };
type AuthFailure = NextResponse;

/**
 * Verifies the Bearer token on a Next.js API route.
 * Returns { user } on success, or a 401 NextResponse on failure.
 */
export function verifyAuth(req: NextRequest): AuthSuccess | AuthFailure {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { success: false, error: 'Authentication required. Please sign in.' },
      { status: 401 }
    );
  }

  const token = authHeader.split(' ')[1];
  const decoded = AuthService.verifyToken(token) as DecodedToken | null;

  if (!decoded || !decoded.id) {
    return NextResponse.json(
      { success: false, error: 'Invalid or expired session. Please sign in again.' },
      { status: 401 }
    );
  }

  return { user: decoded };
}

/**
 * Verifies the Bearer token AND that the user has the admin role.
 * Returns { user } on success, or a 401/403 NextResponse on failure.
 */
export function verifyAdmin(req: NextRequest): AuthSuccess | AuthFailure {
  const authResult = verifyAuth(req);

  // If verifyAuth returned a NextResponse (error), pass it through
  if (authResult instanceof NextResponse) return authResult;

  if (authResult.user.role !== 'admin') {
    return NextResponse.json(
      { success: false, error: 'Administrator privileges are required for this action.' },
      { status: 403 }
    );
  }

  return authResult;
}

/**
 * Type guard to check if an auth result is a success (has .user) or failure (NextResponse).
 */
export function isAuthError(result: AuthSuccess | AuthFailure): result is AuthFailure {
  return result instanceof NextResponse;
}
