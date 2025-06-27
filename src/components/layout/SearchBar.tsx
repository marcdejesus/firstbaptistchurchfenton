"use client";

import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export function SearchBar({ onSearch, placeholder = "Search...", className, autoFocus }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && onSearch) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoFocus={autoFocus}
          className={cn(
            "pl-10 pr-10 transition-all duration-200",
            isFocused && "ring-2 ring-accent/20"
          )}
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    </form>
  );
}

interface MobileSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch?: (query: string) => void;
}

export function MobileSearch({ isOpen, onClose, onSearch }: MobileSearchProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Focus the input when opened
      const input = document.getElementById('mobile-search-input');
      if (input) {
        setTimeout(() => input.focus(), 100);
      }
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && onSearch) {
      onSearch(query.trim());
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-white border-t border-border p-4">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id="mobile-search-input"
          type="text"
          placeholder="Search sermons, articles, events..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-16"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute right-1 top-1/2 transform -translate-y-1/2"
        >
          Cancel
        </Button>
      </form>
    </div>
  );
} 