import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/admin/ministries/[id] - Get a specific ministry
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ministry ID' }, { status: 400 });
    }

    const ministry = await prisma.ministry.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
          }
        }
      }
    });

    if (!ministry) {
      return NextResponse.json({ error: 'Ministry not found' }, { status: 404 });
    }

    return NextResponse.json(ministry);
  } catch (error) {
    console.error('Error fetching ministry:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ministry' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/ministries/[id] - Update a ministry
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ministry ID' }, { status: 400 });
    }

    const body = await request.json();
    console.log("📥 [Ministries API] PUT request body:", body);
    
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
    
    console.log("📥 [Ministries API] PUT extracted data:", {
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

    const existingMinistry = await prisma.ministry.findUnique({
      where: { id }
    });

    if (!existingMinistry) {
      return NextResponse.json({ error: 'Ministry not found' }, { status: 404 });
    }

    const updateData = {
      name,
      description,
      imageUrl,
      imageKey,
      targetAudience,
      meetingTime,
      contactEmail,
      order: order || 0,
      isActive: isActive ?? true,
      updatedAt: new Date(),
    };
    
    console.log("💾 [Ministries API] Updating ministry with data:", updateData);
    
    const updatedMinistry = await prisma.ministry.update({
      where: { id },
      data: updateData,
    });
    
    console.log("✅ [Ministries API] Ministry updated successfully:", updatedMinistry);

    return NextResponse.json(updatedMinistry);
  } catch (error) {
    console.error('Error updating ministry:', error);
    return NextResponse.json(
      { error: 'Failed to update ministry' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/ministries/[id] - Delete a ministry
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ministry ID' }, { status: 400 });
    }

    const existingMinistry = await prisma.ministry.findUnique({
      where: { id }
    });

    if (!existingMinistry) {
      return NextResponse.json({ error: 'Ministry not found' }, { status: 404 });
    }

    await prisma.ministry.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Ministry deleted successfully' });
  } catch (error) {
    console.error('Error deleting ministry:', error);
    return NextResponse.json(
      { error: 'Failed to delete ministry' },
      { status: 500 }
    );
  }
}
