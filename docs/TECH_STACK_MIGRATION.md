# Tech Stack Migration Guide
## Firebase → Neon PostgreSQL + Prisma + UploadThing

### 🎯 Overview

This guide outlines the migration from Firebase to your desired tech stack: Next.js + Neon PostgreSQL + Prisma + UploadThing for the First Baptist Church Fenton website.

---

## 📦 Step 1: Dependencies Migration

### Remove Firebase Dependencies
```bash
npm uninstall firebase @tanstack-query-firebase/react
```

### Install New Dependencies
```bash
# Core database and auth
npm install @prisma/client prisma @next-auth/prisma-adapter next-auth bcryptjs

# File upload
npm install uploadthing @uploadthing/react

# Dev dependencies
npm install -D @types/bcryptjs tsx

# Optional: UI enhancements for admin
npm install @radix-ui/react-select @radix-ui/react-textarea
```

### Update package.json Scripts
```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts"
  }
}
```

---

## 🗄️ Step 2: Database Setup

### 2.1 Create Neon Database
1. Sign up at [neon.tech](https://neon.tech)
2. Create a new PostgreSQL project
3. Copy connection strings (pooled and direct)

### 2.2 Environment Configuration
```bash
# .env.local
DATABASE_URL="postgresql://username:password@hostname:port/database?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://username:password@hostname:port/database?sslmode=require"

NEXTAUTH_SECRET="your-random-secret-here"
NEXTAUTH_URL="http://localhost:9002"

UPLOADTHING_TOKEN="your-uploadthing-token"

# Optional Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 2.3 Initialize Database
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed initial data
npm run db:seed
```

---

## 🔐 Step 3: Authentication Migration

### 3.1 Replace Firebase Auth
Replace `src/lib/firebase.ts` with the new database connection:

```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### 3.2 Update Authentication Hook
```typescript
// src/hooks/useAuth.ts
"use client"

import { useSession } from 'next-auth/react'

export const useAuth = () => {
  const { data: session, status } = useSession()

  const user = session?.user ? {
    id: session.user.id,
    name: session.user.name || '',
    email: session.user.email || '',
    role: session.user.role as 'ADMIN' | 'EDITOR' | 'VIEWER',
  } : null

  return {
    user,
    loading: status === 'loading',
  }
}
```

### 3.3 Update Layout
```typescript
// src/app/layout.tsx
import { SessionProvider } from 'next-auth/react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {/* Your existing layout */}
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
```

---

## 📤 Step 4: UploadThing Setup

### 4.1 UploadThing Configuration
```typescript
// src/app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const f = createUploadthing()

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const session = await getServerSession(authOptions)
      if (!session?.user || session.user.role === 'VIEWER') {
        throw new Error("Unauthorized")
      }
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
```

```typescript
// src/app/api/uploadthing/route.ts
import { createRouteHandler } from "uploadthing/next"
import { ourFileRouter } from "./core"

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
})
```

### 4.2 UploadThing Utils
```typescript
// src/utils/uploadthing.ts
import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react"

import type { OurFileRouter } from "@/app/api/uploadthing/core"

export const UploadButton = generateUploadButton<OurFileRouter>()
export const UploadDropzone = generateUploadDropzone<OurFileRouter>()
```

---

## 🔄 Step 5: Update API Routes

### 5.1 Replace Firebase API Routes
Update all API routes to use Prisma instead of Firebase:

```typescript
// Example: src/app/api/volunteer-signup/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { opportunityId, message } = await request.json()

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const signup = await prisma.volunteerSignup.create({
      data: {
        opportunityId,
        userId: user.id,
        message: message || '',
        status: 'PENDING',
      },
    })

    return NextResponse.json({ message: 'Success', id: signup.id })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
```

---

## 🎨 Step 6: Admin Interface Development

Follow the detailed [Admin CMS Implementation Plan](./ADMIN_CMS_IMPLEMENTATION_PLAN.md) to build the admin interface.

### Key Admin Features:
- **FAQ Management**: Add/edit/delete questions and answers
- **Homepage Content**: Manage slideshow images and current series
- **Blog Management**: Create and edit blog posts with thumbnails
- **Leadership**: Manage staff information and photos
- **Ministries**: Update ministry information and images
- **Missions**: Manage mission partner information
- **Donate Settings**: Update donation links and information

---

## 🧪 Step 7: Testing & Migration

### 7.1 Data Migration (if needed)
If you have existing Firebase data to migrate:

```typescript
// scripts/migrate-firebase-data.ts
import { prisma } from '../src/lib/prisma'
// Import Firebase data and migrate to PostgreSQL
// This would be custom based on your existing data structure
```

### 7.2 Testing Checklist
- [ ] Database connection and migrations
- [ ] Authentication flow (login/logout)
- [ ] File upload functionality
- [ ] Admin CRUD operations
- [ ] Frontend data display
- [ ] API route functionality
- [ ] Responsive design

---

## 🚀 Step 8: Deployment

### 8.1 Production Environment
1. **Neon Database**: Set up production database
2. **UploadThing**: Configure production app
3. **Vercel/Netlify**: Deploy with environment variables
4. **Domain**: Configure custom domain

### 8.2 Production Checklist
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Admin user created
- [ ] File upload testing
- [ ] Performance optimization
- [ ] Backup strategy

---

## 📚 Resources

- **Neon Documentation**: https://neon.tech/docs
- **Prisma Documentation**: https://prisma.io/docs
- **UploadThing Documentation**: https://docs.uploadthing.com
- **NextAuth.js Documentation**: https://next-auth.js.org

---

## 🎯 Benefits of New Tech Stack

### Performance
- ✅ Faster database queries with PostgreSQL
- ✅ Connection pooling with Neon
- ✅ Optimized file uploads with UploadThing

### Developer Experience
- ✅ Type-safe database operations with Prisma
- ✅ Auto-generated TypeScript types
- ✅ Database GUI with Prisma Studio
- ✅ Version-controlled schema migrations

### Scalability
- ✅ Serverless PostgreSQL with Neon
- ✅ Automatic scaling and backup
- ✅ CDN-optimized file storage
- ✅ Production-ready architecture

This migration will provide a more robust, scalable, and maintainable foundation for your church website with comprehensive admin capabilities.
