"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from 'next/link';
import Image from "next/image";
import { ArrowRight, Star, Mail, Phone, MapPin, BookOpen } from "lucide-react";
import { WelcomeCard } from "@/components/WelcomeCard";

export default function Home() {
  return (
    <div className="overflow-hidden flex-col justify-start items-start inline-flex">
      
      {/* Hero Section */}
      <section className="self-stretch px-16 py-12 bg-scheme-1-background overflow-hidden justify-center items-start gap-20 inline-flex">
        <div className="flex-1 max-w-7xl flex-col justify-start items-start gap-20 inline-flex">
          <div className="self-stretch justify-start items-center gap-20 inline-flex">
            <div className="flex-1 flex-col justify-start items-start gap-8 inline-flex">
              <div className="self-stretch flex-col justify-start items-start gap-6 flex">
                <h1 className="self-stretch text-scheme-1-text text-[56px] font-heading font-bold leading-[67.20px]">
                  Welcome to First Baptist Church of Fenton, Michigan
                </h1>
                <p className="self-stretch text-scheme-1-text text-lg font-body leading-[27px]">
                  Join us for uplifting worship and community. We gather every Sunday at 10 AM at 860 N Leroy St, Fenton, MI.
                </p>
              </div>
              <div className="justify-start items-start gap-4 inline-flex">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                  <Link href="/visit">Learn More</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/events">Sign Up</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <Image 
                src="/bible.png" 
                alt="Holy Bible"
                width={566} 
                height={565} 
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section className="self-stretch px-16 py-28 bg-scheme-1-background overflow-hidden flex-col justify-start items-center gap-20 flex">
        <div className="w-full max-w-7xl flex-col justify-start items-center gap-20 flex">
          <h2 className="max-w-4xl text-center text-scheme-1-text text-[40px] font-heading font-bold leading-[48px]">
            Experience uplifting worship services every week at First Baptist Church of Fenton.
          </h2>
          <div className="self-stretch flex-col justify-start items-start gap-16 flex">
            <div className="self-stretch justify-center items-start gap-12 inline-flex">
              <div className="flex-1 flex-col justify-start items-center gap-8 inline-flex">
                <div className="self-stretch flex-col justify-start items-center gap-6 flex">
                  <div className="w-12 h-12 relative">
                    <Users className="w-11 h-7 text-scheme-1-text" />
                  </div>
                  <div className="self-stretch flex-col justify-start items-start gap-6 flex">
                    <h3 className="self-stretch text-center text-scheme-1-text text-2xl font-heading font-bold leading-[33.60px]">
                      Join our vibrant community events and connect with fellow believers.
                    </h3>
                    <p className="self-stretch text-center text-scheme-1-text text-base font-body leading-6">
                      Discover various ministry opportunities to grow in faith and serve others.
                    </p>
                  </div>
                </div>
                <div className="self-stretch flex-col justify-start items-center gap-2 flex">
                  <Link href="/community" className="overflow-hidden justify-center items-center gap-2 inline-flex group">
                    <span className="text-scheme-1-text text-base font-medium leading-6 group-hover:underline">Learn More</span>
                    <ArrowRight className="w-6 h-6 text-scheme-1-text" />
                  </Link>
                </div>
              </div>
              <div className="flex-1 flex-col justify-start items-center gap-8 inline-flex">
                <div className="self-stretch flex-col justify-start items-center gap-6 flex">
                  <div className="w-12 h-12 relative">
                    <Church className="w-10 h-11 text-scheme-1-text" />
                  </div>
                  <div className="self-stretch flex-col justify-start items-start gap-6 flex">
                    <h3 className="self-stretch text-center text-scheme-1-text text-2xl font-heading font-bold leading-[33.60px]">
                      Engage in enriching programs designed for all ages and backgrounds.
                    </h3>
                    <p className="self-stretch text-center text-scheme-1-text text-base font-body leading-6">
                      Participate in our church activities that foster fellowship and spiritual growth.
                    </p>
                  </div>
                </div>
                <div className="self-stretch flex-col justify-start items-center gap-2 flex">
                  <Link href="/ministries" className="overflow-hidden justify-center items-center gap-2 inline-flex group">
                    <span className="text-scheme-1-text text-base font-medium leading-6 group-hover:underline">Sign Up</span>
                    <ArrowRight className="w-6 h-6 text-scheme-1-text" />
                  </Link>
                </div>
              </div>
              <div className="flex-1 flex-col justify-start items-center gap-8 inline-flex">
                <div className="self-stretch flex-col justify-start items-center gap-6 flex">
                  <div className="w-12 h-12 relative">
                    <BookOpen className="w-10 h-10 text-scheme-1-text" />
                  </div>
                  <div className="self-stretch flex-col justify-start items-start gap-6 flex">
                    <h3 className="self-stretch text-center text-scheme-1-text text-2xl font-heading font-bold leading-[33.60px]">
                      Explore our resources for spiritual development and community support.
                    </h3>
                    <p className="self-stretch text-center text-scheme-1-text text-base font-body leading-6">
                      Access sermons, blogs, and prayer resources to deepen your faith journey.
                    </p>
                  </div>
                </div>
                <div className="self-stretch flex-col justify-start items-center gap-2 flex">
                  <Link href="/sermons" className="overflow-hidden justify-center items-center gap-2 inline-flex group">
                    <span className="text-scheme-1-text text-base font-medium leading-6 group-hover:underline">Get Involved</span>
                    <ArrowRight className="w-6 h-6 text-scheme-1-text" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Worship Services Section */}
      <section className="self-stretch px-16 py-28 bg-scheme-1-background overflow-hidden flex-col justify-start items-center gap-20 flex relative">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{backgroundImage: "url('/sermon.png')"}}></div>
        <div className="w-full max-w-7xl flex-col justify-start items-start gap-20 flex relative z-10">
          <div className="self-stretch justify-start items-center gap-20 inline-flex">
            <div className="flex-1 flex-col justify-start items-start gap-8 inline-flex">
              <div className="self-stretch flex-col justify-start items-start gap-8 flex">
                <div className="self-stretch flex-col justify-start items-start gap-4 flex">
                  <div className="justify-start items-center inline-flex">
                    <span className="text-scheme-1-text text-base font-semibold leading-6">Worship</span>
                  </div>
                  <div className="self-stretch flex-col justify-start items-start gap-6 flex">
                    <h2 className="self-stretch text-scheme-1-text text-[48px] font-heading font-bold leading-[57.60px]">
                      Join Us for Inspiring Worship Services
                    </h2>
                    <p className="self-stretch text-scheme-1-text text-lg font-body leading-[27px]">
                      Experience uplifting worship and powerful sermons every Sunday. Connect with our community and grow in faith together.
                    </p>
                  </div>
                </div>
                <div className="self-stretch flex-col justify-start items-start gap-4 flex">
                  <div className="self-stretch py-2 justify-start items-start gap-6 inline-flex">
                    <div className="flex-1 flex-col justify-start items-start gap-4 inline-flex">
                      <h3 className="self-stretch text-scheme-1-text text-xl font-heading font-bold leading-7">
                        Upcoming Services
                      </h3>
                      <p className="self-stretch text-scheme-1-text text-base font-body leading-6">
                        Sundays at 10 AM - All are welcome to join us.
                      </p>
                    </div>
                    <div className="flex-1 flex-col justify-start items-start gap-4 inline-flex">
                      <h3 className="self-stretch text-scheme-1-text text-xl font-heading font-bold leading-7">
                        Sermon Series
                      </h3>
                      <p className="self-stretch text-scheme-1-text text-base font-body leading-6">
                        Dive deeper into faith with our current sermon series every week.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="justify-start items-center gap-6 inline-flex">
                <Button size="lg" variant="outline" asChild>
                  <Link href="/sermons">Learn More</Link>
                </Button>
                <Link href="/events" className="overflow-hidden justify-center items-center gap-2 flex group">
                  <span className="text-scheme-1-text text-base font-medium leading-6 group-hover:underline">Sign Up</span>
                  <ArrowRight className="w-6 h-6 text-scheme-1-text" />
                </Link>
              </div>
            </div>
            <div className="flex-1 relative">
              <Image 
                src="/sermon.png" 
                alt="Worship service"
                width={600} 
                height={640} 
                className="rounded-lg object-cover w-full h-[640px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Ministries Section */}
      <section className="self-stretch px-16 py-28 bg-scheme-1-background overflow-hidden flex-col justify-start items-center gap-20 flex">
        <div className="w-full max-w-7xl flex-col justify-start items-start gap-20 flex">
          <div className="self-stretch justify-start items-center gap-20 inline-flex">
            <div className="flex-1 flex-col justify-start items-start gap-8 inline-flex">
              <div className="self-stretch flex-col justify-start items-start gap-6 flex">
                <h2 className="self-stretch text-scheme-1-text text-[40px] font-heading font-bold leading-[48px]">
                  Join Our Ministries and Make a Difference in Our Community
                </h2>
                <p className="self-stretch text-scheme-1-text text-lg font-body leading-[27px]">
                  At First Baptist Church of Fenton, we believe in the power of community. Get involved with our various ministries and volunteer opportunities to serve others and grow in faith.
                </p>
              </div>
              <div className="self-stretch flex-col justify-start items-start gap-4 flex">
                <div className="self-stretch py-2 justify-start items-start gap-6 inline-flex">
                  <div className="flex-1 flex-col justify-start items-start gap-2 inline-flex">
                    <h3 className="self-stretch text-scheme-1-text text-[48px] font-heading font-bold leading-[57.60px]">
                      Volunteer
                    </h3>
                    <p className="self-stretch text-scheme-1-text text-base font-body leading-6">
                      Discover ways to serve and connect today.
                    </p>
                  </div>
                  <div className="flex-1 flex-col justify-start items-start gap-2 inline-flex">
                    <h3 className="self-stretch text-scheme-1-text text-[48px] font-heading font-bold leading-[57.60px]">
                      Ministries
                    </h3>
                    <p className="self-stretch text-scheme-1-text text-base font-body leading-6">
                      Explore our diverse ministries and join us.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 relative">
              <Image 
                src="/volunteer.png" 
                alt="Community volunteer serving food"
                width={600} 
                height={640} 
                className="rounded-lg object-cover w-full h-[640px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="self-stretch px-16 py-28 bg-scheme-1-background overflow-hidden flex-col justify-start items-center gap-20 flex">
        <div className="w-full max-w-7xl flex-col justify-start items-center gap-20 flex">
          <div className="w-full max-w-4xl flex-col justify-start items-center gap-6 flex">
            <h2 className="self-stretch text-center text-scheme-1-text text-[48px] font-heading font-bold leading-[57.60px]">
              Community Testimonials
            </h2>
            <p className="self-stretch text-center text-scheme-1-text text-lg font-body leading-[27px]">
              Hear from our church family about their experiences and faith journey.
            </p>
          </div>
          <div className="self-stretch flex-col justify-start items-start gap-8 flex">
            <div className="self-stretch justify-start items-start gap-8 inline-flex">
              <Card className="flex-1 p-8 bg-scheme-1-foreground overflow-hidden rounded-lg border-2 border-scheme-1-border flex-col justify-start items-start gap-6 inline-flex">
                <div className="flex-col justify-start items-start gap-6 flex">
                  <div className="overflow-hidden justify-start items-start gap-1 inline-flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-scheme-1-text text-scheme-1-text" />
                    ))}
                  </div>
                  <p className="w-full text-scheme-1-text text-lg font-body leading-[27px]">
                    "The community at First Baptist Church has been such a blessing to our family. The love and support we've received has strengthened our faith journey immensely."
                  </p>
                </div>
                <div className="self-stretch justify-start items-center gap-4 inline-flex">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 flex-col justify-start items-start inline-flex">
                    <span className="self-stretch text-scheme-1-text text-base font-semibold leading-6">John Doe</span>
                    <span className="self-stretch text-scheme-1-text text-base font-body leading-6">Member, Fenton</span>
                  </div>
                </div>
              </Card>
              <Card className="flex-1 p-8 bg-scheme-1-foreground overflow-hidden rounded-lg border-2 border-scheme-1-border flex-col justify-start items-start gap-6 inline-flex">
                <div className="flex-col justify-start items-start gap-6 flex">
                  <div className="overflow-hidden justify-start items-start gap-1 inline-flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-scheme-1-text text-scheme-1-text" />
                    ))}
                  </div>
                  <p className="w-full text-scheme-1-text text-lg font-body leading-[27px]">
                    "Volunteering here has given me purpose and joy. The ministry opportunities have helped me grow in my faith while serving others in our community."
                  </p>
                </div>
                <div className="self-stretch justify-start items-center gap-4 inline-flex">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 flex-col justify-start items-start inline-flex">
                    <span className="self-stretch text-scheme-1-text text-base font-semibold leading-6">Jane Smith</span>
                    <span className="self-stretch text-scheme-1-text text-base font-body leading-6">Volunteer, Fenton</span>
                  </div>
                </div>
              </Card>
              <Card className="flex-1 p-8 bg-scheme-1-foreground overflow-hidden rounded-lg border-2 border-scheme-1-border flex-col justify-start items-start gap-6 inline-flex">
                <div className="flex-col justify-start items-start gap-6 flex">
                  <div className="overflow-hidden justify-start items-start gap-1 inline-flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-scheme-1-text text-scheme-1-text" />
                    ))}
                  </div>
                  <p className="w-full text-scheme-1-text text-lg font-body leading-[27px]">
                    "The welcoming atmosphere and powerful worship services have made this our spiritual home. We're grateful to be part of this church family."
                  </p>
                </div>
                <div className="self-stretch justify-start items-center gap-4 inline-flex">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 flex-col justify-start items-start inline-flex">
                    <span className="self-stretch text-scheme-1-text text-base font-semibold leading-6">Mike Johnson</span>
                    <span className="self-stretch text-scheme-1-text text-base font-body leading-6">Member, Fenton</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="self-stretch px-16 py-28 bg-scheme-3-background overflow-hidden flex-col justify-start items-center gap-20 flex">
        <div className="w-full max-w-7xl flex-col justify-start items-start gap-20 flex">
          <div className="self-stretch justify-start items-center gap-20 inline-flex">
            <div className="flex-1 flex-col justify-start items-start gap-6 inline-flex">
              <h2 className="self-stretch text-scheme-3-text text-[40px] font-heading font-bold leading-[48px]">
                Welcome to First Baptist Church of Fenton: A Community of Faith and Love
              </h2>
              <p className="self-stretch text-scheme-3-text text-lg font-body leading-[27px]">
                At First Baptist Church of Fenton, our mission is to share the love of Christ and foster a welcoming community. We believe in empowering individuals through faith, service, and connection, guiding everyone on their spiritual journey.
              </p>
            </div>
            <div className="relative">
              <Image 
                src="/community.jpg" 
                alt="Church community gathering"
                width={595} 
                height={635} 
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="self-stretch px-16 py-28 bg-gradient-to-r from-black/50 to-black/50 overflow-hidden flex-col justify-start items-center gap-20 flex relative">
        <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: "url('/front-art.png')"}}></div>
        <div className="w-full max-w-7xl flex-col justify-start items-start gap-20 flex relative z-10">
          <div className="w-full max-w-4xl flex-col justify-start items-start gap-8 flex">
            <div className="self-stretch flex-col justify-start items-start gap-6 flex">
              <h2 className="self-stretch text-white text-[48px] font-heading font-bold leading-[57.60px]">
                Join Us This Sunday!
              </h2>
              <p className="self-stretch text-white text-lg font-body leading-[27px]">
                Experience a welcoming community and uplifting worship. Plan your visit today!
              </p>
            </div>
            <div className="justify-start items-start gap-4 inline-flex">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <Link href="/visit">Visit</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link href="/ministries">Get Involved</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="self-stretch px-16 py-28 bg-scheme-1-background overflow-hidden flex-col justify-start items-center gap-20 flex">
        <div className="w-full max-w-7xl flex-col justify-start items-start gap-20 flex">
          <div className="self-stretch justify-start items-start gap-20 inline-flex">
            <div className="flex-1 flex-col justify-start items-start gap-4 inline-flex">
              <div className="justify-start items-center inline-flex">
                <span className="text-scheme-1-text text-base font-semibold leading-6">Connect</span>
              </div>
              <div className="self-stretch flex-col justify-start items-start gap-6 flex">
                <h2 className="self-stretch text-scheme-1-text text-[48px] font-heading font-bold leading-[57.60px]">
                  Get in Touch
                </h2>
                <p className="self-stretch text-scheme-1-text text-lg font-body leading-[27px]">
                  We're here to answer your questions and help you connect with our community.
                </p>
              </div>
            </div>
            <div className="w-[500px] py-2 flex-col justify-start items-start gap-6 inline-flex">
              <div className="self-stretch justify-start items-start gap-4 inline-flex">
                <Mail className="w-6 h-6 text-scheme-1-text" />
                <div className="flex-1 flex-col justify-start items-start gap-2 inline-flex">
                  <h3 className="self-stretch text-scheme-1-text text-xl font-heading font-bold leading-7">Email</h3>
                  <a href="mailto:Pastorjbell206@gmail.com" className="self-stretch text-scheme-1-text text-base font-body underline leading-6">
                    Pastorjbell206@gmail.com
                  </a>
                </div>
              </div>
              <div className="self-stretch justify-start items-start gap-4 inline-flex">
                <Phone className="w-6 h-6 text-scheme-1-text" />
                <div className="flex-1 flex-col justify-start items-start gap-2 inline-flex">
                  <h3 className="self-stretch text-scheme-1-text text-xl font-heading font-bold leading-7">Phone</h3>
                  <a href="tel:+18106294567" className="self-stretch text-scheme-1-text text-base font-body underline leading-6">
                    (810) 629-9427
                  </a>
                </div>
              </div>
              <div className="self-stretch justify-start items-start gap-4 inline-flex">
                <MapPin className="w-6 h-6 text-scheme-1-text" />
                <div className="flex-1 flex-col justify-start items-start gap-2 inline-flex">
                  <h3 className="self-stretch text-scheme-1-text text-xl font-heading font-bold leading-7">Office</h3>
                  <p className="self-stretch text-scheme-1-text text-base font-body leading-6">
                    860 N Leroy St, Fenton MI 48430 USA
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative w-full">
            <Image 
              src="/outside-art.png" 
              alt="First Baptist Church Fenton exterior"
              width={1280} 
              height={720} 
              className="rounded-lg object-cover w-full h-[720px]"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

// Missing icon components - let's add them
function Users({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}

function Church({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m18 7 4 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9l4-2"/>
      <path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4"/>
      <path d="M18 22V5l-6-3-6 3v17"/>
      <path d="M12 7v5"/>
      <path d="M10 9h4"/>
    </svg>
  );
}
