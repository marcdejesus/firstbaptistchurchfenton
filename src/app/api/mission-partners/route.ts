import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const missionPartners = await prisma.missionPartner.findMany({
      where: {
        isActive: true,
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        location: true,
        website: true,
        imageUrl: true,
        imageKey: true,
        type: true,
      }
    });

    return NextResponse.json(missionPartners);
  } catch (error) {
    console.error('Error fetching mission partners:', error);
    return NextResponse.json({ error: "Failed to fetch mission partners" }, { status: 500 });
  }
}
