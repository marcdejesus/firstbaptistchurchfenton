"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Check, 
  X, 
  RefreshCw, 
  Settings, 
  AlertCircle, 
  Info,
  ExternalLink,
  Loader2,
  Users
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Event } from '@/types';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CalendarSyncProps {
  events: Event[];
}

interface CalendarInfo {
  id: string;
  name: string;
  description?: string;
  primary: boolean;
  accessRole: string;
  backgroundColor?: string;
}

interface SyncResult {
  created: number;
  updated: number;
  errors: number;
  details: Array<{ 
    eventId: string; 
    status: 'created' | 'updated' | 'error'; 
    error?: string 
  }>;
}

export function CalendarSync({ events }: CalendarSyncProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [calendars, setCalendars] = useState<CalendarInfo[]>([]);
  const [selectedCalendarId, setSelectedCalendarId] = useState<string>('primary');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    // Check if user has connected their calendar
    const googleUserEmail = document.cookie
      .split('; ')
      .find(row => row.startsWith('google_user_email='))
      ?.split('=')[1];
    
    if (googleUserEmail) {
      setIsConnected(true);
      setUserEmail(decodeURIComponent(googleUserEmail));
      await fetchCalendars();
    } else {
      setIsConnected(false);
    }
  };

  const fetchCalendars = async () => {
    try {
      const response = await fetch('/api/calendar/calendars');
      if (response.ok) {
        const data = await response.json();
        setCalendars(data.calendars);
      }
    } catch (error) {
      console.error('Failed to fetch calendars:', error);
    }
  };

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/calendar/auth');
      const { authUrl } = await response.json();
      window.location.href = authUrl;
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Google Calendar.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncAll = async () => {
    if (!isConnected || events.length === 0) return;
    
    setSyncStatus('syncing');
    setSyncProgress(0);
    setSyncResult(null);
    
    try {
      const response = await fetch('/api/calendar/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          events,
          calendarId: selectedCalendarId,
          duration: 120,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setSyncResult(data.results);
        setSyncStatus('success');
        
        toast({
          title: "Sync Complete!",
          description: `${data.results.created} events created, ${data.results.updated} updated${data.results.errors > 0 ? `, ${data.results.errors} failed` : ''}.`,
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Sync failed');
      }
    } catch (error) {
      setSyncStatus('error');
      toast({
        title: "Sync Failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
    
    setTimeout(() => {
      setSyncStatus('idle');
      setSyncProgress(0);
    }, 5000);
  };

  const handleDisconnect = () => {
    // Clear calendar-related cookies
    document.cookie = 'google_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'google_refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'google_user_email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    setIsConnected(false);
    setUserEmail('');
    setCalendars([]);
    setSyncResult(null);
    
    toast({
      title: "Calendar Disconnected",
      description: "Your Google Calendar has been disconnected.",
    });
  };

  // Simulate progress for UI feedback
  useEffect(() => {
    if (syncStatus === 'syncing') {
      const interval = setInterval(() => {
        setSyncProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 500);
      
      return () => clearInterval(interval);
    } else if (syncStatus === 'success') {
      setSyncProgress(100);
    }
  }, [syncStatus]);

  const upcomingEvents = events.filter(event => new Date(event.date) >= new Date());

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-accent" />
          Google Calendar Sync
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
            <div>
              <p className="text-sm font-medium">
                {isConnected ? 'Connected' : 'Not Connected'}
              </p>
              <p className="text-xs text-muted-foreground">
                {isConnected 
                  ? `Connected as ${userEmail}`
                  : 'Connect your Google Calendar to sync church events'
                }
              </p>
            </div>
          </div>
          <Badge variant={isConnected ? 'default' : 'secondary'}>
            {isConnected ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
            {isConnected ? 'Connected' : 'Disconnected'}
          </Badge>
        </div>

        {/* Connection Actions */}
        {!isConnected ? (
          <div className="space-y-3">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Connect Your Calendar</AlertTitle>
              <AlertDescription>
                Connect your Google Calendar to automatically sync church events. You'll be able to:
                <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
                  <li>Add events directly to your calendar</li>
                  <li>Receive automatic reminders</li>
                  <li>See events color-coded by category</li>
                  <li>Keep events updated when changes occur</li>
                </ul>
              </AlertDescription>
            </Alert>
            
            <Button 
              onClick={handleConnect}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Connect Google Calendar
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Calendar Selection */}
            {calendars.length > 1 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Sync to Calendar:</label>
                <Select value={selectedCalendarId} onValueChange={setSelectedCalendarId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a calendar" />
                  </SelectTrigger>
                  <SelectContent>
                    {calendars.map((calendar) => (
                      <SelectItem key={calendar.id} value={calendar.id}>
                        <div className="flex items-center gap-2">
                          {calendar.backgroundColor && (
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: calendar.backgroundColor }}
                            />
                          )}
                          <span>{calendar.name}</span>
                          {calendar.primary && (
                            <Badge variant="outline" className="text-xs">Primary</Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Sync Progress */}
            {syncStatus === 'syncing' && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Syncing events...</span>
                  <span>{Math.round(syncProgress)}%</span>
                </div>
                <Progress value={syncProgress} className="w-full" />
              </div>
            )}

            {/* Sync Results */}
            {syncResult && syncStatus !== 'syncing' && (
              <Alert className={syncResult.errors > 0 ? "border-orange-200" : "border-green-200"}>
                {syncResult.errors > 0 ? (
                  <AlertCircle className="h-4 w-4" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                <AlertTitle>Sync Complete</AlertTitle>
                <AlertDescription>
                  <div className="space-y-1">
                    <p>✅ {syncResult.created} events created</p>
                    <p>🔄 {syncResult.updated} events updated</p>
                    {syncResult.errors > 0 && (
                      <p>❌ {syncResult.errors} events failed</p>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Event Summary */}
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Available Events</p>
                  <p className="text-xs text-muted-foreground">
                    {upcomingEvents.length} upcoming events ready to sync
                  </p>
                </div>
              </div>
              <Badge variant="outline">{upcomingEvents.length}</Badge>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button 
                onClick={handleSyncAll}
                disabled={syncStatus === 'syncing' || upcomingEvents.length === 0}
                className="w-full"
              >
                {syncStatus === 'syncing' ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Syncing {upcomingEvents.length} Events...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync All Events ({upcomingEvents.length})
                  </>
                )}
              </Button>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleDisconnect}
                  size="sm"
                  className="flex-1"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Disconnect
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                  onClick={() => window.open('https://calendar.google.com', '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Calendar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Status Legend */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Calendar Integration Status</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Connected</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span>Disconnected</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 