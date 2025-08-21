import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user || !user.passwordHash) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.uuid,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        // User is signing in
        if (account?.provider === 'google') {
          // For Google OAuth, find or create user in our database
          const dbUser = await prisma.user.upsert({
            where: { email: user.email! },
            update: {
              name: user.name!,
              lastLoginAt: new Date(),
            },
            create: {
              email: user.email!,
              name: user.name!,
              role: 'VIEWER', // Default role for OAuth users
              isActive: true,
              lastLoginAt: new Date(),
            },
          })
          token.role = dbUser.role
          token.uuid = dbUser.uuid
        } else {
          // For credentials login
          token.role = user.role
          token.uuid = user.id
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.uuid as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    signUp: '/register',
  },
}

// Helper function to get user role
export async function getUserRole(email: string): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { role: true },
  })
  return user?.role || null
}

// Helper function to check if user is admin
export async function isAdmin(email: string): Promise<boolean> {
  const role = await getUserRole(email)
  return role === 'ADMIN'
}
