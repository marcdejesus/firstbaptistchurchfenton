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

    const submissionId = parseInt(params.id);
    if (isNaN(submissionId)) {
      return NextResponse.json({ error: 'Invalid submission ID' }, { status: 400 });
    }

    const { isRead } = await request.json();

    if (typeof isRead !== 'boolean') {
      return NextResponse.json({ error: 'isRead must be a boolean' }, { status: 400 });
    }

    const updatedSubmission = await prisma.contactSubmission.update({
      where: { id: submissionId },
      data: { isRead },
    });

    return NextResponse.json({
      success: true,
      submission: updatedSubmission,
    });

  } catch (error) {
    console.error("Error updating contact submission:", error);
    return NextResponse.json({ 
      error: 'Failed to update contact submission' 
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

    const submissionId = parseInt(params.id);
    if (isNaN(submissionId)) {
      return NextResponse.json({ error: 'Invalid submission ID' }, { status: 400 });
    }

    await prisma.contactSubmission.delete({
      where: { id: submissionId },
    });

    return NextResponse.json({
      success: true,
      message: 'Contact submission deleted successfully',
    });

  } catch (error) {
    console.error("Error deleting contact submission:", error);
    return NextResponse.json({ 
      error: 'Failed to delete contact submission' 
    }, { status: 500 });
  }
}
