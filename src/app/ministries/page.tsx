import React from 'react';
import Image from 'next/image';
import { Users, BookOpen, Heart, GraduationCap } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { PageLayout } from '@/components/layout/PageLayout';

interface Ministry {
  title: string;
  description: string;
  imageUrl?: string;
  icon: React.ComponentType<any>;
  highlights: string[];
}

const ministries: Ministry[] = [
  {
    title: "Kids Ministry",
    description: `Rooted Kids Ministry partners with parents to make disciples by providing engaging environments for children to grow in their faith. We offer Children's small groups during the 9:30 am service led by experienced teachers, Children's Church during the 10:30 am Worship Service, and a Family Night small group on Thursday evenings at 5:30 pm with activities for children and a discussion group for parents on topics like home life, marriage, parenting, and finances. Our goal is to integrate children into the life of the church and support parents in the discipleship process.`,
    imageUrl: "/rootedkids.png",
    icon: Heart,
    highlights: [
      "Children's small groups during 9:30 am service",
      "Children's Church during 10:30 am Worship Service", 
      "Family Night small group on Thursday evenings at 5:30 pm",
      "Parent discussion groups on family topics"
    ]
  },
  {
    title: "Student Ministry",
    description: `Welcome to the Student Ministry at First Baptist Church, where we partner with parents to love, serve, and disciple their children, who are an integral part of the FBC family. We provide a fun and engaging environment for students to experience the Gospel, be discipled by mentors and peers, and get involved in various church ministries on Sunday mornings. We also offer regular activities for teens to connect, unify, and grow in their faith through participation in events and activities that build lasting friendships and help them become lifelong followers of Christ.`,
    imageUrl: "/groundzero.png",
    icon: GraduationCap,
    highlights: [
      "Fun and engaging Gospel-centered environment",
      "Mentorship and peer discipleship",
      "Sunday morning ministry involvement",
      "Regular teen activities and events"
    ]
  },
  {
    title: "Equip Classes",
    description: `Equip classes at First Baptist Church are designed to enable people to discover and develop their gifts, which we believe is God's strategy for changing the world. These small, instructor-led classes meet at the church building and serve as an additional resource for spiritual growth and application outside of small groups. We offer a wide variety of topics including Biblical literacy, Christian theology, finance, parenting, marriage, and gender-specific studies, typically running for 7 to 15 weeks each semester to help you grow in your understanding of God's Word and apply it effectively.`,
    imageUrl: "/equip.png",
    icon: BookOpen,
    highlights: [
      "Biblical literacy and Christian theology",
      "Finance, parenting, and marriage topics",
      "Gender-specific studies",
      "7-15 week semester programs"
    ]
  },
  {
    title: "Small Groups",
    description: `Small Groups at First Baptist Church are where we desire everyone who calls FBC home to find lasting and purposeful community. Designed to make our Sunday gatherings feel small, these groups provide a place to belong, be cared for, and be strengthened in your journey with Jesus. They are essential to FBC life, offering opportunities to study the Bible, serve one another and our city, find purposeful accountability, and engage in discipleship. Strategically structured for growth alongside others, Small Groups are a great way to get involved and feel at home.`,
    imageUrl: "/growgroups.png",
    icon: Users,
    highlights: [
      "Lasting and purposeful community",
      "Bible study and discipleship",
      "Mutual care and accountability",
      "Service opportunities in our city"
    ]
  },
];

const MinistriesPage: React.FC = () => {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Ministries" },
  ];

  return (
    <>
      <Header breadcrumbs={breadcrumbs} />
      <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
        {/* Hero Section - Design System Enhanced */}
        <PageLayout>
          <div className="bg-scheme-2-background py-16 mb-12">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-desktop-heading1 font-heading font-bold text-scheme-2-text mb-4">
                Our Ministries
              </h1>
              <p className="text-desktop-textLarge text-scheme-2-text opacity-80 max-w-3xl mx-auto font-body">
                At First Baptist Church, we're committed to helping you grow in your faith journey
                through meaningful connections and purposeful community involvement.
              </p>
            </div>
          </div>

          {/* Ministries Content */}
          <div className="container mx-auto px-4 pb-16">
            <div className="space-y-20">
              {ministries.map((ministry, index) => {
                const IconComponent = ministry.icon;
                const isEven = index % 2 === 0;

                return (
                  <div key={index} className="relative">
                    <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}>

                      {/* Image Section */}
                      {ministry.imageUrl ? (
                        <div className="w-full lg:w-1/2">
                          <div className="relative h-[560px] w-full rounded-lg overflow-hidden">
                            <Image
                              src={ministry.imageUrl}
                              alt={ministry.title}
                              fill
                              className="object-contain"
                              priority={index === 0}
                            />
                          </div>
                        </div>
                      ) : (
                        // Icon placeholder for ministries without images
                        <div className="w-full lg:w-1/2 flex justify-center">
                          <div className="bg-accent/10 border-2 border-accent/20 rounded-full p-16">
                            <IconComponent className="h-32 w-32 text-accent" />
                          </div>
                        </div>
                      )}

                      {/* Content Section */}
                      <div className="w-full lg:w-1/2 space-y-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <IconComponent className="h-8 w-8 text-accent" />
                          <h2 className="text-3xl font-lora font-bold">
                            {ministry.title}
                          </h2>
                        </div>

                        <p className="text-lg text-muted-foreground leading-relaxed">
                          {ministry.description}
                        </p>

                        {/* Highlights */}
                        <div className="space-y-3">
                          <h3 className="text-xl font-semibold">
                            What We Offer:
                          </h3>
                          <ul className="space-y-2">
                            {ministry.highlights.map((highlight, highlightIndex) => (
                              <li key={highlightIndex} className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-muted-foreground">{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Divider between sections (except last one) */}
                    {index < ministries.length - 1 && (
                      <div className="mt-20 border-t border-primary/20"></div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Call to Action - Design System Enhanced */}
            <div className="mt-20 text-center py-16 bg-scheme-3-background rounded-lg border border-scheme-3-border">
              <h2 className="text-desktop-heading2 font-heading font-bold text-scheme-3-text mb-4">
                Ready to Get Involved?
              </h2>
              <p className="text-desktop-textLarge text-scheme-3-text opacity-80 mb-8 max-w-2xl mx-auto font-body">
                We'd love to help you find the perfect ministry to connect, grow, and serve.
                Contact us today to learn more about how you can get involved.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/#contact-us-section-id"
                  className="inline-flex items-center justify-center px-8 py-3 bg-primary-orange text-white hover:bg-primary-orange-dark transition-colors rounded-md font-semibold"
                >
                  Contact Us
                </a>
                <a
                  href="/events"
                  className="inline-flex items-center justify-center px-8 py-3 border-2 border-primary-orange text-primary-orange hover:bg-primary-orange hover:text-white transition-colors rounded-md font-semibold"
                >
                  View Upcoming Events
                </a>
              </div>
            </div>
          </div>
        </PageLayout>
      </div>
    </>
  );
};

export default MinistriesPage;