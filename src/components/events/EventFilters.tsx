"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { 
  Search, 
  Filter, 
  Calendar as CalendarIcon, 
  Grid, 
  List,
  X,
  Heart,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { EventCategory, EventFilter } from '@/types';

interface EventFiltersProps {
  filters: EventFilter;
  categories: EventCategory[];
  onFiltersChange: (filters: EventFilter) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  showOnlyMyEvents: boolean;
  onToggleMyEvents: (show: boolean) => void;
  totalEvents: number;
  filteredEvents: number;
}

export function EventFilters({
  filters,
  categories,
  onFiltersChange,
  viewMode,
  onViewModeChange,
  showOnlyMyEvents,
  onToggleMyEvents,
  totalEvents,
  filteredEvents
}: EventFiltersProps) {

  const handleSearchChange = (value: string) => {
    onFiltersChange({
      ...filters,
      searchQuery: value || undefined
    });
  };

  const handleCategoryChange = (value: string) => {
    onFiltersChange({
      ...filters,
      category: value === 'all' ? undefined : value
    });
  };

  const handleDateRangeChange = (start?: Date, end?: Date) => {
    if (start || end) {
      onFiltersChange({
        ...filters,
        dateRange: start && end ? { start, end } : undefined
      });
    } else {
      onFiltersChange({
        ...filters,
        dateRange: undefined
      });
    }
  };

  const clearAllFilters = () => {
    onFiltersChange({});
    onToggleMyEvents(false);
  };

  const hasActiveFilters = Boolean(
    filters.searchQuery || 
    filters.category || 
    filters.dateRange || 
    showOnlyMyEvents
  );

  const exportToCalendar = () => {
    // This would export filtered events to calendar
    console.log('Exporting events to calendar...');
  };

  return (
    <div className="space-y-4">
      {/* Search and Main Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search events..."
              value={filters.searchQuery || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center border rounded-md p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className="h-8 w-8 p-0"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Export Button */}
          <Button variant="outline" size="sm" onClick={exportToCalendar}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Label htmlFor="category-select" className="text-sm font-medium">
            Category:
          </Label>
          <Select 
            value={filters.category || 'all'} 
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="w-40" id="category-select">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center gap-2">
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Range Filter */}
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">Date Range:</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !filters.dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateRange ? (
                  <>
                    {format(filters.dateRange.start, "LLL dd")} -{" "}
                    {format(filters.dateRange.end, "LLL dd")}
                  </>
                ) : (
                  <span>Pick dates</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={filters.dateRange?.start}
                selected={filters.dateRange ? {
                  from: filters.dateRange.start,
                  to: filters.dateRange.end
                } : undefined}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    handleDateRangeChange(range.from, range.to);
                  } else if (!range?.from && !range?.to) {
                    handleDateRangeChange();
                  }
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* My Events Toggle */}
        <Button
          variant={showOnlyMyEvents ? "default" : "outline"}
          size="sm"
          onClick={() => onToggleMyEvents(!showOnlyMyEvents)}
          className="gap-2"
        >
          <Heart className={cn("h-4 w-4", showOnlyMyEvents && "fill-current")} />
          My Events
        </Button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.searchQuery && (
            <Badge variant="secondary" className="gap-1">
              Search: "{filters.searchQuery}"
              <button
                onClick={() => handleSearchChange('')}
                className="hover:bg-background/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {filters.category && (
            <Badge variant="secondary" className="gap-1">
              {categories.find(c => c.id === filters.category)?.icon}{' '}
              {categories.find(c => c.id === filters.category)?.name}
              <button
                onClick={() => handleCategoryChange('all')}
                className="hover:bg-background/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {filters.dateRange && (
            <Badge variant="secondary" className="gap-1">
              {format(filters.dateRange.start, "MMM dd")} - {format(filters.dateRange.end, "MMM dd")}
              <button
                onClick={() => handleDateRangeChange()}
                className="hover:bg-background/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {showOnlyMyEvents && (
            <Badge variant="secondary" className="gap-1">
              <Heart className="h-3 w-3 fill-current" />
              My Events
              <button
                onClick={() => onToggleMyEvents(false)}
                className="hover:bg-background/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Results Summary */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredEvents} of {totalEvents} events
        {hasActiveFilters && ' (filtered)'}
      </div>
    </div>
  );
} 