import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            name: true,
          }
        }
      }
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, slug, excerpt, content, thumbnailUrl, thumbnailKey, status } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    // Get the user's database ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if slug already exists
    if (slug) {
      const existingPost = await prisma.blogPost.findUnique({
        where: { slug }
      });
      if (existingPost) {
        return NextResponse.json({ error: "A post with this URL slug already exists" }, { status: 400 });
      }
    }

    const post = await prisma.blogPost.create({
      data: {
        title: title.trim(),
        slug: slug?.trim() || title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
        excerpt: excerpt?.trim() || null,
        content: content.trim(),
        thumbnailUrl: thumbnailUrl?.trim() || null,
        thumbnailKey: thumbnailKey?.trim() || null,
        status: status || 'DRAFT',
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
        authorId: user.id,
      },
      include: {
        author: {
          select: {
            name: true,
          }
        }
      }
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
  }
}
