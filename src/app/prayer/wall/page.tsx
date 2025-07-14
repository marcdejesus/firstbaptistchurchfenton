"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageLayout } from '@/components/layout/PageLayout';
import { Badge } from '@/components/ui/badge';
import { Heart, Search, Filter, Calendar, User, Plus, Loader2, CheckCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { prayerRequestsService, type PrayerRequest } from '@/lib/firestore/prayers';
import { useUser } from '@/contexts/UserContext';
import Link from 'next/link';

interface PrayerCardProps {
  request: PrayerRequest;
  onPrayerClick: (requestId: string) => Promise<void>;
  isPraying: boolean;
}

const PrayerCard: React.FC<PrayerCardProps> = ({ request, onPrayerClick, isPraying }) => {
  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'healing': return 'bg-green-100 text-green-800 border-green-200';
      case 'guidance': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'thanksgiving': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'protection': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="font-heading text-lg mb-2">{request.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Calendar className="h-4 w-4" />
              {formatDate(request.createdAt)}
              {!request.isAnonymous && request.submitterName && (
                <>
                  <User className="h-4 w-4 ml-2" />
                  {request.submitterName}
                </>
              )}
              {request.isAnonymous && (
                <>
                  <User className="h-4 w-4 ml-2" />
                  Anonymous
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Badge className={getCategoryColor(request.category)}>
              {request.category}
            </Badge>
            {request.urgency !== 'medium' && (
              <Badge className={getUrgencyColor(request.urgency)}>
                {request.urgency} priority
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <CardDescription className="flex-1 mb-4 text-sm">
          {request.content}
        </CardDescription>
        
        {request.status === 'answered' && request.answerDescription && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-semibold text-green-800">Prayer Answered!</span>
            </div>
            <p className="text-sm text-green-700">{request.answerDescription}</p>
            {request.answeredAt && (
              <p className="text-xs text-green-600 mt-1">
                Answered on {formatDate(request.answeredAt)}
              </p>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Heart className="h-4 w-4" />
            <span>{request.prayerCount} {request.prayerCount === 1 ? 'prayer' : 'prayers'}</span>
          </div>
          <Button 
            size="sm" 
            onClick={() => onPrayerClick(request.id)}
            disabled={isPraying}
          >
            {isPraying ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Heart className="h-4 w-4 mr-2" />
            )}
            Pray
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function PrayerWallPage() {
  const [requests, setRequests] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [filteredRequests, setFilteredRequests] = useState<PrayerRequest[]>([]);
  const [prayingFor, setPrayingFor] = useState<Record<string, boolean>>({});

  const { user } = useUser();

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Prayer Requests", href: "/prayer" },
    { label: "Prayer Wall" },
  ];

  useEffect(() => {
    const loadPrayerRequests = async () => {
      try {
        const publicRequests = await prayerRequestsService.getPublicPrayerRequests();
        setRequests(publicRequests);
        setFilteredRequests(publicRequests);
      } catch (error) {
        console.error('Error loading prayer requests:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPrayerRequests();
  }, []);

  useEffect(() => {
    let filtered = requests;

    // Apply search filter
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(request =>
        request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(request => request.category === categoryFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    setFilteredRequests(filtered);
  }, [searchTerm, categoryFilter, statusFilter, requests]);

  const handlePrayerClick = async (requestId: string) => {
    setPrayingFor(prev => ({ ...prev, [requestId]: true }));

    try {
      await prayerRequestsService.incrementPrayerCount(requestId);
      
      // Update local state
      setRequests(prev => prev.map(request => 
        request.id === requestId 
          ? { ...request, prayerCount: request.prayerCount + 1 }
          : request
      ));
    } catch (error) {
      console.error('Error recording prayer:', error);
    } finally {
      setPrayingFor(prev => ({ ...prev, [requestId]: false }));
    }
  };

  if (loading) {
    return (
      <PageLayout
        title="Prayer Wall"
        subtitle="Join our community in prayer for these requests."
        breadcrumbs={breadcrumbs}
      >
        <div className="flex justify-center items-center min-h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Prayer Wall"
      subtitle="Join our community in prayer for these requests."
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-8">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1">
            <p className="text-muted-foreground">
              {filteredRequests.length} prayer request{filteredRequests.length !== 1 ? 's' : ''} shared by our community
            </p>
          </div>
          <Button asChild>
            <Link href="/prayer">
              <Plus className="h-4 w-4 mr-2" />
              Submit Prayer Request
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search prayer requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="healing">Healing</SelectItem>
              <SelectItem value="guidance">Guidance</SelectItem>
              <SelectItem value="thanksgiving">Thanksgiving</SelectItem>
              <SelectItem value="protection">Protection</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Requests" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Requests</SelectItem>
              <SelectItem value="approved">Active</SelectItem>
              <SelectItem value="answered">Answered</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        {filteredRequests.length === 0 && searchTerm.trim() !== '' ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-heading font-semibold mb-2">No prayer requests found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
                setStatusFilter('all');
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-heading font-semibold mb-2">No Prayer Requests</h3>
            <p className="text-muted-foreground mb-4">
              No public prayer requests have been shared yet.
            </p>
            <Button asChild>
              <Link href="/prayer">
                Be the first to share a prayer request
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {(searchTerm.trim() !== '' || categoryFilter !== 'all' || statusFilter !== 'all') && (
              <div className="text-sm text-muted-foreground">
                Showing {filteredRequests.length} of {requests.length} prayer request{requests.length !== 1 ? 's' : ''}
              </div>
            )}

            {/* Prayer Requests Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredRequests.map((request) => (
                <PrayerCard
                  key={request.id}
                  request={request}
                  onPrayerClick={handlePrayerClick}
                  isPraying={prayingFor[request.id] || false}
                />
              ))}
            </div>
          </>
        )}

        {/* Info Card */}
        <Card className="bg-muted/30">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <Heart className="h-8 w-8 text-primary mx-auto" />
              <h3 className="font-heading font-semibold">How to Use the Prayer Wall</h3>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                Click the "Pray" button to let the community know you're praying for a request. 
                Your prayers are anonymous but help encourage others and show God's love in action.
              </p>
              {!user && (
                <p className="text-sm text-muted-foreground">
                  <Link href="/login" className="text-primary hover:underline">Sign in</Link> to submit your own prayer requests and join our community of prayer.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}