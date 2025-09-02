"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  UserPlus, MapPin, Clock, ArrowRight, Monitor, Church, Book, History, 
  Users, HelpCircle, Mail, Heart, Calendar, HandHeart, MessageSquare, 
  Globe, BookOpen, Play, FileText, UserCircle, Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

// Enhanced navigation structure based on the design system
export const navigationCategories = [
  {
    id: "new-here",
    label: "New Here?",
    icon: UserPlus,
    description: "For first-time visitors and newcomers to FBC",
    items: [
      {
        title: "Visit",
        href: "/visit",
        description: "Everything you need to know for your first visit",
        icon: MapPin
      },
      {
        title: "What to Expect",
        href: "/visit/what-to-expect",
        description: "Service times, dress code, and what happens during service",
        icon: Clock
      },
      {
        title: "Watch Online",
        href: "/sermons",
        description: "Watch our latest sermon or browse the archives",
        icon: Monitor
      },
      {
        title: "Next-steps",
        href: "/next-steps",
        description: "Take your next steps in faith and community",
        icon: ArrowRight
      },
      {
        title: "Beliefs",
        href: "/about/beliefs",
        description: "What we believe and why it matters",
        icon: Book
      },
      {
        title: "FAQ",
        href: "/faq",
        description: "Frequently asked questions",
        icon: HelpCircle
      }
    ]
  },
  {
    id: "about",
    label: "About",
    icon: Church,
    description: "Learn about our church, beliefs, and team",
    items: [
      {
        title: "Beliefs",
        href: "/about/beliefs",
        description: "What we believe and why it matters",
        icon: Book
      },
      {
        title: "History",
        href: "/about/history", 
        description: "Our story and heritage in Fenton",
        icon: History
      },
      {
        title: "Leadership",
        href: "/about/staff",
        description: "Meet our pastors and staff",
        icon: Users
      },
      {
        title: "FAQ",
        href: "/faq",
        description: "Frequently asked questions",
        icon: HelpCircle
      },
      {
        title: "Contact",
        href: "/contact",
        description: "Get in touch with us",
        icon: Mail
      },
      {
        title: "Missions",
        href: "/missions",
        description: "Local and global mission opportunities",
        icon: Globe
      }
    ]
  },
  {
    id: "connect",
    label: "Connect",
    icon: Users,
    description: "Join our community and get involved",
    items: [
      {
        title: "Ministries",
        href: "/ministries",
        description: "Find your place to serve and grow",
        icon: Heart
      },
      {
        title: "Events",
        href: "/events",
        description: "Upcoming church events and activities",
        icon: Calendar
      },
      {
        title: "Book an Appointment",
        href: "/book-appointment",
        description: "Schedule time with our pastoral team",
        icon: UserCircle
      },
      {
        title: "Volunteer",
        href: "/volunteer",
        description: "Use your gifts to serve others",
        icon: HandHeart
      },
      {
        title: "Prayer Requests",
        href: "/prayer",
        description: "Share your prayer needs with us",
        icon: MessageSquare
      },
      {
        title: "Blog",
        href: "/blog",
        description: "Spiritual insights and church updates",
        icon: FileText
      }
    ]
  },
  {
    id: "resources",
    label: "Resources",
    icon: BookOpen,
    description: "Spiritual growth and learning materials",
    items: [
      {
        title: "Blog",
        href: "/blog",
        description: "Spiritual insights and church updates",
        icon: FileText
      },
      {
        title: "Sermons",
        href: "/sermons",
        description: "Watch or listen to past messages",
        icon: Play
      },
      {
        title: "Book an Appointment",
        href: "/book-appointment",
        description: "Schedule time with our pastoral team",
        icon: UserCircle
      },
      {
        title: "Events",
        href: "/events",
        description: "Upcoming church events and activities",
        icon: Calendar
      },
      {
        title: "Contact",
        href: "/contact",
        description: "Get in touch with us",
        icon: Mail
      },
      {
        title: "Donate",
        href: "/donate",
        description: "Support our ministry and mission",
        icon: Heart
      }
    ]
  }
];

// User navigation items
export const userNavigation = {
  authenticated: [
    {
      title: "Profile",
      href: "/profile",
      icon: UserCircle
    },
    {
      title: "Admin",
      href: "/admin",
      icon: Settings,
      requiresRole: "admin"
    }
  ],
  unauthenticated: []
};

interface MegaMenuDropdownProps {
  category: typeof navigationCategories[0];
  isOpen: boolean;
  onClose: () => void;
}

export function MegaMenuDropdown({ category, isOpen, onClose }: MegaMenuDropdownProps) {
  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "absolute top-full left-1/2 -translate-x-1/2 w-[700px] max-w-[calc(100vw-32px)] bg-white/95 backdrop-blur-md shadow-lg border-t border-border z-40 rounded-lg mt-2",
        {
          "animate-in fade-in-0 zoom-in-95": isOpen,
          "animate-out fade-out-0 zoom-out-95": !isOpen,
        }
      )}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {category.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="group flex items-start space-x-4 p-4 rounded-lg hover:bg-accent/10 transition-colors duration-200"
            >
              <div className="mt-1">
                <item.icon className="h-6 w-6 text-accent group-hover:text-accent-600 transition-colors" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Category description */}
        <div className="mt-6 p-4 bg-accent/5 rounded-lg border border-accent/20">
          <div className="flex items-center space-x-2 mb-2">
            <category.icon className="h-5 w-5 text-accent" />
            <h4 className="font-semibold text-accent">{category.label}</h4>
          </div>
          <p className="text-sm text-muted-foreground">{category.description}</p>
        </div>
      </div>
    </div>
  );
}

interface MegaMenuTriggerProps {
  category: typeof navigationCategories[0];
  isOpen: boolean;
  onToggle: () => void;
}

export function MegaMenuTrigger({ category, isOpen, onToggle }: MegaMenuTriggerProps) {
  return (
    <div className="relative">
      <Button
        variant="ghost"
        className={cn(
          "transition-colors duration-200",
          isOpen && "bg-accent/10 text-accent"
        )}
        onMouseEnter={onToggle}
        onClick={onToggle}
      >
        {category.label}
      </Button>
    </div>
  );
} 