import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - List all staff members
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const staffMembers = await prisma.staffMember.findMany({
      orderBy: { order: 'asc' },
      include: {
        user: {
          select: {
            name: true,
          }
        }
      }
    });

    return NextResponse.json(staffMembers);
  } catch (error) {
    console.error('Error fetching staff members:', error);
    return NextResponse.json({ error: "Failed to fetch staff members" }, { status: 500 });
  }
}

// POST - Create new staff member
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, position, description, email, photoUrl, photoKey, order, isActive } = body;

    // Validate required fields
    if (!name || !position) {
      return NextResponse.json({ 
        error: "Name and position are required" 
      }, { status: 400 });
    }

    // Create new staff member
    const staffMember = await prisma.staffMember.create({
      data: {
        name,
        position,
        description: description || '',
        email: email || '',
        photoUrl: photoUrl || '',
        photoKey: photoKey || '',
        order: order || 1,
        isActive: isActive ?? true,
        createdBy: session.user.id,
      },
    });

    return NextResponse.json(staffMember, { status: 201 });
  } catch (error) {
    console.error('Error creating staff member:', error);
    return NextResponse.json({ 
      error: "Failed to create staff member" 
    }, { status: 500 });
  }
}
