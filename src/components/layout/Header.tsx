"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Home, CalendarDays, Users, DollarSign, UserCircle, LogOut, Menu as MenuIcon, Church, Book, Calendar, BookOpen, Heart } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import React from 'react';

const navItems = [
  { href: '/events', label: 'Events', icon: Calendar },
  { href: '/sermons', label: 'Sermons', icon: BookOpen },
  { href: '/ministries', label: 'Ministries', icon: Heart },
  { href: '/counseling', label: 'Counseling', icon: Users },
  { href: '/donate', label: 'Donate', icon: DollarSign }
];

const FBCLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="0" y="0" width="22" height="22" rx="3" fill="#707C87"/> {/* Top-left grey */}
    <rect x="26" y="0" width="34" height="22" rx="3" fill="#707C87"/> {/* Top-right grey */}
    <rect x="0" y="26" width="22" height="34" rx="3" fill="#707C87"/> {/* Bottom-left grey */}
    <rect x="26" y="26" width="34" height="22" rx="3" fill="currentColor"/> {/* Bottom-right orange, inherits from text-accent class */}
  </svg>
);

export function Header() {
  const { user, logout } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const commonNavElements = (
    <>
      {navItems.map((link) => (
        <Button key={link.label} variant="ghost" asChild className="text-foreground hover:bg-accent/20 hover:text-accent">
          <Link href={link.href} onClick={() => setIsMobileMenuOpen(false)}>
            <link.icon className="mr-2 h-5 w-5" />
            {link.label}
          </Link>
        </Button>
      ))}
    </>
  );

  return (
    <header className="bg-primary/50 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 text-xl font-lora font-semibold text-primary-foreground hover:text-accent transition-colors">
          <FBCLogo className="h-8 w-8 text-accent" />
          <span>First Baptist Church of Fenton</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          {commonNavElements}
          {user && (
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
                <DropdownMenuItem asChild>
                  <Link href="/profile"><UserCircle className="mr-2 h-4 w-4" />Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                {commonNavElements}
                <hr className="my-3 border-border" />
                {user && (
                  <>
                    <Button variant="ghost" asChild className="justify-start text-foreground">
                      <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}><UserCircle className="mr-2 h-5 w-5" />Profile</Link>
                    </Button>
                    <Button variant="ghost" onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="justify-start text-foreground">
                      <LogOut className="mr-2 h-5 w-5" />Log out
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
