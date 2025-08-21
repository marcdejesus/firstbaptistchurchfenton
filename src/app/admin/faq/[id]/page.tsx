import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { FAQForm } from '@/components/admin/FAQForm';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (params.id === 'new') {
    return {
      title: 'New FAQ | Admin Dashboard',
      description: 'Create a new frequently asked question',
      robots: 'noindex, nofollow',
    };
  }

  const faq = await getFAQ(params.id);
  if (!faq) {
    return {
      title: 'FAQ Not Found | Admin Dashboard',
      robots: 'noindex, nofollow',
    };
  }

  return {
    title: `Edit FAQ: ${faq.question} | Admin Dashboard`,
    description: 'Edit frequently asked question',
    robots: 'noindex, nofollow',
  };
}

async function getFAQ(id: string) {
  if (id === 'new') return null;

  try {
    const faq = await prisma.fAQ.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            name: true,
          }
        }
      }
    });
    return faq;
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    return null;
  }
}

export default async function FAQEditPage({ params }: Props) {
  const faq = await getFAQ(params.id);
  const isNew = params.id === 'new';

  if (!isNew && !faq) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {isNew ? 'Create New FAQ' : 'Edit FAQ'}
        </h1>
        <p className="text-muted-foreground">
          {isNew
            ? 'Add a new frequently asked question to help your visitors'
            : 'Update the question and answer to keep information current'
          }
        </p>
      </div>

      <FAQForm faq={faq} isNew={isNew} />
    </div>
  );
}
