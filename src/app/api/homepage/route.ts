import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch all homepage data in parallel
    const [slideshow, currentSeries, announcementBanner] = await Promise.all([
      // Get active slideshow images
      prisma.homeSlideshow.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
        select: {
          id: true,
          title: true,
          subtitle: true,
          imageUrl: true,
          imageKey: true,
          linkUrl: true,
          linkText: true,
          order: true,
        }
      }),
      
      // Get active current series
      prisma.currentSeries.findFirst({
        where: { isActive: true },
        select: {
          id: true,
          title: true,
          description: true,
          imageUrl: true,
          imageKey: true,
          startDate: true,
          endDate: true,
        }
      }),
      
      // Get active announcement banner
      prisma.announcementBanner.findFirst({
        where: { isActive: true },
        select: {
          id: true,
          message: true,
          backgroundColor: true,
          textColor: true,
        }
      })
    ]);

    return NextResponse.json({
      slideshow: slideshow || [],
      currentSeries: currentSeries || null,
      announcementBanner: announcementBanner || null,
    });
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return NextResponse.json({ 
      error: "Failed to fetch homepage data" 
    }, { status: 500 });
  }
}
