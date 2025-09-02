import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/admin/ministries - Get all ministries
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ministries = await prisma.ministry.findMany({
      orderBy: { order: 'asc' },
      include: {
        user: {
          select: {
            name: true,
          }
        }
      }
    });

    return NextResponse.json(ministries);
  } catch (error) {
    console.error('Error fetching ministries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ministries' },
      { status: 500 }
    );
  }
}

// POST /api/admin/ministries - Create a new ministry
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log("📥 [Ministries API] Received request body:", body);
    
    const {
      name,
      description,
      imageUrl,
      imageKey,
      targetAudience,
      meetingTime,
      contactEmail,
      order,
      isActive
    } = body;
    
    console.log("📥 [Ministries API] Extracted data:", {
      name,
      description,
      imageUrl,
      imageKey,
      targetAudience,
      meetingTime,
      contactEmail,
      order,
      isActive
    });

    if (!name || !description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      );
    }

    const ministryData = {
      name,
      description,
      imageUrl,
      imageKey,
      targetAudience,
      meetingTime,
      contactEmail,
      order: order || 0,
      isActive: isActive ?? true,
      createdBy: session.user.id,
    };
    
    console.log("💾 [Ministries API] Creating ministry with data:", ministryData);
    
    const ministry = await prisma.ministry.create({
      data: ministryData,
    });
    
    console.log("✅ [Ministries API] Ministry created successfully:", ministry);

    return NextResponse.json(ministry, { status: 201 });
  } catch (error) {
    console.error('Error creating ministry:', error);
    return NextResponse.json(
      { error: 'Failed to create ministry' },
      { status: 500 }
    );
  }
}
