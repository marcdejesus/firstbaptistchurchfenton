import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  // Note: We use JWT strategy without adapter for credentials provider
  session: { strategy: 'jwt' },
  debug: process.env.NODE_ENV === 'development',
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          })

          if (!user || !user.passwordHash) return null

          const isValid = await bcrypt.compare(credentials.password, user.passwordHash)
          if (!isValid) return null

          return {
            id: user.uuid,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
    // Google OAuth disabled for now - enable when you have credentials
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.uuid = user.id
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