import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
// This is a placeholder for your actual server-side session logic.
// You will need to replace this with your own authentication utility.
import { getServerSession } from "next-auth/next" // Example using NextAuth.js
import { authOptions } from "@/app/api/auth/[...nextauth]/route" // Example path

async function getUserData(userId: string) {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
        return userDoc.data();
    }
    return null;
}

export async function POST(request: Request) {
  // --- PLACEHOLDER ---
  // Replace this with your actual session retrieval logic.
  // For example, using NextAuth.js:
  // const session = await getServerSession(authOptions);
  // Or using Firebase Auth:
  // const token = request.headers.get('Authorization')?.split('Bearer ')[1];
  // const decodedToken = await auth.verifyIdToken(token);
  // const session = { user: { id: decodedToken.uid } };
  const session = { user: { id: "placeholder-user-id" } } // Replace this line

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'You must be logged in to submit a prayer request.' }, { status: 401 });
  }

  const userId = session.user.id;
  const userData = await getUserData(userId);

  if (!userData || !userData.isApprovedMember) {
      return NextResponse.json({ error: 'You must be an approved member to post a prayer request.' }, { status: 403 });
  }

  try {
    const { request: prayerRequest } = await request.json();

    if (!prayerRequest) {
      return NextResponse.json({ error: 'Prayer request is required.' }, { status: 400 });
    }

    const docRef = await addDoc(collection(db, 'prayer-requests'), {
      userId: userId,
      userName: userData.name || 'Anonymous',
      request: prayerRequest,
      isArchived: false,
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ message: 'Prayer request submitted successfully', id: docRef.id });

  } catch (error) {
    console.error("Error adding document: ", error);
    return NextResponse.json({ error: 'An error occurred while submitting your request.' }, { status: 500 });
  }
} 