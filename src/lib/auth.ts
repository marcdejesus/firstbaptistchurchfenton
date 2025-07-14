import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
  UserCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import type { User } from '@/types';

export interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export class AuthService {
  static async signUp({ email, password, name }: SignUpData): Promise<User> {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, {
        displayName: name,
      });

      const isAdmin = await this.checkIsAdminEmail(email);
      const userData: User = {
        id: firebaseUser.uid,
        name,
        email,
        role: isAdmin ? 'admin' : 'member',
        isApprovedMember: isAdmin,
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), {
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return userData;
    } catch (error) {
      console.error('Error creating user:', error);
      throw this.handleAuthError(error);
    }
  }

  static async signIn({ email, password }: SignInData): Promise<User> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      return await this.getUserData(firebaseUser);
    } catch (error) {
      console.error('Error signing in:', error);
      throw this.handleAuthError(error);
    }
  }

  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw this.handleAuthError(error);
    }
  }

  static async sendPasswordReset(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error sending password reset:', error);
      throw this.handleAuthError(error);
    }
  }

  static async getUserData(firebaseUser: FirebaseUser): Promise<User> {
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          id: firebaseUser.uid,
          name: userData.name || firebaseUser.displayName || '',
          email: firebaseUser.email || '',
          role: userData.role || 'member',
          isApprovedMember: userData.isApprovedMember || false,
          avatarUrl: userData.avatarUrl || firebaseUser.photoURL || undefined,
        };
      } else {
        const isAdmin = await this.checkIsAdminEmail(firebaseUser.email || '');
        const userData: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || '',
          email: firebaseUser.email || '',
          role: isAdmin ? 'admin' : 'member',
          isApprovedMember: isAdmin,
        };

        await setDoc(doc(db, 'users', firebaseUser.uid), {
          ...userData,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        return userData;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  }

  static async updateUserProfile(userId: string, updates: Partial<User>): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', userId), {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  private static async checkIsAdminEmail(email: string): Promise<boolean> {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    return email === adminEmail;
  }

  private static handleAuthError(error: any): Error {
    if (error.code) {
      switch (error.code) {
        case 'auth/user-not-found':
          return new Error('No account found with this email address.');
        case 'auth/wrong-password':
          return new Error('Incorrect password.');
        case 'auth/email-already-in-use':
          return new Error('An account with this email already exists.');
        case 'auth/weak-password':
          return new Error('Password should be at least 6 characters.');
        case 'auth/invalid-email':
          return new Error('Invalid email address.');
        case 'auth/user-disabled':
          return new Error('This account has been disabled.');
        case 'auth/too-many-requests':
          return new Error('Too many failed attempts. Please try again later.');
        default:
          return new Error('Authentication failed. Please try again.');
      }
    }
    return error instanceof Error ? error : new Error('Authentication failed.');
  }
}