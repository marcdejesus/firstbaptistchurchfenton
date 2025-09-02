import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const requestId = parseInt(params.id);
    if (isNaN(requestId)) {
      return NextResponse.json({ error: 'Invalid prayer request ID' }, { status: 400 });
    }

    const { isAnswered } = await request.json();

    if (typeof isAnswered !== 'boolean') {
      return NextResponse.json({ error: 'isAnswered must be a boolean' }, { status: 400 });
    }

    const updatedRequest = await prisma.prayerRequest.update({
      where: { id: requestId },
      data: { isAnswered },
    });

    return NextResponse.json({
      success: true,
      request: updatedRequest,
    });

  } catch (error) {
    console.error("Error updating prayer request:", error);
    return NextResponse.json({ 
      error: 'Failed to update prayer request' 
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const requestId = parseInt(params.id);
    if (isNaN(requestId)) {
      return NextResponse.json({ error: 'Invalid prayer request ID' }, { status: 400 });
    }

    await prisma.prayerRequest.delete({
      where: { id: requestId },
    });

    return NextResponse.json({
      success: true,
      message: 'Prayer request deleted successfully',
    });

  } catch (error) {
    console.error("Error deleting prayer request:", error);
    return NextResponse.json({ 
      error: 'Failed to delete prayer request' 
    }, { status: 500 });
  }
}
