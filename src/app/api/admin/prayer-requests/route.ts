import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const unansweredOnly = searchParams.get('unansweredOnly') === 'true';
    const publicOnly = searchParams.get('publicOnly') === 'true';

    let whereClause: any = {};
    
    if (unansweredOnly) {
      whereClause.isAnswered = false;
    }
    
    if (publicOnly) {
      whereClause.isPublic = true;
    }

    const requests = await prisma.prayerRequest.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        user: {
          select: {
            name: true,
          }
        }
      }
    });

    const totalCount = await prisma.prayerRequest.count({
      where: whereClause,
    });

    return NextResponse.json({
      success: true,
      requests,
      totalCount,
      hasMore: offset + limit < totalCount,
    });

  } catch (error) {
    console.error("Error fetching prayer requests:", error);
    return NextResponse.json({ 
      error: 'Failed to fetch prayer requests' 
    }, { status: 500 });
  }
}
