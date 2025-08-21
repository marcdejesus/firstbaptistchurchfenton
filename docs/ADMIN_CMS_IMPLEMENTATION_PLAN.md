# Admin CMS Implementation Plan
## Tech Stack: Next.js + Neon PostgreSQL + Prisma + UploadThing

### 🎯 Project Overview

Implement a comprehensive Content Management System (CMS) for First Baptist Church Fenton that allows administrators to manage all website content through an intuitive interface.

**Target Tech Stack:**
- **Frontend**: Next.js 15 (App Router)
- **Database**: Neon Serverless PostgreSQL
- **ORM**: Prisma
- **File Storage**: UploadThing
- **Authentication**: NextAuth.js

---

## 📋 Phase 1: Database Migration & Setup (Week 1)

### 1.1 Remove Firebase Dependencies
```bash
npm uninstall firebase @tanstack-query-firebase/react
npm install @prisma/client prisma @next-auth/prisma-adapter next-auth bcryptjs uploadthing
npm install -D @types/bcryptjs tsx
```

### 1.2 Prisma Schema Design

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model User {
  id           Int       @id @default(autoincrement())
  uuid         String    @unique @default(uuid())
  email        String    @unique
  name         String
  role         Role      @default(EDITOR)
  passwordHash String?   @map("password_hash")
  isActive     Boolean   @default(true) @map("is_active")
  lastLoginAt  DateTime? @map("last_login_at")
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")

  // Relations
  blogPosts     BlogPost[]
  staffMembers  StaffMember[]
  ministries    Ministry[]
  missionPartners MissionPartner[]
  faqs          FAQ[]
  
  @@map("users")
}

model FAQ {
  id        Int      @id @default(autoincrement())
  question  String
  answer    String   @db.Text
  order     Int      @default(0)
  isActive  Boolean  @default(true) @map("is_active")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  createdBy Int?     @map("created_by")
  
  user User? @relation(fields: [createdBy], references: [id])
  
  @@map("faqs")
}

model HomeSlideshow {
  id          Int      @id @default(autoincrement())
  title       String?
  subtitle    String?
  imageUrl    String   @map("image_url")
  imageKey    String   @map("image_key") // UploadThing file key
  linkUrl     String?  @map("link_url")
  linkText    String?  @map("link_text")
  order       Int      @default(0)
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  @@map("home_slideshow")
}

model CurrentSeries {
  id          Int      @id @default(autoincrement())
  title       String
  description String   @db.Text
  imageUrl    String   @map("image_url")
  imageKey    String   @map("image_key") // UploadThing file key
  startDate   DateTime @map("start_date")
  endDate     DateTime? @map("end_date")
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  @@map("current_series")
}

model DonateSettings {
  id          Int      @id @default(autoincrement())
  donateUrl   String   @map("donate_url")
  description String?  @db.Text
  isActive    Boolean  @default(true) @map("is_active")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  @@map("donate_settings")
}

model BlogPost {
  id           Int         @id @default(autoincrement())
  uuid         String      @unique @default(uuid())
  title        String
  slug         String      @unique
  excerpt      String?
  content      String      @db.Text
  thumbnailUrl String?     @map("thumbnail_url")
  thumbnailKey String?     @map("thumbnail_key") // UploadThing file key
  status       PostStatus  @default(DRAFT)
  publishedAt  DateTime?   @map("published_at")
  createdAt    DateTime    @default(now()) @map("created_at")
  updatedAt    DateTime    @updatedAt @map("updated_at")
  authorId     Int         @map("author_id")
  
  author User @relation(fields: [authorId], references: [id])
  
  @@map("blog_posts")
}

model StaffMember {
  id          Int      @id @default(autoincrement())
  name        String
  position    String
  description String?  @db.Text
  email       String?
  photoUrl    String?  @map("photo_url")
  photoKey    String?  @map("photo_key") // UploadThing file key
  order       Int      @default(0)
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  createdBy   Int?     @map("created_by")
  
  user User? @relation(fields: [createdBy], references: [id])
  
  @@map("staff_members")
}

model Ministry {
  id          Int      @id @default(autoincrement())
  name        String
  description String   @db.Text
  imageUrl    String?  @map("image_url")
  imageKey    String?  @map("image_key") // UploadThing file key
  targetAudience String? @map("target_audience") // Adults, Youth, Children
  meetingTime String?  @map("meeting_time")
  contactEmail String? @map("contact_email")
  order       Int      @default(0)
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  createdBy   Int?     @map("created_by")
  
  user User? @relation(fields: [createdBy], references: [id])
  
  @@map("ministries")
}

