import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Ministry {
  title: string;
  description: string;
  imageUrl?: string;
}

const ministries: Ministry[] = [
  {
    title: "Kids Ministry",
    description: `Rooted Kids Ministry partners with parents to make disciples by providing engaging environments for children to grow in their faith. We offer Children's small groups during the 9:30 am service led by experienced teachers, Children's Church during the 10:30 am Worship Service, and a Family Night small group on Thursday evenings at 5:30 pm with activities for children and a discussion group for parents on topics like home life, marriage, parenting, and finances. Our goal is to integrate children into the life of the church and support parents in the discipleship process.`,
  },
  {
    title: "Student Ministry",
    description: `Welcome to the Student Ministry at First Baptist Church, where we partner with parents to love, serve, and disciple their children, who are an integral part of the FBC family. We provide a fun and engaging environment for students to experience the Gospel, be discipled by mentors and peers, and get involved in various church ministries on Sunday mornings. We also offer regular activities for teens to connect, unify, and grow in their faith through participation in events and activities that build lasting friendships and help them become lifelong followers of Christ.`,
  },
  {
    title: "Equip Classes",
    description: `Equip classes at First Baptist Church are designed to enable people to discover and develop their gifts, which we believe is God's strategy for changing the world. These small, instructor-led classes meet at the church building and serve as an additional resource for spiritual growth and application outside of small groups. We offer a wide variety of topics including Biblical literacy, Christian theology, finance, parenting, marriage, and gender-specific studies, typically running for 7 to 15 weeks each semester to help you grow in your understanding of God's Word and apply it effectively.`,
  },
  {
    title: "Small Groups",
    description: `Small Groups at First Baptist Church are where we desire everyone who calls FBC home to find lasting and purposeful community. Designed to make our Sunday gatherings feel small, these groups provide a place to belong, be cared for, and be strengthened in your journey with Jesus. They are essential to FBC life, offering opportunities to study the Bible, serve one another and our city, find purposeful accountability, and engage in discipleship. Strategically structured for growth alongside others, Small Groups are a great way to get involved and feel at home.`,
  },
];

const MinistriesPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-lora font-bold text-center text-primary-foreground mb-8">Our Ministries</h1>
      <div className="grid grid-cols-1 gap-6">
        {ministries.map((ministry, index) => (
          <Card key={index} className="flex flex-col md:flex-row">
            {ministry.imageUrl && (
              <div className="relative w-full md:w-1/3 h-48 md:h-auto overflow-hidden rounded-t-md md:rounded-l-md md:rounded-t-none">
                <Image
                  src={ministry.imageUrl}
                  alt={ministry.title}
                  layout="fill"
                  objectFit="cover"
                />
            </div>
            )}
            <CardHeader className="flex-grow">
              <CardTitle className="text-2xl font-semibold">{ministry.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription className="text-sm leading-relaxed whitespace-pre-wrap">{ministry.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MinistriesPage;