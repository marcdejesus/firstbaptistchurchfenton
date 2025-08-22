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

    const settings = await prisma.donateSettings.findFirst({
      where: { isActive: true }
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching donate settings:', error);
    return NextResponse.json({ error: "Failed to fetch donate settings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { donateUrl, description } = body;

    if (!donateUrl) {
      return NextResponse.json({ error: "Donation URL is required" }, { status: 400 });
    }

    // First, mark all existing settings as inactive
    await prisma.donateSettings.updateMany({
      where: { isActive: true },
      data: { isActive: false }
    });

    // Create new active settings
    const settings = await prisma.donateSettings.create({
      data: {
        donateUrl: donateUrl.trim(),
        description: description?.trim() || null,
        isActive: true,
      }
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error creating/updating donate settings:', error);
    return NextResponse.json({ error: "Failed to save donate settings" }, { status: 500 });
  }
}
