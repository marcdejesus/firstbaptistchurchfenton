"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const staffMembers = [
  {
    id: 'pastor-james-bell',
    name: 'Pastor James – Lead Teaching Pastor',
    title: 'Lead Teaching Pastor',
    bio: [
      "James Bell serves as the Lead Teaching Pastor of First Baptist Church of Fenton. His journey to faith is one marked by skepticism, struggle, and grace. Raised by a single mother and having grown up without a father, James carried deep wounds and questions about God, purpose, and identity. By the time he reached college, he identified as an atheist — hardened by pain, resistant to religion, and searching for truth in all the wrong places.",
      "That all began to change after an head injury landed him in the hospital. A Christian visited him there — not with judgment, but with presence and compassion. That conversation led to months of honest dialogue, raw questions, and finally, a radical encounter with the gospel of Jesus Christ. What started as curiosity became conviction. James gave his life to Christ and was never the same.",
      "After surrendering to the call of ministry, he and his wife, Susanna, moved to North Carolina to serve the homeless, lead inner-city ministries, and begin formal theological training. It was during that season God gave them a growing burden for broken people, burned-out believers, and spiritually dry churches — especially in James's hometown region.",
      "In 2016, Pastor James became the Lead Teaching Pastor of FBC Fenton, where he has faithfully preached God's Word, shepherded the church through revitalization, and led a movement focused on gospel clarity, authentic relationships, and global mission.",
      "He is known for his bold, raw, and transparent preaching, blending theological depth with real-life application. He doesn't shy away from hard conversations. His messages are marked by vulnerability, honesty, and a deep conviction that Jesus is still in the business of healing the broken and building His church.",
      "James is also the President of the Board at the Center of Hope, founder of the Pastors Connection Network, and leader of several regional and international ministry initiatives training pastors in Pakistan, India, and Thailand.",
      "James and Susanna have five wild and wonderful boys: Titus, Timothy, Tatum, Toby, and Theo. He's a devoted dad, a passionate leader, and a firm believer that the local church is still God's plan A for transforming the world.",
      "He also understands ministry pain — the unseen battles, betrayals, and burdens many pastors and families silently carry. This empathy drives his work with pastors around the world, creating safe places for leaders to rest, grow, and return to ministry with clarity and strength.",
    ],
    imageUrl: 'https://images.unsplash.com/photo-1550750632-4d4338d824a7?q=80&w=1974&auto=format&fit=crop', // Placeholder
    email: 'james@fbfenton.org',
    meetingLink: 'https://calendly.com/fbc-fenton-james/30min',
  },
  {
    id: 'laurie-campau',
    name: 'Laurie Campau',
    title: 'Worship Leader',
    bio: [
      "Laurie has led worship at FBC since 2016. She brings a joyful, humble spirit to every service and works hard to point people to Christ through music.",
      "She's married to Brent, and they have five kids: Noel, Annaleise, Lincoln, Aksel, and Krew.",
    ],
    imageUrl: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?q=80&w=1974&auto=format&fit=crop', // Placeholder
    email: 'laurie@fbfenton.org',
  },
  {
    id: 'pastor-cody',
    name: 'Pastor Cody',
    title: 'Families Pastor',
    bio: [
      "Cody came to faith as a teenager and felt called to ministry shortly after. He has a degree in Youth Ministry and leads all our children, youth, and family ministries.",
      "Cody and his wife Alyssa have three daughters: Audrey, Avery, and Addison. He's passionate about helping the next generation know and follow Jesus.",
    ],
    imageUrl: 'https://images.unsplash.com/photo-1610476485891-a86a34551158?q=80&w=1974&auto=format&fit=crop', // Placeholder
    email: 'cody@fbfenton.org',
  },
];

const organization = {
  title: "How We're Organized",
  description: "We're led by a team of elders and supported by seven core ministry teams:",
  teams: [
    "Outreach Team – Local events, serve days, widow care",
    "Missions Team – International partnerships and training",
    "Worship Team – Music, tech, production",
    "Discipleship Team – Groups, classes, mentoring",
    "Care Team – Hospital visits, funeral meals, encouragement",
    "Property & Security Team – Maintenance and safety",
    "Administrative Team – Office support, scheduling, communications"
  ],
  closing: "Everyone has a role to play. If you're ready to serve, there's a place for you."
};

const vision = {
  title: "Where We're Headed",
  description: "We're focused on:",
  points: [
    "Helping broken people find healing in Jesus",
    "Strengthening families",
    "Raising up leaders",
    "Revitalizing churches",
    "Equipping pastors here and around the world"
  ],
  closing: "We're not about performance or polish. We're about the gospel, real community, and being faithful to the mission of Jesus."
};

export default function StaffPage() {
  return (
    <main className="bg-gray-50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-heading tracking-tight lg:text-5xl">Meet Our Team</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Meet the team of pastors and leaders who are dedicated to serving our church and community.
          </p>
        </div>

        <div className="space-y-16">
          {staffMembers.map((staff) => (
            <Card key={staff.id} className="overflow-hidden shadow-lg border-2 border-gray-100">
               <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="md:col-span-1">
                  <Image src={staff.imageUrl} alt={staff.name} width={400} height={500} className="w-full h-full object-cover" />
                </div>
                <div className="md:col-span-2 p-6 md:p-8 flex flex-col">
                  <CardHeader className="p-0">
                    <CardTitle className="text-3xl font-heading font-bold">{staff.name}</CardTitle>
                    <CardDescription className="font-semibold text-primary text-lg">{staff.title}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 mt-6 space-y-4 text-muted-foreground">
                    {staff.bio.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                  </CardContent>
                  <div className="mt-auto pt-6 flex items-center space-x-4">
                    <Button asChild variant="outline">
                      <Link href={`mailto:${staff.email}`} className="flex items-center">
                         <Mail className="h-4 w-4 mr-2" /> Email
                      </Link>
                    </Button>
                    {staff.meetingLink && (
                      <Button asChild>
                        <Link href={staff.meetingLink} target="_blank" rel="noopener noreferrer" className="flex items-center">
                          <CalendarDays className="h-4 w-4 mr-2" /> Schedule a Meeting
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-24 grid md:grid-cols-2 gap-16">
          <Card className="p-8">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-3xl font-heading font-bold">{organization.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-muted-foreground mb-4">{organization.description}</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                {organization.teams.map(item => <li key={item}>{item}</li>)}
              </ul>
              <p className="text-muted-foreground mt-4 font-semibold">{organization.closing}</p>
            </CardContent>
          </Card>
           <Card className="p-8">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-3xl font-heading font-bold">{vision.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-muted-foreground mb-4">{vision.description}</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                {vision.points.map(item => <li key={item}>{item}</li>)}
              </ul>
              <p className="text-muted-foreground mt-4 font-semibold">{vision.closing}</p>
            </CardContent>
          </Card>
        </div>

      </div>
    </main>
  );
} 