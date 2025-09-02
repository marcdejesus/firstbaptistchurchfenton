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
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    const whereClause = unreadOnly ? { isRead: false } : {};

    const submissions = await prisma.contactSubmission.findMany({
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

    const totalCount = await prisma.contactSubmission.count({
      where: whereClause,
    });

    return NextResponse.json({
      success: true,
      submissions,
      totalCount,
      hasMore: offset + limit < totalCount,
    });

  } catch (error) {
    console.error("Error fetching contact submissions:", error);
    return NextResponse.json({ 
      error: 'Failed to fetch contact submissions' 
    }, { status: 500 });
  }
}
