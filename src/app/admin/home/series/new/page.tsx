import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { SeriesForm } from '@/components/admin/SeriesForm';

export const metadata: Metadata = {
  title: 'New Series | Admin Dashboard',
  description: 'Create a new sermon series',
  robots: 'noindex, nofollow',
};

export default async function NewSeriesPage() {
  const session = await getServerSession(authOptions);

  if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
    redirect('/login');
  }

  // Create empty series data for new series
  const emptySeries = {
    id: 0,
    title: '',
    description: '',
    imageUrl: '',
    imageKey: '',
    startDate: new Date(),
    endDate: null,
    isActive: false
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New Series</h1>
        <p className="text-muted-foreground">
          Create a new sermon series for your homepage
        </p>
      </div>

      <SeriesForm series={emptySeries} isNew={true} />
    </div>
  );
}
