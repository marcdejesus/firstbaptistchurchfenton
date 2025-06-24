"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { 
    Home, CalendarDays, Users, DollarSign, UserCircle, LogOut, Menu as MenuIcon, 
    Church, Book, Calendar, BookOpen, Heart, Mail, Landmark, Users2, History, 
    Rss, MonitorPlay, HandCoins, StepForward, PersonStanding, HelpCircle, HandHelping, MessageSquare
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import React from 'react';
import { cn } from '@/lib/utils';

const aboutItems = [
    { href: '/about/beliefs', title: 'Our Beliefs', icon: Landmark },
    { href: '/about/history', title: 'Our History', icon: History },
    { href: '/about/staff', title: 'Pastors & Staff', icon: Users2 },
    { href: '/faq', title: 'FAQ', icon: HelpCircle },
]

const connectItems = [
    { href: '/community', title: 'Community', icon: Users },
    { href: '/ministries', title: 'Ministries', icon: Heart },
    { href: '/events', title: 'Events', icon: Calendar },
    { href: '/volunteer', title: 'Volunteer', icon: HandHelping },
    { href: '/prayer', title: 'Prayer', icon: MessageSquare },
    { href: '/contact', title: 'Contact', icon: Mail },
]

const watchListenItems = [
    { href: '/sermons', title: 'Sermons', icon: MonitorPlay },
    { href: '/blog', title: 'Blog', icon: Rss },
]

const navItems = [
  { href: '/donate', label: 'Give', icon: HandCoins },
  { href: '/next-steps', label: 'Next Steps', icon: StepForward },
  { href: '/visit', label: 'Visit', icon: PersonStanding }
];

export function Header() {
  const { user, logout } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const commonNavElements = (
    <>
      {/* About Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">About</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {aboutItems.map((item) => (
            <DropdownMenuItem key={item.title} asChild>
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Connect Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">Connect</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {connectItems.map((item) => (
            <DropdownMenuItem key={item.title} asChild>
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Watch/Listen Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">Watch/Listen</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {watchListenItems.map((item) => (
            <DropdownMenuItem key={item.title} asChild>
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Other Nav Items */}
      {navItems.map((link) => (
        <Button key={link.label} variant="ghost" asChild>
          <Link href={link.href}>{link.label}</Link>
        </Button>
      ))}
    </>
  );

  return (
    <header className="bg-primary/50 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 text-primary-foreground hover:text-accent transition-colors">
          <Image
            src="/logo.svg"
            alt="First Baptist Church of Fenton Logo"
            width={56}
            height={56}
            className="h-14 w-14 text-accent"
          />
          <div className="flex flex-col font-lora leading-none">
            <span className="text-xl font-semibold">First Baptist</span>
            <span className="text-sm font-normal">Church of Fenton</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          {commonNavElements}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatarUrl || `https://placehold.co/100x100.png`} alt={user.name} data-ai-hint="user avatar" />
                    <AvatarFallback>{user.name.substring(0, 1).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                    <Link href="/profile"><UserCircle className="mr-2 h-4 w-4" />Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                    </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
                <Link href="/login">Login</Link>
            </Button>
          )}
        </nav>

        {/* Mobile Navigation Trigger */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <MenuIcon className="h-6 w-6 text-primary-foreground" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-background p-6">
              <nav className="flex flex-col space-y-3">
                {/* TODO: Refactor mobile nav to use dropdowns */}
                {navItems.map((link) => (
                    <Button key={link.label} variant="ghost" asChild className="justify-start text-foreground">
                        <Link href={link.href} onClick={() => setIsMobileMenuOpen(false)}>
                            <link.icon className="mr-2 h-5 w-5" />
                            {link.label}
                        </Link>
                    </Button>
                ))}
                <hr className="my-3 border-border" />
                {user ? (
                  <>
                    <Button variant="ghost" asChild className="justify-start text-foreground">
                      <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}><UserCircle className="mr-2 h-5 w-5" />Profile</Link>
                    </Button>
                    <Button variant="ghost" onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="justify-start text-foreground">
                      <LogOut className="mr-2 h-5 w-5" />Log out
                    </Button>
                  </>
                ) : (
                    <Button asChild className="w-full">
                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                    </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
