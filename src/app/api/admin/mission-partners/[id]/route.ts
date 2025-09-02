import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Get single mission partner
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const missionPartner = await prisma.missionPartner.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!missionPartner) {
      return NextResponse.json({ error: "Mission partner not found" }, { status: 404 });
    }

    return NextResponse.json(missionPartner);
  } catch (error) {
    console.error('Error fetching mission partner:', error);
    return NextResponse.json({ error: "Failed to fetch mission partner" }, { status: 500 });
  }
}

// PUT - Update mission partner
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
    const { name, description, location, website, imageUrl, imageKey, type, isActive } = body;

    // Validate required fields
    if (!name || !description) {
      return NextResponse.json({ 
        error: "Name and description are required" 
      }, { status: 400 });
    }

    // Check if mission partner exists
    const existingPartner = await prisma.missionPartner.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!existingPartner) {
      return NextResponse.json({ error: "Mission partner not found" }, { status: 404 });
    }

    // Update mission partner
    const updatedPartner = await prisma.missionPartner.update({
      where: { id: parseInt(params.id) },
      data: {
        name,
        description,
        location: location || '',
        website: website || '',
        imageUrl: imageUrl || '',
        imageKey: imageKey || '',
        type: type || 'INTERNATIONAL',
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(updatedPartner);
  } catch (error) {
    console.error('Error updating mission partner:', error);
    return NextResponse.json({ 
      error: "Failed to update mission partner" 
    }, { status: 500 });
  }
}

// DELETE - Delete mission partner
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if mission partner exists
    const existingPartner = await prisma.missionPartner.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!existingPartner) {
      return NextResponse.json({ error: "Mission partner not found" }, { status: 404 });
    }

    // Delete mission partner
    await prisma.missionPartner.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ message: "Mission partner deleted successfully" });
  } catch (error) {
    console.error('Error deleting mission partner:', error);
    return NextResponse.json({ 
      error: "Failed to delete mission partner" 
    }, { status: 500 });
  }
}
