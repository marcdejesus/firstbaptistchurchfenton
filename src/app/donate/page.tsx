"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronRight, Mail, Phone, MapPin, ImageIcon, Heart, Users, Briefcase } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { PageLayout } from "@/components/layout/PageLayout";

// Placeholder for images
const ImagePlaceholder = () => (
  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
    <ImageIcon className="text-gray-400 w-12 h-12" />
  </div>
);

export default function DonatePage() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Give" },
  ];

  const faqItems = [
    {
      question: "How can I give?",
      answer: "You can give online through our secure donation portal. We also accept donations during services or by mail. Checks can be made payable to First Baptist Church of Fenton.",
    },
    {
      question: "Is my donation secure?",
      answer: "Yes, our online giving platform uses industry-standard encryption to ensure your information is safe. We prioritize your privacy and security. You can give with confidence.",
    },
    {
      question: "What is the process?",
      answer: "Simply visit our donation page, select the amount, and choose your preferred payment method. Follow the prompts to complete your donation. You will receive a confirmation email for your records.",
    },
    {
      question: "Can I donate anonymously?",
      answer: "Yes, you have the option to give anonymously through our online portal. Your privacy is important to us. If you choose to remain anonymous, your information will not be shared.",
    },
    {
      question: "Will I receive a receipt?",
      answer: "Absolutely! You will receive a receipt via email after your donation is processed. This receipt can be used for tax purposes. If you need a physical copy, please let us know.",
    },
  ];

  return (
    <>
      <Header breadcrumbs={breadcrumbs} />
      <PageLayout>
        <div className="bg-gray-50">
          {/* Hero Section */}
          <section className="text-center py-20 px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl font-bold text-gray-800">Give to Grow</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              Your generosity fuels our mission and helps us serve our community and spread the Word.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" className="bg-primary text-primary-foreground">Donate</Button>
              <Button size="lg" variant="outline">Learn More</Button>
            </div>
          </section>

          {/* Explore Ways to Support */}
          <section className="py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-800">
                  Explore the Many Ways to Support Our Church Community
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  Your donation supports our mission and helps us serve our community. Discover how you can contribute through various giving options.
                </p>
                <div className="mt-10 grid sm:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold">Online</h3>
                    <p className="mt-2 text-gray-600">Securely through our website anytime.</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">In-Person</h3>
                    <p className="mt-2 text-gray-600">During services to give directly.</p>
                  </div>
                </div>
              </div>
              <div className="h-96 rounded-lg overflow-hidden">
                <Image
                  src="/volunteer.png"
                  alt="Community service"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </section>

          {/* Support Ministries and Outreach */}
          <section className="bg-white py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Heart className="w-12 h-12 text-primary mb-4" />
                <h2 className="text-4xl font-bold text-gray-800">
                  Support Our Ministries and Community Outreach
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  Your generous donations empower us to enhance our ministries and outreach programs. Every contribution, no matter the size, makes a significant impact on our community and beyond.
                </p>
                <div className="mt-8 flex items-center gap-6">
                  <Button>Donate</Button>
                  <Link href="#" className="flex items-center text-primary font-semibold">
                    Learn More <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="h-96">
                <ImagePlaceholder />
              </div>
            </div>
          </section>

          {/* Support Our Church's Mission */}
          <section className="py-24 px-4 sm:px-6 lg:px-8">
            <Card className="max-w-7xl mx-auto overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="p-12">
                  <h2 className="text-4xl font-bold text-gray-800">Support Our Church's Mission</h2>
                  <p className="mt-4 text-lg text-gray-600">
                    Your generous giving helps us serve our community and spread the message of hope.
                  </p>
                  <div className="mt-8 flex gap-4">
                    <Button>Donate</Button>
                    <Button variant="outline">Give</Button>
                  </div>
                </div>
                <div className="bg-gray-200">
                  <ImagePlaceholder />
                </div>
              </div>
            </Card>
          </section>

          {/* Generous Giving Options */}
          <section className="bg-white py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-center">
              <p className="text-primary font-semibold">Giving</p>
              <h2 className="mt-2 text-4xl font-bold text-gray-800">
                Support Our Church Through Generous Giving
              </h2>
              <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
                Your contributions help us fulfill our mission and serve our community. Explore various ways you can support our church today.
              </p>
            </div>
            <div className="max-w-7xl mx-auto mt-16 grid md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <div className="h-48 bg-gray-200 mb-4 flex items-center justify-center">
                     <Users className="text-gray-400 w-12 h-12" />
                  </div>
                  <CardTitle>Opportunities to Give Back to Our Community</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Join us in making a difference through your generosity.</p>
                  <div className="mt-6 flex justify-center items-center gap-4">
                    <Button variant="outline">Donate</Button>
                    <Link href="#" className="flex items-center text-primary font-semibold">
                      Learn More <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="h-48 bg-gray-200 mb-4 flex items-center justify-center">
                     <Heart className="text-gray-400 w-12 h-12" />
                  </div>
                  <CardTitle>Tithe: Support Our Church's Ongoing Ministries</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Your tithes are vital for our Church's operations.</p>
                   <div className="mt-6 flex justify-center items-center gap-4">
                    <Button variant="outline">Donate</Button>
                    <Link href="#" className="flex items-center text-primary font-semibold">
                      Learn More <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="h-48 bg-gray-200 mb-4 flex items-center justify-center">
                     <Briefcase className="text-gray-400 w-12 h-12" />
                  </div>
                  <CardTitle>Missions: Impact Lives Locally and Globally</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Help us spread hope through mission work.</p>
                  <div className="mt-6 flex justify-center items-center gap-4">
                    <Button variant="outline">Donate</Button>
                    <Link href="#" className="flex items-center text-primary font-semibold">
                      Learn More <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-center text-gray-800">FAQs</h2>
              <p className="mt-4 text-center text-lg text-gray-600">
                Find answers to your questions about giving and how your donations make a difference.
              </p>
              <Accordion type="single" collapsible className="w-full mt-12">
                {faqItems.map((item, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="text-lg font-semibold">{item.question}</AccordionTrigger>
                    <AccordionContent className="text-base text-gray-700">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <div className="mt-16 text-center">
                 <h3 className="text-2xl font-bold">Still have questions?</h3>
                 <div className="mt-6">
                    <Button variant="outline">Contact</Button>
                 </div>
              </div>
            </div>
          </section>

          {/* Get in Touch Section */}
          <section className="bg-white py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-center">
              <p className="text-primary font-semibold">Support</p>
              <h2 className="mt-2 text-4xl font-bold text-gray-800">Get in Touch</h2>
              <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
                We're here to help you with your donations.
              </p>
            </div>
            <div className="max-w-7xl mx-auto mt-16 grid md:grid-cols-3 gap-12 text-center">
              <div>
                <Mail className="mx-auto h-12 w-12 text-primary" />
                <h3 className="mt-6 text-xl font-semibold">Email</h3>
                <p className="mt-2 text-gray-600">For inquiries about donations, please reach out via email.</p>
                <a href="mailto:info@firstbaptistfenton.org" className="mt-4 inline-block text-primary font-semibold">info@firstbaptistfenton.org</a>
              </div>
              <div>
                <Phone className="mx-auto h-12 w-12 text-primary" />
                <h3 className="mt-6 text-xl font-semibold">Phone</h3>
                <p className="mt-2 text-gray-600">Call us for immediate assistance regarding your donations.</p>
                <a href="tel:+1-555-123-4567" className="mt-4 inline-block text-primary font-semibold">+1 (555) 123-4567</a>
              </div>
              <div>
                <MapPin className="mx-auto h-12 w-12 text-primary" />
                <h3 className="mt-6 text-xl font-semibold">Office</h3>
                <p className="mt-2 text-gray-600">Visit us at our office for more information.</p>
                <a href="#" className="mt-4 inline-block text-primary font-semibold">860 N Leroy St, Fenton, MI</a>
              </div>
            </div>
          </section>
        </div>
      </PageLayout>
    </>
  );
}
