import { Metadata } from 'next';
import { MinistryForm } from '@/components/admin/MinistryForm';

export const metadata: Metadata = {
  title: 'Create New Ministry | Admin Dashboard',
  description: 'Create a new church ministry or program',
  robots: 'noindex, nofollow',
};

export default function NewMinistryPage() {
  return <MinistryForm isNew={true} />;
}
