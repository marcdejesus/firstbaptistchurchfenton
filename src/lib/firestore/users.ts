import { BaseFirestoreService } from './base';
import type { User } from '@/types';
import { Timestamp } from 'firebase/firestore';

export interface UserProfile extends User {
  createdAt?: Date;
  updatedAt?: Date;
  lastLoginAt?: Date;
  isEmailVerified?: boolean;
  preferences?: {
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    newsletterSubscription?: boolean;
  };
  profile?: {
    phone?: string;
    address?: string;
    birthday?: string;
    emergencyContact?: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
}

export class UsersService extends BaseFirestoreService {
  constructor() {
    super('users');
  }

  async createUser(userData: Omit<UserProfile, 'id'>): Promise<string> {
    const data = {
      ...userData,
      isEmailVerified: false,
      preferences: {
        emailNotifications: true,
        smsNotifications: false,
        newsletterSubscription: true,
        ...userData.preferences,
      },
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    return await this.create(data);
  }

  async getUserById(userId: string): Promise<UserProfile | null> {
    const userData = await this.getById(userId);
    if (!userData) return null;

    return this.formatUserData(userData);
  }

  async getUserByEmail(email: string): Promise<UserProfile | null> {
    const users = await this.getAll({
      where: [['email', '==', email]],
      limit: 1,
    });

    if (users.length === 0) return null;
    return this.formatUserData(users[0]);
  }

  async updateUser(userId: string, updates: Partial<UserProfile>): Promise<void> {
    const { id, createdAt, ...updateData } = updates;
    await this.update(userId, updateData);
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.update(userId, {
      lastLoginAt: Timestamp.now(),
    });
  }

  async approveUser(userId: string): Promise<void> {
    await this.update(userId, {
      isApprovedMember: true,
    });
  }

  async updateUserRole(userId: string, role: 'member' | 'admin'): Promise<void> {
    await this.update(userId, { role });
  }

  async getAllUsers(options?: {
    role?: 'member' | 'admin';
    isApproved?: boolean;
    limit?: number;
  }): Promise<UserProfile[]> {
    const whereConstraints: Array<[string, any, any]> = [];

    if (options?.role) {
      whereConstraints.push(['role', '==', options.role]);
    }

    if (options?.isApproved !== undefined) {
      whereConstraints.push(['isApprovedMember', '==', options.isApproved]);
    }

    const users = await this.getAll({
      where: whereConstraints.length > 0 ? whereConstraints : undefined,
      orderBy: [['createdAt', 'desc']],
      limit: options?.limit,
    });

    return users.map(user => this.formatUserData(user));
  }

  async getPendingUsers(): Promise<UserProfile[]> {
    return await this.getAllUsers({ isApproved: false });
  }

  async getAdminUsers(): Promise<UserProfile[]> {
    return await this.getAllUsers({ role: 'admin' });
  }

  async searchUsers(searchTerm: string): Promise<UserProfile[]> {
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    const [nameResults, emailResults] = await Promise.all([
      this.getAll({
        where: [['name', '>=', searchTerm], ['name', '<=', searchTerm + '\uf8ff']],
        orderBy: [['name', 'asc']],
        limit: 10,
      }),
      this.getAll({
        where: [['email', '>=', lowerSearchTerm], ['email', '<=', lowerSearchTerm + '\uf8ff']],
        orderBy: [['email', 'asc']],
        limit: 10,
      }),
    ]);

    const allResults = [...nameResults, ...emailResults];
    const uniqueResults = allResults.filter((user, index, array) => 
      array.findIndex(u => u.id === user.id) === index
    );

    return uniqueResults.map(user => this.formatUserData(user));
  }

  async deleteUser(userId: string): Promise<void> {
    await this.delete(userId);
  }

  async updateUserPreferences(userId: string, preferences: UserProfile['preferences']): Promise<void> {
    await this.update(userId, { preferences });
  }

  async updateUserProfile(userId: string, profile: UserProfile['profile']): Promise<void> {
    await this.update(userId, { profile });
  }

  async getUserStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    pendingApproval: number;
    adminUsers: number;
  }> {
    const [allUsers, pendingUsers, adminUsers] = await Promise.all([
      this.getAll(),
      this.getPendingUsers(),
      this.getAdminUsers(),
    ]);

    const activeUsers = allUsers.filter(user => user.isApprovedMember).length;

    return {
      totalUsers: allUsers.length,
      activeUsers,
      pendingApproval: pendingUsers.length,
      adminUsers: adminUsers.length,
    };
  }

  private formatUserData(userData: any): UserProfile {
    return {
      id: userData.id,
      name: userData.name || '',
      email: userData.email || '',
      role: userData.role || 'member',
      isApprovedMember: userData.isApprovedMember || false,
      avatarUrl: userData.avatarUrl,
      isEmailVerified: userData.isEmailVerified || false,
      preferences: userData.preferences || {
        emailNotifications: true,
        smsNotifications: false,
        newsletterSubscription: true,
      },
      profile: userData.profile,
      createdAt: this.timestampToDate(userData.createdAt) || undefined,
      updatedAt: this.timestampToDate(userData.updatedAt) || undefined,
      lastLoginAt: this.timestampToDate(userData.lastLoginAt) || undefined,
    };
  }
}

export const usersService = new UsersService();