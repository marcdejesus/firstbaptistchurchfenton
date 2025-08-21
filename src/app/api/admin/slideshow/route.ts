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

    const slides = await prisma.homeSlideshow.findMany({
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(slides);
  } catch (error) {
    console.error('Error fetching slides:', error);
    return NextResponse.json({ error: "Failed to fetch slides" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, subtitle, imageUrl, imageKey, linkUrl, linkText, order, isActive } = body;

    if (!imageUrl || !imageKey) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    const slide = await prisma.homeSlideshow.create({
      data: {
        title: title?.trim() || null,
        subtitle: subtitle?.trim() || null,
        imageUrl: imageUrl.trim(),
        imageKey: imageKey.trim(),
        linkUrl: linkUrl?.trim() || null,
        linkText: linkText?.trim() || null,
        order: order || 0,
        isActive: isActive ?? true,
      }
    });

    return NextResponse.json(slide);
  } catch (error) {
    console.error('Error creating slide:', error);
    return NextResponse.json({ error: "Failed to create slide" }, { status: 500 });
  }
}
