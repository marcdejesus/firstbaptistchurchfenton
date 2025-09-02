import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { StaffForm } from '@/components/admin/StaffForm';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Add New Staff Member | Admin Dashboard',
  description: 'Add a new staff member to your leadership team',
  robots: 'noindex, nofollow',
};

export default async function NewStaffPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  return <StaffForm />;
}
