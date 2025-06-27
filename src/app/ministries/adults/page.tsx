import { FC } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Header } from '@/components/layout/Header';

const AdultsMinistryPage: FC = () => {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Ministries", href: "/ministries" },
    { label: "Adults" },
  ];

  return (
    <>
      <Header breadcrumbs={breadcrumbs} />
      <PageLayout
        title="Adults Ministry"
        subtitle="Information about our ministry for adults."
      >
        <p>
          More content about the adults ministry can go here.
        </p>
      </PageLayout>
    </>
  );
};

export default AdultsMinistryPage; 