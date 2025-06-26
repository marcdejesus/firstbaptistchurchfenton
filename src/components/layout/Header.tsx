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
    UserCircle, LogOut, Menu as MenuIcon, Search, HandCoins, X
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import React from 'react';
import { cn } from '@/lib/utils';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { ScrollArea } from '@/components/ui/scroll-area';
import { navigationCategories, MegaMenuDropdown, MegaMenuTrigger, userNavigation } from './MegaMenu';
import { SearchBar, MobileSearch } from './SearchBar';

// Enhanced mobile navigation structure for the new mega-menu system
const enhancedMobileNavItems = [
  ...navigationCategories,
  {
    id: "give",
    label: "Give",
    href: "/donate",
    icon: HandCoins,
    featured: true
  }
];

export function Header() {
  const { user, logout } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [openMegaMenu, setOpenMegaMenu] = React.useState<string | null>(null);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Set initial state

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close mega menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setOpenMegaMenu(null);
    };

    if (openMegaMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openMegaMenu]);

  const handleMegaMenuToggle = (categoryId: string) => {
    setOpenMegaMenu(openMegaMenu === categoryId ? null : categoryId);
  };

  const handleSearch = (query: string) => {
    // TODO: Implement search functionality
    console.log('Search query:', query);
    // Redirect to search results page
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
  };

  return (
    <header className={cn(
      "header",
      isScrolled && "scrolled"
    )}>
      <div className="header-container">
        <Link href="/" className="header-logo">
          <Image
            src="/logo.svg"
            alt="First Baptist Church of Fenton Logo"
            width={56}
            height={56}
            className="h-14 w-14"
          />
          <div className="header-logo-text">
            <span className="header-logo-primary">First Baptist</span>
            <span className="header-logo-secondary">Church of Fenton</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {/* Mega Menu Navigation */}
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
          
          {/* Give Button (Featured) */}
          <Button asChild variant="default" className="bg-accent hover:bg-accent-600 ml-4">
            <Link href="/donate">
              <HandCoins className="mr-2 h-4 w-4" />
              Give
            </Link>
          </Button>

          {/* Search Bar */}
          <div className="ml-4">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search..."
              className="w-64"
            />
          </div>

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full ml-2">
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
            <div className="flex items-center space-x-2 ml-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex items-center space-x-2">
          {/* Mobile Search Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={cn(isSearchOpen && "bg-accent/10")}
          >
            {isSearchOpen ? (
              <X className="h-5 w-5 text-primary-foreground" />
            ) : (
              <Search className="h-5 w-5 text-primary-foreground" />
            )}
            <span className="sr-only">Toggle search</span>
          </Button>

          {/* Mobile Menu Toggle */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <MenuIcon className="h-6 w-6 text-primary-foreground" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] bg-background p-0 flex flex-col">
              <SheetHeader className="p-6 pb-0">
                <SheetTitle>
                  <VisuallyHidden>Mobile Navigation</VisuallyHidden>
                  <div className="flex items-center space-x-3">
                    <Image
                      src="/logo.svg"
                      alt="FBC Logo"
                      width={32}
                      height={32}
                      className="h-8 w-8"
                    />
                    <span className="font-lora font-semibold">FBC Fenton</span>
                  </div>
                </SheetTitle>
              </SheetHeader>

              <ScrollArea className="flex-grow px-6">
                <nav className="flex flex-col space-y-2 py-4">
                  {/* Enhanced Mobile Navigation */}
                  {enhancedMobileNavItems.map((item) => (
                    <React.Fragment key={item.id}>
                      {'href' in item && item.href ? (
                        <Button 
                          asChild 
                          variant={item.featured ? "default" : "ghost"} 
                          className={cn(
                            "justify-start text-foreground",
                            item.featured && "bg-accent hover:bg-accent-600"
                          )}
                        >
                          <Link href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                            <item.icon className="mr-3 h-5 w-5" />
                            {item.label}
                          </Link>
                        </Button>
                      ) : (
                        <>
                          <div className="flex items-center space-x-2 px-4 py-2 mt-4 first:mt-0">
                            <item.icon className="h-5 w-5 text-accent" />
                            <h4 className="font-semibold text-foreground">{item.label}</h4>
                          </div>
                          <div className="flex flex-col space-y-1 ml-4">
                            {'items' in item && item.items?.map((link) => (
                              <Button 
                                key={link.href} 
                                asChild 
                                variant="ghost" 
                                className="justify-start text-foreground h-auto py-2"
                              >
                                <Link href={link.href} onClick={() => setIsMobileMenuOpen(false)}>
                                  <link.icon className="mr-3 h-4 w-4" />
                                  <div>
                                    <div className="font-medium">{link.title}</div>
                                    <div className="text-xs text-muted-foreground">{link.description}</div>
                                  </div>
                                </Link>
                              </Button>
                            ))}
                          </div>
                        </>
                      )}
                    </React.Fragment>
                  ))}
                </nav>
              </ScrollArea>

              {/* Mobile User Section */}
              <div className="border-t border-border p-6">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatarUrl || `https://placehold.co/100x100.png`} alt={user.name} />
                        <AvatarFallback>{user.name.substring(0, 1).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" asChild className="flex-1">
                        <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                          <UserCircle className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                        className="flex-1"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <Button variant="outline" asChild className="flex-1">
                      <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                    </Button>
                    <Button asChild className="flex-1">
                      <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile Search */}
      <MobileSearch 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearch={handleSearch}
      />
    </header>
  );
}
