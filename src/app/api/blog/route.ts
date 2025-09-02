import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
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
      },
      orderBy: {
        publishedAt: 'desc'
      }
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching published blog posts:', error);
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
  }
}
