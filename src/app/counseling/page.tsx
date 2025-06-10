"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Heart, BookOpen, Users, Mail, Calendar, Check } from "lucide-react";

export default function CounselingPage() {
  return (
    <div className="space-y-20">
      {/* Page Header */}
      <section className="text-center space-y-6 max-w-5xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-lora font-bold text-primary-foreground leading-tight">
          Fenton Biblical Counseling
        </h1>
        <p className="text-xl text-primary-foreground/90 max-w-4xl mx-auto leading-relaxed">
          A ministry of First Baptist Church of Fenton, offering hope and healing through God's Word
        </p>
        <div className="pt-6">
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg px-8 py-4 text-lg font-semibold">
            <Calendar className="mr-2 h-5 w-5" />
            Book an Appointment
          </Button>
        </div>
      </section>

      {/* Introduction & Approach Combined Section */}
      <section className="bg-accent/10 rounded-3xl p-8 md:p-12 lg:p-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            
            {/* Everyone Needs Help Sometimes */}
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  <Heart className="h-4 w-4 mr-2" />
                  Compassionate Support
                </Badge>
                <h2 className="text-3xl md:text-4xl font-lora font-bold text-primary-foreground leading-tight">
                  Everyone Needs Help Sometimes
                </h2>
                <p className="text-lg text-primary-foreground/80 leading-relaxed">
                  We understand that everyone needs help at some point in their lives. Whether you are doing well in some areas but struggling in others, we are here to lend a hand.
                </p>
                <p className="text-lg text-primary-foreground/80 leading-relaxed">
                  Our trained counselors are available to provide encouragement and guidance rooted in the Bible, helping you navigate life's challenges with hope and practical wisdom.
                </p>
              </div>
              
              {/* Contact Information Card */}
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-4 text-primary-foreground">Ready to Get Started?</h3>
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    Take the first step towards healing and growth. Our confidential counseling sessions provide a safe space for you to share and receive biblical guidance.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90">
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule Now
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Mail className="mr-2 h-4 w-4" />
                      Contact Us
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Our Biblical Counseling Approach */}
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Biblical Foundation
                </Badge>
                <h2 className="text-3xl md:text-4xl font-lora font-bold text-primary-foreground leading-tight">
                  Our Biblical Counseling Approach
                </h2>
                <p className="text-lg text-primary-foreground/80 leading-relaxed">
                  Our counseling ministry is built on three foundational pillars that guide every session and interaction.
                </p>
              </div>
              
              {/* Three Pillars */}
              <div className="space-y-6">
                <Card className="shadow-md border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <BookOpen className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Scripture-Based</h3>
                        <p className="text-sm text-muted-foreground">
                          All our counseling is grounded in the practical application of God's inerrant Word, providing timeless wisdom for modern challenges.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-md border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Heart className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Compassionate Care</h3>
                        <p className="text-sm text-muted-foreground">
                          We provide encouragement and support with understanding hearts and listening ears, creating a safe space for healing.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-md border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Trained Counselors</h3>
                        <p className="text-sm text-muted-foreground">
                          Our counselors are equipped with both professional training and biblical wisdom to guide you through life's difficulties.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Sarah Halsey Section - Enhanced */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-accent/10 rounded-3xl"></div>
        <div className="relative z-10 p-8 md:p-12 lg:p-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
              
              {/* Profile Card */}
              <div className="lg:col-span-2">
                <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    <div className="w-40 h-40 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full flex items-center justify-center mx-auto mb-8">
                      <Users className="h-20 w-20 text-accent" />
                    </div>
                    <h3 className="text-2xl font-lora font-bold mb-2">Sarah Halsey</h3>
                    <p className="text-accent text-lg font-semibold mb-6">
                      Counseling Ministry Leader
                    </p>
                    <div className="space-y-4 text-left">
                      <div className="flex items-center">
                        <BookOpen className="h-5 w-5 mr-3 text-accent flex-shrink-0" />
                        <span className="text-sm">Masters in Counseling</span>
                      </div>
                      <div className="flex items-center">
                        <Heart className="h-5 w-5 mr-3 text-accent flex-shrink-0" />
                        <span className="text-sm">20+ Years Experience</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-5 w-5 mr-3 text-accent flex-shrink-0" />
                        <span className="text-sm">Biblical Counseling Training</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Biography */}
              <div className="lg:col-span-3 space-y-8">
                <div>
                  <Badge variant="secondary" className="mb-6 text-sm px-4 py-2">
                    <Heart className="h-4 w-4 mr-2" />
                    Ministry Leader
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-lora font-bold text-primary-foreground mb-8 leading-tight">
                    Meet Sarah Halsey
                  </h2>
                </div>
                
                <div className="space-y-6 text-lg text-primary-foreground/80 leading-relaxed">
                  <p>
                    Sarah Halsey leads our counseling ministry and has over 20 years of experience in various counseling ministries. She was introduced to biblical counseling when seeking help for her own family's life struggles.
                  </p>
                  <p>
                    Through the practical application of scripture, she was able to overcome adversity and was compelled to learn how to counsel others in the same way. She obtained her Masters in Counseling and Biblical counseling training, which now form the basis of her approach to counseling.
                  </p>
                  <p>
                    Sarah is dedicated to helping others apply practical principles found in the inerrant Word of God and training new lay counselors to serve the church.
                  </p>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section - Enhanced */}
      <section className="text-center space-y-8 max-w-5xl mx-auto">
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-lora font-bold text-primary-foreground leading-tight">
            Ready to Take the Next Step?
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed">
            If you need encouragement or support, don't hesitate to reach out to our counseling ministry led by Sarah Halsey at First Baptist Church.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-2xl mx-auto">
          <Button size="lg" className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-4 text-lg font-semibold shadow-lg">
            <Calendar className="mr-2 h-5 w-5" />
            Book an Appointment
          </Button>
          <Button variant="outline" size="lg" className="flex-1 px-8 py-4 text-lg font-semibold border-2">
            <Mail className="mr-2 h-5 w-5" />
            Contact Us
          </Button>
        </div>
        
        <Card className="mt-12 p-8 bg-accent/10 border-0 shadow-lg">
          <CardContent className="p-0">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                <Heart className="h-4 w-4 text-accent" />
              </div>
              <h3 className="text-lg font-semibold">Confidential and Safe</h3>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              All counseling sessions are conducted in a safe, confidential environment where you can share openly without judgment. Your privacy and comfort are our top priorities.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
} 