model MissionPartner {
  id          Int      @id @default(autoincrement())
  name        String
  description String   @db.Text
  location    String?
  website     String?
  imageUrl    String?  @map("image_url")
  imageKey    String?  @map("image_key") // UploadThing file key
  type        MissionType @default(LOCAL) // LOCAL, INTERNATIONAL
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  createdBy   Int?     @map("created_by")
  
  user User? @relation(fields: [createdBy], references: [id])
  
  @@map("mission_partners")
}

// Enums
enum Role {
  ADMIN
  EDITOR
  VIEWER
}

enum PostStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum MissionType {
  LOCAL
  INTERNATIONAL
}
```

### 1.3 Environment Setup

```bash
# .env.local
DATABASE_URL="postgresql://username:password@hostname:port/database?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://username:password@hostname:port/database?sslmode=require"

NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:9002"

UPLOADTHING_TOKEN="your-uploadthing-token"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

---

## 📋 Phase 2: Authentication & Core Setup (Week 2)

### 2.1 NextAuth.js Configuration

```typescript
// src/lib/auth.ts
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

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
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
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
}
```

### 2.2 UploadThing Setup

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
      console.log("Upload complete for userId:", metadata.userId)
      console.log("file url", file.url)
      return { uploadedBy: metadata.userId }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
```

---

## 📋 Phase 3: Admin UI Components (Week 3)

### 3.1 Admin Layout Structure

```
src/app/admin/
├── layout.tsx                 # Admin-only layout with sidebar
├── page.tsx                   # Dashboard overview
├── faq/
│   ├── page.tsx              # FAQ management
│   └── [id]/
│       └── page.tsx          # Edit individual FAQ
├── home/
│   ├── slideshow/
│   │   └── page.tsx          # Slideshow management
│   └── series/
│       └── page.tsx          # Current series management
├── donate/
│   └── page.tsx              # Donate settings
├── blog/
│   ├── page.tsx              # Blog posts list
│   ├── new/
│   │   └── page.tsx          # Create new post
│   └── [id]/
│       └── page.tsx          # Edit post
├── leadership/
│   ├── page.tsx              # Staff management
│   └── [id]/
│       └── page.tsx          # Edit staff member
├── ministries/
│   ├── page.tsx              # Ministries management
│   └── [id]/
│       └── page.tsx          # Edit ministry
└── missions/
    ├── page.tsx              # Mission partners management
    └── [id]/
        └── page.tsx          # Edit mission partner
```

### 3.2 Core Admin Components

```typescript
// src/components/admin/ImageUpload.tsx
"use client"

