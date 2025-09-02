import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Get single staff member
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const staffMember = await prisma.staffMember.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!staffMember) {
      return NextResponse.json({ error: "Staff member not found" }, { status: 404 });
    }

    return NextResponse.json(staffMember);
  } catch (error) {
    console.error('Error fetching staff member:', error);
    return NextResponse.json({ error: "Failed to fetch staff member" }, { status: 500 });
  }
}

// PUT - Update staff member
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if staff member exists
    const existingStaff = await prisma.staffMember.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!existingStaff) {
      return NextResponse.json({ error: "Staff member not found" }, { status: 404 });
    }

    // Update staff member
    const updatedStaff = await prisma.staffMember.update({
      where: { id: parseInt(params.id) },
      data: {
        name,
        position,
        description: description || '',
        email: email || '',
        photoUrl: photoUrl || '',
        photoKey: photoKey || '',
        order: order || 1,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(updatedStaff);
  } catch (error) {
    console.error('Error updating staff member:', error);
    return NextResponse.json({ 
      error: "Failed to update staff member" 
    }, { status: 500 });
  }
}

// DELETE - Delete staff member
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if staff member exists
    const existingStaff = await prisma.staffMember.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!existingStaff) {
      return NextResponse.json({ error: "Staff member not found" }, { status: 404 });
    }

    // Delete staff member
    await prisma.staffMember.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ message: "Staff member deleted successfully" });
  } catch (error) {
    console.error('Error deleting staff member:', error);
    return NextResponse.json({ 
      error: "Failed to delete staff member" 
    }, { status: 500 });
  }
}
