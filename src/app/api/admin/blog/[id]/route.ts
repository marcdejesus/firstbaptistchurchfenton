import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { utapi } from "@/utils/uploadthing";

interface Props {
  params: { id: string };
}

export async function GET(request: Request, { params }: Props) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const postId = parseInt(params.id);
    if (isNaN(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    const post = await prisma.blogPost.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            name: true,
          }
        }
      }
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Props) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const postId = parseInt(params.id);
    if (isNaN(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    const body = await request.json();
    const { title, slug, excerpt, content, thumbnailUrl, thumbnailKey, status } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id: postId }
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if slug already exists (excluding current post)
    if (slug && slug !== existingPost.slug) {
      const slugExists = await prisma.blogPost.findUnique({
        where: { slug }
      });
      if (slugExists) {
        return NextResponse.json({ error: "A post with this URL slug already exists" }, { status: 400 });
      }
    }

    // If the thumbnail has changed, delete the old one from UploadThing
    if (existingPost.thumbnailKey && thumbnailKey !== existingPost.thumbnailKey && existingPost.thumbnailKey) {
      try {
        await utapi.deleteFiles([existingPost.thumbnailKey]);
      } catch (error) {
        console.error('Error deleting old thumbnail:', error);
        // Continue with update even if old thumbnail deletion fails
      }
    }

    // Determine published date
    let publishedAt = existingPost.publishedAt;
    if (status === 'PUBLISHED' && !existingPost.publishedAt) {
      publishedAt = new Date();
    } else if (status !== 'PUBLISHED') {
      publishedAt = null;
    }

    const post = await prisma.blogPost.update({
      where: { id: postId },
      data: {
        title: title.trim(),
        slug: slug?.trim() || title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
        excerpt: excerpt?.trim() || null,
        content: content.trim(),
        thumbnailUrl: thumbnailUrl?.trim() || null,
        thumbnailKey: thumbnailKey?.trim() || null,
        status: status || 'DRAFT',
        publishedAt,
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
    console.error('Error updating blog post:', error);
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Props) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Admin access required" }, { status: 401 });
    }

    const postId = parseInt(params.id);
    if (isNaN(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id: postId }
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Delete the thumbnail from UploadThing
    if (existingPost.thumbnailKey) {
      try {
        await utapi.deleteFiles([existingPost.thumbnailKey]);
      } catch (error) {
        console.error('Error deleting thumbnail from UploadThing:', error);
        // Continue with database deletion even if file deletion fails
      }
    }

    // Delete from database
    await prisma.blogPost.delete({
      where: { id: postId }
    });

    return NextResponse.json({ message: "Blog post deleted successfully" });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 });
  }
}
