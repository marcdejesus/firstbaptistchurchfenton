"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  UserPlus, MapPin, Clock, ArrowRight, Monitor, Church, Book, History, 
  Users, HelpCircle, Mail, Heart, Calendar, HandHeart, MessageSquare, 
  Globe, BookOpen, Play, FileText, Images, UserCircle, LogIn, Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

// Enhanced navigation structure based on the design system
export const navigationCategories = [
  {
    id: "im-new",
    label: "I'm New",
    icon: UserPlus,
    description: "For first-time visitors and newcomers to FBC",
    items: [
      {
        title: "Plan Your Visit",
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
        title: "Next Steps",
        href: "/next-steps",
        description: "Your journey of faith starts here",
        icon: ArrowRight
      },
      {
        title: "Watch Online",
        href: "/sermons/live",
        description: "Join our live stream or watch past services",
        icon: Monitor
      }
    ]
  },
  {
    id: "about",
    label: "About Us",
    icon: Church,
    description: "Learn about our church, beliefs, and team",
    items: [
      {
        title: "Our Beliefs",
        href: "/about/beliefs",
        description: "What we believe and why it matters",
        icon: Book
      },
      {
        title: "Our History",
        href: "/about/history", 
        description: "Our story and heritage in Fenton",
        icon: History
      },
      {
        title: "Leadership Team",
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
        title: "Contact Us",
        href: "/contact",
        description: "Get in touch with us",
        icon: Mail
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
        title: "Community",
        href: "/community",
        description: "Connect with our church family",
        icon: Users
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
        title: "Missions",
        href: "/missions",
        description: "Local and global mission opportunities",
        icon: Globe
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
        title: "Sermons",
        href: "/sermons",
        description: "Watch or listen to past messages",
        icon: Play
      },
      {
        title: "Blog Articles",
        href: "/blog",
        description: "Spiritual insights and church updates",
        icon: FileText
      },
      {
        title: "Photo Gallery",
        href: "/gallery",
        description: "Memories from our community",
        icon: Images
      },
      {
        title: "Book Appointment",
        href: "/book-appointment",
        description: "Schedule time with our pastoral team",
        icon: Calendar
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
  unauthenticated: [
    {
      title: "Login",
      href: "/login",
      icon: LogIn
    },
    {
      title: "Register",
      href: "/register",
      icon: UserPlus
    }
  ]
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