import { UploadButton } from "@/utils/uploadthing"
import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface ImageUploadProps {
  value?: string
  onChange: (url: string, key: string) => void
  onRemove: () => void
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative w-full h-48 rounded-lg overflow-hidden">
          <Image
            src={value}
            alt="Upload"
            fill
            className="object-cover"
          />
          <Button
            type="button"
            onClick={onRemove}
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              setIsUploading(false)
              if (res?.[0]) {
                onChange(res[0].url, res[0].key)
              }
            }}
            onUploadError={(error) => {
              setIsUploading(false)
              console.error("Upload error:", error)
            }}
            onUploadBegin={() => setIsUploading(true)}
          />
        </div>
      )}
    </div>
  )
}
```

---

## 📋 Phase 4: Admin Page Implementations (Week 4-5)

### 4.1 FAQ Management

```typescript
// src/app/admin/faq/page.tsx
import { prisma } from "@/lib/prisma"
import { FAQTable } from "@/components/admin/FAQTable"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function FAQAdminPage() {
  const faqs = await prisma.fAQ.findMany({
    orderBy: { order: 'asc' },
    include: { user: { select: { name: true } } }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">FAQ Management</h1>
        <Button asChild>
          <Link href="/admin/faq/new">
            <Plus className="h-4 w-4 mr-2" />
            Add FAQ
          </Link>
        </Button>
      </div>
      
      <FAQTable faqs={faqs} />
    </div>
  )
}
```

### 4.2 Home Slideshow Management

```typescript
// src/app/admin/home/slideshow/page.tsx
import { prisma } from "@/lib/prisma"
import { SlideshowManager } from "@/components/admin/SlideshowManager"

export default async function SlideshowAdminPage() {
  const slides = await prisma.homeSlideshow.findMany({
    orderBy: { order: 'asc' }
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Homepage Slideshow</h1>
      <SlideshowManager slides={slides} />
    </div>
  )
}
```

### 4.3 Blog Management

```typescript
// src/app/admin/blog/page.tsx
import { prisma } from "@/lib/prisma"
import { BlogPostsTable } from "@/components/admin/BlogPostsTable"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function BlogAdminPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: { select: { name: true } } }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Blog Management</h1>
        <Button asChild>
          <Link href="/admin/blog/new">
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Link>
        </Button>
      </div>
      
      <BlogPostsTable posts={posts} />
    </div>
  )
}
```

---

## 📋 Phase 5: API Routes & Forms (Week 6)

### 5.1 API Route Structure

```
src/app/api/admin/
├── faq/
│   ├── route.ts              # GET, POST
│   └── [id]/
│       └── route.ts          # GET, PUT, DELETE
├── slideshow/
│   ├── route.ts              # GET, POST
│   └── [id]/
│       └── route.ts          # GET, PUT, DELETE
├── blog/
│   ├── route.ts              # GET, POST
│   └── [id]/
│       └── route.ts          # GET, PUT, DELETE
├── staff/
│   ├── route.ts              # GET, POST
│   └── [id]/
│       └── route.ts          # GET, PUT, DELETE
├── ministries/
│   ├── route.ts              # GET, POST
│   └── [id]/
│       └── route.ts          # GET, PUT, DELETE
└── missions/
    ├── route.ts              # GET, POST
    └── [id]/
        └── route.ts          # GET, PUT, DELETE
```

### 5.2 Example API Route

```typescript
// src/app/api/admin/faq/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const faqs = await prisma.fAQ.findMany({
      orderBy: { order: 'asc' }
    })
    return NextResponse.json(faqs)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch FAQs" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role === 'VIEWER') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { question, answer, order } = body

    const faq = await prisma.fAQ.create({
      data: {
        question,
        answer,
        order: order || 0,
        createdBy: parseInt(session.user.id),
      },
    })

    return NextResponse.json(faq)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create FAQ" }, { status: 500 })
  }
}
```

---

## 📋 Phase 6: Frontend Integration (Week 7)

### 6.1 Update Existing Pages

Update all frontend pages to fetch data from the database instead of static content:

```typescript
// src/app/faq/page.tsx
import { prisma } from "@/lib/prisma"
import { FAQAccordion } from "@/components/FAQAccordion"

export default async function FAQPage() {
  const faqs = await prisma.fAQ.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>
      <FAQAccordion faqs={faqs} />
    </div>
  )
}
```

### 6.2 Dynamic Content Components

Create reusable components that fetch and display dynamic content:

```typescript
// src/components/home/DynamicSlideshow.tsx
import { prisma } from "@/lib/prisma"
import { HeroCarousel } from "./HeroCarousel"

export async function DynamicSlideshow() {
  const slides = await prisma.homeSlideshow.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' }
  })

  if (!slides.length) return null

  return <HeroCarousel slides={slides} />
}
```

---

## 📋 Phase 7: Testing & Deployment (Week 8)

### 7.1 Testing Checklist

- [ ] Admin authentication and authorization
- [ ] CRUD operations for all content types
- [ ] Image upload and management via UploadThing
- [ ] Frontend display of dynamic content
- [ ] Responsive design on all admin pages
- [ ] Form validation and error handling
- [ ] Database migrations and seeding

### 7.2 Production Deployment

1. **Neon Database Setup**
   - Create production database
   - Run migrations
   - Set up connection pooling

2. **UploadThing Configuration**
   - Configure production environment
   - Set up webhook endpoints

3. **Environment Variables**
   - Configure all production secrets
   - Set up domain-specific URLs

---

## 🎯 Success Metrics

- ✅ Complete admin interface for all specified content types
- ✅ Secure authentication with role-based access
- ✅ Seamless image upload and management
- ✅ Real-time content updates on frontend
- ✅ User-friendly admin experience
- ✅ Scalable database architecture

This implementation plan provides a structured approach to building a comprehensive CMS while maintaining clean code architecture and following Next.js best practices.
