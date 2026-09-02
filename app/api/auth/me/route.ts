import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/server/services/authService';
import { UserRepository } from '@/server/repositories/userRepository';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = AuthService.verifyToken(token);
    if (!decoded || !decoded.id) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    const userRecord = UserRepository.findById(decoded.id);
    if (!userRecord) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const user = UserRepository.toPublicUser(userRecord);
    return NextResponse.json({ success: true, data: user });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
