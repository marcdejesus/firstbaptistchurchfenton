import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: Props) {
  try {
    const { slug } = await params;

    const post = await prisma.blogPost.findUnique({
      where: { 
        slug,
        status: 'PUBLISHED',
        publishedAt: {
          not: null
        }
      },
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
