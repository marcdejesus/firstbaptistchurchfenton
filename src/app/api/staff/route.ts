import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const staffMembers = await prisma.staffMember.findMany({
      where: {
        isActive: true,
      },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        name: true,
        position: true,
        description: true,
        email: true,
        photoUrl: true,
        order: true,
      }
    });

    return NextResponse.json(staffMembers);
  } catch (error) {
    console.error('Error fetching staff members:', error);
    return NextResponse.json({ error: "Failed to fetch staff members" }, { status: 500 });
  }
}
