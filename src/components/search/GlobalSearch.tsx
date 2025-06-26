"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  X, 
  Calendar, 
  FileText, 
  Users, 
  MapPin,
  Clock,
  ArrowRight,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  type: 'blog' | 'event' | 'page' | 'ministry';
  url: string;
  date?: string;
  category?: string;
  location?: string;
}

// Mock search data - in real app, this would come from API
const mockSearchData: SearchResult[] = [
  {
    id: '1',
    title: 'The True Heart of Worship',
    excerpt: 'What does it truly mean to worship God? Is it just singing songs on a Sunday, or is there something more?',
    type: 'blog',
    url: '/blog/the-heart-of-worship',
    date: 'December 20, 2024',
    category: 'Spiritual Growth'
  },
  {
    id: '2',
    title: 'Christmas Eve Service',
    excerpt: 'Join us for our special Christmas Eve candlelight service as we celebrate the birth of our Savior.',
    type: 'event',
    url: '/events/christmas-eve-service',
    date: 'December 24, 2024',
    location: 'Main Sanctuary'
  },
  {
    id: '3',
    title: 'Youth Ministry',
    excerpt: 'Our youth ministry serves students in grades 6-12 with engaging programs and biblical teaching.',
    type: 'ministry',
    url: '/ministries/youth',
    category: 'Youth'
  },
  {
    id: '4',
    title: 'Plan Your Visit',
    excerpt: 'Everything you need to know for your first visit to First Baptist Church Fenton.',
    type: 'page',
    url: '/visit'
  },
  {
    id: '5',
    title: 'Finding Community in Our Church Family',
    excerpt: 'It can be easy to feel lost in a crowd. Here are three practical ways to get connected.',
    type: 'blog',
    url: '/blog/finding-community-in-a-big-church',
    date: 'December 15, 2024',
    category: 'Community'
  },
  {
    id: '6',
    title: 'Sunday Morning Service',
    excerpt: 'Join us every Sunday at 10:00 AM for worship, teaching, and fellowship.',
    type: 'event',
    url: '/events/sunday-service',
    date: 'Every Sunday',
    location: 'Main Sanctuary'
  }
];

const typeIcons = {
  blog: FileText,
  event: Calendar,
  page: Users,
  ministry: Users
};

const typeColors = {
  blog: 'bg-emerald-100 text-emerald-700',
  event: 'bg-blue-100 text-blue-700',
  page: 'bg-purple-100 text-purple-700',
  ministry: 'bg-orange-100 text-orange-700'
};

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');

  // Filter and search results
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    setIsSearching(true);
    
    // Simulate API delay
    setTimeout(() => setIsSearching(false), 300);

    const filtered = mockSearchData.filter(item => {
      const matchesQuery = 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(query.toLowerCase()) ||
        item.category?.toLowerCase().includes(query.toLowerCase());
      
      const matchesType = selectedType === 'all' || item.type === selectedType;
      
      return matchesQuery && matchesType;
    });

    return filtered;
  }, [query, selectedType]);

  // Clear search when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setSelectedType('all');
    }
  }, [isOpen]);

  const handleResultClick = (url: string) => {
    onClose();
    // Navigation would happen automatically through Link component
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2 text-accent" />
            Search Our Site
          </DialogTitle>
        </DialogHeader>
        
        <div className="px-6">
          {/* Search Input */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search for articles, events, pages..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-10 h-12 text-lg"
              autoFocus
            />
            {query && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuery('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 mb-4">
            {[
              { id: 'all', label: 'All Results' },
              { id: 'blog', label: 'Articles' },
              { id: 'event', label: 'Events' },
              { id: 'page', label: 'Pages' },
              { id: 'ministry', label: 'Ministries' }
            ].map(type => (
              <Button
                key={type.id}
                variant={selectedType === type.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type.id)}
                className={selectedType === type.id ? "bg-accent hover:bg-accent-600" : ""}
              >
                {type.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Search Results */}
        <div className="px-6 pb-6 max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-accent mr-2" />
              <span className="text-muted-foreground">Searching...</span>
            </div>
          ) : query && searchResults.length === 0 ? (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or browse our content directly.
              </p>
            </div>
          ) : query && searchResults.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                </span>
              </div>
              
              {searchResults.map((result) => {
                const Icon = typeIcons[result.type];
                return (
                  <Link
                    key={result.id}
                    href={result.url}
                    onClick={() => handleResultClick(result.url)}
                  >
                    <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-accent">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Icon className="h-4 w-4 text-accent" />
                            <Badge className={typeColors[result.type]}>
                              {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                            </Badge>
                            {result.category && (
                              <Badge variant="outline" className="text-xs">
                                {result.category}
                              </Badge>
                            )}
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                        
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-accent transition-colors">
                          {result.title}
                        </h3>
                        
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                          {result.excerpt}
                        </p>
                        
                        <div className="flex items-center text-xs text-muted-foreground space-x-4">
                          {result.date && (
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {result.date}
                            </div>
                          )}
                          {result.location && (
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {result.location}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Search Our Content</h3>
              <p className="text-muted-foreground mb-4">
                Find articles, events, ministries, and more across our website.
              </p>
              <div className="text-sm text-muted-foreground">
                <p>Popular searches:</p>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {['worship', 'youth', 'community', 'service times', 'contact'].map(term => (
                    <Button
                      key={term}
                      variant="outline"
                      size="sm"
                      onClick={() => setQuery(term)}
                      className="text-xs"
                    >
                      {term}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Compact search trigger component for header
export function SearchTrigger({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="w-64 justify-start text-muted-foreground hover:border-accent"
    >
      <Search className="h-4 w-4 mr-2" />
      <span>Search...</span>
      <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
        <span className="text-xs">⌘</span>K
      </kbd>
    </Button>
  );
} 