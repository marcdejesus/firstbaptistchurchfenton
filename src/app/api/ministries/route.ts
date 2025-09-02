import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const ministries = await prisma.ministry.findMany({
      where: {
        isActive: true,
      },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true,
        targetAudience: true,
        meetingTime: true,
        contactEmail: true,
        order: true,
      }
    });

    return NextResponse.json(ministries);
  } catch (error) {
    console.error('Error fetching ministries:', error);
    return NextResponse.json({ error: "Failed to fetch ministries" }, { status: 500 });
  }
}
