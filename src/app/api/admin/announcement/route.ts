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

    const announcement = await prisma.announcementBanner.findFirst({
      where: { isActive: true }
    });

    return NextResponse.json(announcement);
  } catch (error) {
    console.error('Error fetching announcement banner:', error);
    return NextResponse.json({ error: "Failed to fetch announcement banner" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { message, backgroundColor, textColor } = body;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Get the current user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // First, mark all existing announcements as inactive
    await prisma.announcementBanner.updateMany({
      where: { isActive: true },
      data: { isActive: false }
    });

    // Create new active announcement
    const announcement = await prisma.announcementBanner.create({
      data: {
        message: message.trim(),
        backgroundColor: backgroundColor?.trim() || '#1e40af',
        textColor: textColor?.trim() || '#ffffff',
        isActive: true,
        createdBy: user.id,
      }
    });

    return NextResponse.json(announcement);
  } catch (error) {
    console.error('Error creating/updating announcement banner:', error);
    return NextResponse.json({ error: "Failed to save announcement banner" }, { status: 500 });
  }
}
