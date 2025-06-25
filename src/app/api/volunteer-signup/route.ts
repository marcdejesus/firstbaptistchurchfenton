import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// This is a placeholder for your actual server-side session logic.
// You will need to replace the session handling logic below with your own.

export async function POST(request: Request) {
  // --- PLACEHOLDER ---
  // Replace this with your actual session retrieval logic.
  const session = { user: { id: "placeholder-user-id" } } // Replace this line

  if (!session || !session.user) {
    return NextResponse.json({ error: 'You must be logged in to volunteer.' }, { status: 401 });
  }

  try {
    const { opportunityId, message } = await request.json();

    if (!opportunityId) {
      return NextResponse.json({ error: 'Volunteer opportunity ID is required.' }, { status: 400 });
    }

    const docRef = await addDoc(collection(db, 'volunteer-signups'), {
      opportunityId,
      userId: session.user.id,
      message: message || '',
      status: 'pending', // e.g., pending, confirmed, declined
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ message: 'Signed up successfully!', id: docRef.id });

  } catch (error) {
    console.error("Error adding volunteer signup: ", error);
    return NextResponse.json({ error: 'An error occurred while signing up.' }, { status: 500 });
  }
} 