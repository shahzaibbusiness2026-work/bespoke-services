import { db } from '../data/store';
import { User, UserRecord, Address } from '../types';

export class UserRepository {
  public static findByEmail(email: string): UserRecord | null {
    const users = db.get('users');
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  public static findById(id: string): UserRecord | null {
    const users = db.get('users');
    return users.find((u) => u.id === id) || null;
  }

  public static create(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    passwordHash: string;
  }): UserRecord {
    const newUser: UserRecord = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone?.trim() || '',
      role: 'client',
      vipTier: 'Member',
      pointsBalance: 500, // Welcome points
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      addresses: [],
      passwordHash: data.passwordHash,
    };

    db.update('users', (users) => {
      users.push(newUser);
      return users;
    });

    return newUser;
  }

  public static updateProfile(id: string, updates: Partial<User>): User | null {
    return db.transaction((state) => {
      const user = state.users.find((u) => u.id === id);
      if (!user) return null;

      if (updates.firstName) user.firstName = updates.firstName;
      if (updates.lastName) user.lastName = updates.lastName;
      if (updates.phone !== undefined) user.phone = updates.phone;
      if (updates.email) user.email = updates.email.toLowerCase();

      return this.toPublicUser(user);
    });
  }

  public static addAddress(userId: string, addressData: Omit<Address, 'id'>): Address | null {
    return db.transaction((state) => {
      const user = state.users.find((u) => u.id === userId);
      if (!user) return null;

      const newAddress: Address = {
        id: `addr-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        ...addressData,
      };

      if (newAddress.isDefault) {
        user.addresses.forEach((a) => (a.isDefault = false));
      } else if (user.addresses.length === 0) {
        newAddress.isDefault = true;
      }

      user.addresses.push(newAddress);
      return newAddress;
    });
  }

  public static updateAddress(
    userId: string,
    addressId: string,
    updates: Partial<Address>
  ): Address | null {
    return db.transaction((state) => {
      const user = state.users.find((u) => u.id === userId);
      if (!user) return null;

      const addrIndex = user.addresses.findIndex((a) => a.id === addressId);
      if (addrIndex === -1) return null;

      if (updates.isDefault) {
        user.addresses.forEach((a) => (a.isDefault = false));
      }

      user.addresses[addrIndex] = {
        ...user.addresses[addrIndex],
        ...updates,
      };

      return user.addresses[addrIndex];
    });
  }

  public static deleteAddress(userId: string, addressId: string): boolean {
    return db.transaction((state) => {
      const user = state.users.find((u) => u.id === userId);
      if (!user) return false;

      const initialLen = user.addresses.length;
      user.addresses = user.addresses.filter((a) => a.id !== addressId);

      // If default was deleted, mark first remaining as default
      if (user.addresses.length > 0 && !user.addresses.some((a) => a.isDefault)) {
        user.addresses[0].isDefault = true;
      }

      return user.addresses.length < initialLen;
    });
  }

  public static setDefaultAddress(userId: string, addressId: string): boolean {
    return db.transaction((state) => {
      const user = state.users.find((u) => u.id === userId);
      if (!user) return false;

      user.addresses.forEach((a) => {
        a.isDefault = a.id === addressId;
      });

      return true;
    });
  }

  public static toPublicUser(record: UserRecord): User {
    const { passwordHash, ...user } = record;
    return user;
  }
}
