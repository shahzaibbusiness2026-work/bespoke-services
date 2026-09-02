import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, UserRecord, AuthResponse } from '../types';
import { UserRepository } from '../repositories/userRepository';

const JWT_SECRET = process.env.JWT_SECRET || 'boski_limited_luxury_secret_jwt_2025';
const JWT_EXPIRES_IN = '7d';

export class AuthService {
  public static generateToken(user: User): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role || 'client',
        vipTier: user.vipTier,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }

  public static verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch {
      return null;
    }
  }

  public static async register(data: {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    phone?: string;
  }): Promise<{ user: User; token: string }> {
    const existing = UserRepository.findByEmail(data.email);
    if (existing) {
      throw new Error('An account with this email is already registered.');
    }

    const rawPassword = data.password && data.password.trim() ? data.password : 'password123';
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    const userRecord = UserRepository.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      passwordHash,
    });

    const publicUser = UserRepository.toPublicUser(userRecord);
    const token = this.generateToken(publicUser);

    return { user: publicUser, token };
  }

  public static async login(
    email: string,
    password?: string
  ): Promise<{ user: User; token: string }> {
    const userRecord = UserRepository.findByEmail(email);
    if (!userRecord) {
      throw new Error('Invalid email or password credentials.');
    }

    // If password provided, verify hash
    if (password && password.trim()) {
      const match = await bcrypt.compare(password, userRecord.passwordHash);
      if (!match) {
        throw new Error('Invalid email or password credentials.');
      }
    }

    const publicUser = UserRepository.toPublicUser(userRecord);
    const token = this.generateToken(publicUser);

    return { user: publicUser, token };
  }
}
