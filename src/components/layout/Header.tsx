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
    UserCircle, LogOut, Menu as MenuIcon, Search, HandCoins, X, LucideProps
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import React from 'react';
import { cn } from '@/lib/utils';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { ScrollArea } from '@/components/ui/scroll-area';
import { navigationCategories, MegaMenuDropdown, MegaMenuTrigger, userNavigation } from './MegaMenu';
import { SearchBar } from './SearchBar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Breadcrumbs, BreadcrumbItem } from '../ui/breadcrumbs';

// Type definitions for navigation
type NavItem = {
  title: string;
  href: string;
  description: string;
  icon: React.ComponentType<LucideProps>;
  featured?: boolean;
};

type NavCategory = {
  id: string;
  label: string;
  icon: React.ComponentType<LucideProps>;
  description: string;
  items: NavItem[];
};

type NavLink = {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<LucideProps>;
  featured?: boolean;
};

function isNavLink(item: NavCategory | NavLink): item is NavLink {
  return 'href' in item;
}

// Enhanced mobile navigation structure for the new mega-menu system
const enhancedMobileNavItems: (NavCategory | NavLink)[] = [
  ...(navigationCategories as NavCategory[]),
  {
    id: "give",
    label: "Give",
    href: "/donate",
    icon: HandCoins,
    featured: true
  }
];

export interface HeaderProps {
  breadcrumbs?: BreadcrumbItem[];
}

export function Header({ breadcrumbs }: HeaderProps) {
  const { user, logout } = useUser();
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [openMegaMenu, setOpenMegaMenu] = React.useState<string | null>(null);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    const handleClickOutside = () => setOpenMegaMenu(null);
    if (openMegaMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openMegaMenu]);

  const handleMegaMenuToggle = (categoryId: string) => {
    setOpenMegaMenu(openMegaMenu === categoryId ? null : categoryId);
  };

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
  };

  const renderMobileNav = () => (
    <div className="lg:hidden flex items-center space-x-2">
      <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)}>
        {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
        <span className="sr-only">Toggle search</span>
      </Button>

      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[320px] bg-background p-0 flex flex-col">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="flex items-center space-x-2">
              <Image src="/logo.svg" alt="FBC Logo" width={32} height={32} />
              <span className="font-heading font-semibold text-lg">FBC Fenton</span>
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className="flex-grow">
            <nav className="flex flex-col p-4 space-y-1">
              {enhancedMobileNavItems.map((item) => {
                if (isNavLink(item)) {
                  return (
                    <Button
                      key={item.id}
                      asChild
                      variant={item.featured ? "default" : "ghost"}
                      className="justify-start text-base"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link href={item.href}>
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.label}
                      </Link>
                    </Button>
                  );
                } else {
                  return (
                    <div className="pt-2" key={item.id}>
                      <p className="px-4 text-sm font-semibold text-muted-foreground">{item.label}</p>
                      <div className="mt-1 space-y-1">
                        {item.items.map((subItem) => (
                          <Button
                            key={subItem.href}
                            asChild
                            variant="ghost"
                            className="justify-start w-full text-base font-normal"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Link href={subItem.href}>
                               <span className="ml-8">{subItem.title}</span>
                            </Link>
                          </Button>
                        ))}
                      </div>
                    </div>
                  );
                }
              })}
            </nav>
          </ScrollArea>
           {user ? (
            <div className="p-4 border-t">
               <div className="flex items-center mb-4">
                 <Avatar className="h-10 w-10 mr-3">
                   <AvatarImage src={user.avatarUrl || `https://placehold.co/100x100.png`} alt={user.name} />
                   <AvatarFallback>{user.name.substring(0, 1).toUpperCase()}</AvatarFallback>
                 </Avatar>
                 <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                 </div>
               </div>
               <div className="space-y-1">
                {userNavigation.authenticated.map((item) => (
                    <Button key={item.href} asChild variant="ghost" className="justify-start w-full" onClick={() => setIsMobileMenuOpen(false)}>
                      <Link href={item.href}>
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.title}
                      </Link>
                    </Button>
                ))}
               </div>
               <Button variant="outline" className="w-full mt-4" onClick={() => { logout(); setIsMobileMenuOpen(false); }}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
               </Button>
            </div>
          ) : (
            <div className="p-4 flex gap-2 border-t">
              <Button asChild className="flex-1" onClick={() => setIsMobileMenuOpen(false)}><Link href="/login">Login</Link></Button>
              <Button asChild variant="secondary" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}><Link href="/register">Register</Link></Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );

  const headerClasses = cn(
    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
    {
      "bg-white/80 backdrop-blur-sm shadow-md": isScrolled || isMobile,
      "bg-transparent": !isScrolled && !isMobile,
    }
  );

  return (
    <header className={headerClasses} onClick={(e) => e.stopPropagation()}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0 flex items-center space-x-8">
            <Link href="/" className="flex-shrink-0">
              <div className="flex items-center space-x-3">
                <Image src="/logo.svg" alt="FBC Fenton Logo" width={40} height={40} />
                <span className={cn(
                  "font-heading font-bold text-xl tracking-tight",
                  (isScrolled || isMobile) ? 'text-gray-900' : 'text-white'
                )}>
                  First Baptist Fenton
                </span>
              </div>
            </Link>
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationCategories.map((category) => (
                <div key={category.id} className="relative">
                  <MegaMenuTrigger
                    category={category}
                    isOpen={openMegaMenu === category.id}
                    onToggle={() => handleMegaMenuToggle(category.id)}
                  />
                  <MegaMenuDropdown
                    category={category}
                    isOpen={openMegaMenu === category.id}
                    onClose={() => setOpenMegaMenu(null)}
                  />
                </div>
              ))}
            </nav>
          </div>
          
          <div className="hidden lg:flex items-center space-x-4">
              <Button asChild variant="default" className="bg-accent hover:bg-accent-600">
                <Link href="/donate">
                  <HandCoins className="mr-2 h-4 w-4" />
                  Give
                </Link>
              </Button>
              <SearchBar 
                  onSearch={handleSearch}
                  placeholder="Search..."
                  className="w-56"
              />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatarUrl || `https://placehold.co/100x100.png`} alt={user.name} />
                      <AvatarFallback>{user.name.substring(0, 1).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {userNavigation.authenticated.map((item) => (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link href={item.href}>
                          <item.icon className="mr-2 h-4 w-4" />
                          {item.title}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-1">
                <Button variant="ghost" asChild><Link href="/login">Login</Link></Button>
                <Button asChild><Link href="/register">Register</Link></Button>
              </div>
            )}
          </div>
          
          {renderMobileNav()}
        </div>
        {isSearchOpen && isMobile && (
          <div className="py-4 px-2">
            <SearchBar onSearch={handleSearch} placeholder="Search our site..." autoFocus />
          </div>
        )}
      </div>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="bg-gray-100/50 border-t border-b border-gray-200/50">
           <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <Breadcrumbs items={breadcrumbs} />
           </div>
        </div>
      )}
    </header>
  );
}
