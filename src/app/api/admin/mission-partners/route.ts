import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - List all mission partners
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const missionPartners = await prisma.missionPartner.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
          }
        }
      }
    });

    return NextResponse.json(missionPartners);
  } catch (error) {
    console.error('Error fetching mission partners:', error);
    return NextResponse.json({ error: "Failed to fetch mission partners" }, { status: 500 });
  }
}

// POST - Create new mission partner
export async function POST(request: NextRequest) {
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

    // Create new mission partner
    const missionPartner = await prisma.missionPartner.create({
      data: {
        name,
        description,
        location: location || '',
        website: website || '',
        imageUrl: imageUrl || '',
        imageKey: imageKey || '',
        type: type || 'INTERNATIONAL',
        isActive: isActive ?? true,
        createdBy: session.user.id,
      },
    });

    return NextResponse.json(missionPartner, { status: 201 });
  } catch (error) {
    console.error('Error creating mission partner:', error);
    return NextResponse.json({ 
      error: "Failed to create mission partner" 
    }, { status: 500 });
  }
}
