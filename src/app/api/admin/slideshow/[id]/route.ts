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

    const slideId = parseInt(params.id);
    if (isNaN(slideId)) {
      return NextResponse.json({ error: "Invalid slide ID" }, { status: 400 });
    }

    const slide = await prisma.homeSlideshow.findUnique({
      where: { id: slideId }
    });

    if (!slide) {
      return NextResponse.json({ error: "Slide not found" }, { status: 404 });
    }

    return NextResponse.json(slide);
  } catch (error) {
    console.error('Error fetching slide:', error);
    return NextResponse.json({ error: "Failed to fetch slide" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Props) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const slideId = parseInt(params.id);
    if (isNaN(slideId)) {
      return NextResponse.json({ error: "Invalid slide ID" }, { status: 400 });
    }

    const body = await request.json();
    const { title, subtitle, imageUrl, imageKey, linkUrl, linkText, order, isActive } = body;

    if (!imageUrl || !imageKey) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    // Check if slide exists
    const existingSlide = await prisma.homeSlideshow.findUnique({
      where: { id: slideId }
    });

    if (!existingSlide) {
      return NextResponse.json({ error: "Slide not found" }, { status: 404 });
    }

    // If the image has changed, delete the old one from UploadThing
    if (existingSlide.imageKey !== imageKey && existingSlide.imageKey) {
      try {
        await utapi.deleteFiles([existingSlide.imageKey]);
      } catch (error) {
        console.error('Error deleting old image:', error);
        // Continue with update even if old image deletion fails
      }
    }

    const slide = await prisma.homeSlideshow.update({
      where: { id: slideId },
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
    console.error('Error updating slide:', error);
    return NextResponse.json({ error: "Failed to update slide" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Props) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Admin access required" }, { status: 401 });
    }

    const slideId = parseInt(params.id);
    if (isNaN(slideId)) {
      return NextResponse.json({ error: "Invalid slide ID" }, { status: 400 });
    }

    // Check if slide exists
    const existingSlide = await prisma.homeSlideshow.findUnique({
      where: { id: slideId }
    });

    if (!existingSlide) {
      return NextResponse.json({ error: "Slide not found" }, { status: 404 });
    }

    // Delete the image from UploadThing
    if (existingSlide.imageKey) {
      try {
        await utapi.deleteFiles([existingSlide.imageKey]);
      } catch (error) {
        console.error('Error deleting image from UploadThing:', error);
        // Continue with database deletion even if file deletion fails
      }
    }

    // Delete from database
    await prisma.homeSlideshow.delete({
      where: { id: slideId }
    });

    return NextResponse.json({ message: "Slide deleted successfully" });
  } catch (error) {
    console.error('Error deleting slide:', error);
    return NextResponse.json({ error: "Failed to delete slide" }, { status: 500 });
  }
}
