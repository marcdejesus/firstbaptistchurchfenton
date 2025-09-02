import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { SeriesForm } from '@/components/admin/SeriesForm';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Edit Series | Admin Dashboard',
  description: 'Edit current sermon series',
  robots: 'noindex, nofollow',
};

async function getSeries(id: string) {
  try {
    const series = await prisma.currentSeries.findUnique({
      where: { id: parseInt(id) }
    });
    return series;
  } catch (error) {
    console.error('Error fetching series:', error);
    return null;
  }
}

export default async function EditSeriesPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
    redirect('/login');
  }

  const series = await getSeries(id);

  if (!series) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Series</h1>
        <p className="text-muted-foreground">
          Update the details of "{series.title}"
        </p>
      </div>

      <SeriesForm series={series} />
    </div>
  );
}
