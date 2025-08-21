import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // Get the authenticated session
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'You must be logged in to volunteer.' }, { status: 401 });
    }

    // Find the user in our database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const { opportunityId, message } = await request.json();

    if (!opportunityId) {
      return NextResponse.json({ error: 'Volunteer opportunity ID is required.' }, { status: 400 });
    }

    // Create the volunteer signup
    const volunteerSignup = await prisma.volunteerSignup.create({
      data: {
        opportunityId,
        userId: user.id,
        message: message || '',
        status: 'PENDING',
      },
    });

    return NextResponse.json({ 
      message: 'Signed up successfully!', 
      id: volunteerSignup.id 
    });

  } catch (error) {
    console.error("Error adding volunteer signup: ", error);
    return NextResponse.json({ error: 'An error occurred while signing up.' }, { status: 500 });
  }
} 