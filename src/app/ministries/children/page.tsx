import { FC } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Header } from '@/components/layout/Header';

const ChildrensMinistryPage: FC = () => {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Ministries", href: "/ministries" },
    { label: "Children" },
  ];

  return (
    <>
      <Header breadcrumbs={breadcrumbs} />
      <PageLayout
        title="Children's Ministry"
        subtitle="Information about our ministry for children."
      >
        <p>
          More content about the children's ministry can go here.
        </p>
      </PageLayout>
    </>
  );
};

export default ChildrensMinistryPage; 