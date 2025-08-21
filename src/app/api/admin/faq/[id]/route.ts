import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Props {
  params: { id: string };
}

export async function GET(request: Request, { params }: Props) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const faqId = parseInt(params.id);
    if (isNaN(faqId)) {
      return NextResponse.json({ error: "Invalid FAQ ID" }, { status: 400 });
    }

    const faq = await prisma.fAQ.findUnique({
      where: { id: faqId },
      include: {
        user: {
          select: {
            name: true,
          }
        }
      }
    });

    if (!faq) {
      return NextResponse.json({ error: "FAQ not found" }, { status: 404 });
    }

    return NextResponse.json(faq);
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    return NextResponse.json({ error: "Failed to fetch FAQ" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Props) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const faqId = parseInt(params.id);
    if (isNaN(faqId)) {
      return NextResponse.json({ error: "Invalid FAQ ID" }, { status: 400 });
    }

    const body = await request.json();
    const { question, answer, order, isActive } = body;

    if (!question || !answer) {
      return NextResponse.json({ error: "Question and answer are required" }, { status: 400 });
    }

    // Check if FAQ exists
    const existingFAQ = await prisma.fAQ.findUnique({
      where: { id: faqId }
    });

    if (!existingFAQ) {
      return NextResponse.json({ error: "FAQ not found" }, { status: 404 });
    }

    const faq = await prisma.fAQ.update({
      where: { id: faqId },
      data: {
        question: question.trim(),
        answer: answer.trim(),
        order: order || 0,
        isActive: isActive ?? true,
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
    console.error('Error updating FAQ:', error);
    return NextResponse.json({ error: "Failed to update FAQ" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Props) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Admin access required" }, { status: 401 });
    }

    const faqId = parseInt(params.id);
    if (isNaN(faqId)) {
      return NextResponse.json({ error: "Invalid FAQ ID" }, { status: 400 });
    }

    // Check if FAQ exists
    const existingFAQ = await prisma.fAQ.findUnique({
      where: { id: faqId }
    });

    if (!existingFAQ) {
      return NextResponse.json({ error: "FAQ not found" }, { status: 404 });
    }

    await prisma.fAQ.delete({
      where: { id: faqId }
    });

    return NextResponse.json({ message: "FAQ deleted successfully" });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return NextResponse.json({ error: "Failed to delete FAQ" }, { status: 500 });
  }
}
