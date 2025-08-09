import { FC } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Header } from '@/components/layout/Header';

const YouthMinistryPage: FC = () => {
  return (
    <>
      <Header />
      <PageLayout
        title="Youth Ministry"
        subtitle="Information about our ministry for youth."
      >
        <p>
          More content about the youth ministry can go here.
        </p>
      </PageLayout>
    </>
  );
};

export default YouthMinistryPage; 