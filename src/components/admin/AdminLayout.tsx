'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { 
  LayoutDashboard, 
  FileText, 
  Image, 
  Calendar,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Home,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
// User type from our Prisma User model
interface User {
  id: number;
  uuid: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'EDITOR' | 'VIEWER';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface AdminLayoutProps {
  children: React.ReactNode;
  user: User;
}

interface NavigationItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  children?: NavigationItem[];
  requiredRole?: 'ADMIN' | 'EDITOR' | 'VIEWER';
}

export function AdminLayout({ children, user }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['content']);
  const pathname = usePathname();

  const navigationItems: NavigationItem[] = [
    {
      title: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard
    },
    {
      title: 'Content Management',
      href: '/admin/content',
      icon: FileText,
      children: [
        { title: 'FAQ', href: '/admin/faq', icon: HelpCircle },
        { title: 'Homepage Slideshow', href: '/admin/home/slideshow', icon: Image },
        { title: 'Current Series', href: '/admin/home/series', icon: FileText },
        { title: 'Announcement Banner', href: '/admin/announcement', icon: FileText },
        { title: 'Donate Settings', href: '/admin/donate', icon: Settings }
      ]
    },
    {
      title: 'Blog Management',
      href: '/admin/blog',
      icon: FileText,
      children: [
        { title: 'All Posts', href: '/admin/blog', icon: FileText },
        { title: 'Write New Post', href: '/admin/blog/new', icon: FileText }
      ]
    },
    {
      title: 'People & Ministry',
      href: '/admin/people',
      icon: Users,
      children: [
        { title: 'Staff/Leadership', href: '/admin/leadership', icon: Users },
        { title: 'Ministries', href: '/admin/ministries', icon: FileText },
        { title: 'Mission Partners', href: '/admin/missions', icon: Calendar }
      ]
    },

    {
      title: 'Users',
      href: '/admin/users',
      icon: Users,
      requiredRole: 'ADMIN'
    },
    {
      title: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      requiredRole: 'ADMIN'
    }
  ];

  const helpItems = [
    { title: 'Getting Started', href: '/admin/help/getting-started' },
    { title: 'Video Tutorials', href: '/admin/help/tutorials' },
    { title: 'User Guide', href: '/admin/help/user-guide' },
    { title: 'Contact Support', href: '/admin/help/support' }
  ];

  const toggleSection = (title: string) => {
    setExpandedSections(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const isActiveLink = (href: string): boolean => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const hasPermission = (requiredRole?: 'ADMIN' | 'EDITOR' | 'VIEWER'): boolean => {
    if (!requiredRole) return true;
    
    const roleHierarchy = { ADMIN: 3, EDITOR: 2, VIEWER: 1 };
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  };

  const getUserInitials = (name: string): string => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/admin" className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">FBC</span>
          </div>
          <div>
            <h2 className="text-lg font-heading font-bold">Admin Dashboard</h2>
            <p className="text-sm text-muted-foreground">Website Manager</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => {
          if (!hasPermission(item.requiredRole)) return null;
          
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = expandedSections.includes(item.title);
          const isActive = isActiveLink(item.href);

          return (
            <div key={item.title}>
              {hasChildren ? (
                <button
                  onClick={() => toggleSection(item.title)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                    <ChevronDown 
                      className={`h-4 w-4 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`} 
                    />
                  </div>
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              )}
              
              {hasChildren && isExpanded && (
                <div className="ml-6 mt-2 space-y-1">
                  {item.children?.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                        isActiveLink(child.href)
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <child.icon className="h-4 w-4" />
                      <span>{child.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Help Section */}
      <div className="p-4 border-t border-gray-200">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start">
              <HelpCircle className="h-5 w-5 mr-3" />
              Help & Support
              <ChevronDown className="h-4 w-4 ml-auto" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {helpItems.map((item) => (
              <DropdownMenuItem key={item.href} asChild>
                <Link href={item.href}>{item.title}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start p-2">
              <Avatar className="h-8 w-8 mr-3">
                <AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </div>
              <ChevronDown className="h-4 w-4 ml-auto" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/admin/profile">
                <Users className="h-4 w-4 mr-2" />
                Profile Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/" target="_blank">
                <Eye className="h-4 w-4 mr-2" />
                View Website
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-80 bg-white border-r border-gray-200">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/20" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-80 bg-white border-r border-gray-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Admin Dashboard</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
