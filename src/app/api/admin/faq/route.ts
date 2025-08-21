import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const faqs = await prisma.fAQ.findMany({
      orderBy: { order: 'asc' },
      include: {
        user: {
          select: {
            name: true,
          }
        }
      }
    });

    return NextResponse.json(faqs);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json({ error: "Failed to fetch FAQs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { question, answer, order, isActive } = body;

    if (!question || !answer) {
      return NextResponse.json({ error: "Question and answer are required" }, { status: 400 });
    }

    // Get the user's database ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const faq = await prisma.fAQ.create({
      data: {
        question: question.trim(),
        answer: answer.trim(),
        order: order || 0,
        isActive: isActive ?? true,
        createdBy: user.id,
      },
      include: {
        user: {
          select: {
            name: true,
          }
        }
      }
    });

    return NextResponse.json(faq);
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return NextResponse.json({ error: "Failed to create FAQ" }, { status: 500 });
  }
}
