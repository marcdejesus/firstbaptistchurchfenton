import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const series = await prisma.currentSeries.findUnique({
      where: { id: parseInt(id) }
    });

    if (!series) {
      return NextResponse.json({ error: "Series not found" }, { status: 404 });
    }

    return NextResponse.json(series);
  } catch (error) {
    console.error('Error fetching series:', error);
    return NextResponse.json({ error: "Failed to fetch series" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, description, imageUrl, imageKey, startDate, endDate, isActive } = body;

    console.log("📥 [Series API] PUT request body:", body);

    if (!title || !description || !startDate) {
      return NextResponse.json({ error: "Title, description, and start date are required" }, { status: 400 });
    }

    // If this series is being set as active, deactivate all others
    if (isActive) {
      await prisma.currentSeries.updateMany({
        where: { 
          isActive: true,
          id: { not: parseInt(id) } // Don't deactivate the current series
        },
        data: { isActive: false }
      });
    }

    const updatedSeries = await prisma.currentSeries.update({
      where: { id: parseInt(id) },
      data: {
        title: title.trim(),
        description: description.trim(),
        imageUrl: imageUrl?.trim() || '',
        imageKey: imageKey?.trim() || '',
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        isActive: isActive ?? false,
        updatedAt: new Date(),
      }
    });

    console.log("✅ [Series API] Series updated successfully:", updatedSeries);

    return NextResponse.json(updatedSeries);
  } catch (error) {
    console.error('Error updating series:', error);
    return NextResponse.json({ error: "Failed to update series" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    
    // Check if series exists
    const series = await prisma.currentSeries.findUnique({
      where: { id: parseInt(id) }
    });

    if (!series) {
      return NextResponse.json({ error: "Series not found" }, { status: 404 });
    }

    // Delete the series
    await prisma.currentSeries.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: "Series deleted successfully" });
  } catch (error) {
    console.error('Error deleting series:', error);
    return NextResponse.json({ error: "Failed to delete series" }, { status: 500 });
  }
}
