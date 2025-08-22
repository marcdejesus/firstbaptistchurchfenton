import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { SlideshowForm } from '@/components/admin/SlideshowForm';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  if (id === 'new') {
    return {
      title: 'New Slide | Admin Dashboard',
      description: 'Create a new slideshow slide',
      robots: 'noindex, nofollow',
    };
  }

  const slide = await getSlide(id);
  if (!slide) {
    return {
      title: 'Slide Not Found | Admin Dashboard',
      robots: 'noindex, nofollow',
    };
  }

  return {
    title: `Edit Slide: ${slide.title || 'Untitled'} | Admin Dashboard`,
    description: 'Edit slideshow slide',
    robots: 'noindex, nofollow',
  };
}

async function getSlide(id: string) {
  if (id === 'new') return null;

  try {
    const slide = await prisma.homeSlideshow.findUnique({
      where: { id: parseInt(id) }
    });
    return slide;
  } catch (error) {
    console.error('Error fetching slide:', error);
    return null;
  }
}

export default async function SlideshowEditPage({ params }: Props) {
  const { id } = await params;
  const slide = await getSlide(id);
  const isNew = id === 'new';

  if (!isNew && !slide) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {isNew ? 'Create New Slide' : 'Edit Slide'}
        </h1>
        <p className="text-muted-foreground">
          {isNew
            ? 'Add a new slide to your homepage slideshow'
            : 'Update the slide content and settings'
          }
        </p>
      </div>

      <SlideshowForm slide={slide} isNew={isNew} />
    </div>
  );
}
