// This file has been migrated from Firebase to Neon PostgreSQL + Prisma
// Database operations are now handled through Prisma Client
// Import { prisma } from './prisma' for database operations

import { prisma } from './prisma'

// Re-export prisma as db for backward compatibility with existing code
export const db = prisma

// Note: Firebase auth and storage have been replaced
// - Authentication: Now handled by NextAuth.js (see /api/auth/[...nextauth])
// - Storage: Will be handled by UploadThing for file uploads

export { prisma } 