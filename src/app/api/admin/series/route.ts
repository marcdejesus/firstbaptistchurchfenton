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

    const series = await prisma.currentSeries.findMany({
      orderBy: { startDate: 'desc' }
    });

    return NextResponse.json(series);
  } catch (error) {
    console.error('Error fetching series:', error);
    return NextResponse.json({ error: "Failed to fetch series" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, imageUrl, imageKey, startDate, endDate, isActive } = body;

    if (!title || !description || !imageUrl || !imageKey || !startDate) {
      return NextResponse.json({ error: "Title, description, image, and start date are required" }, { status: 400 });
    }

    // If this series is being set as active, deactivate all others
    if (isActive) {
      await prisma.currentSeries.updateMany({
        where: { isActive: true },
        data: { isActive: false }
      });
    }

    const series = await prisma.currentSeries.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim(),
        imageKey: imageKey.trim(),
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        isActive: isActive ?? false,
      }
    });

    return NextResponse.json(series);
  } catch (error) {
    console.error('Error creating series:', error);
    return NextResponse.json({ error: "Failed to create series" }, { status: 500 });
  }
}
