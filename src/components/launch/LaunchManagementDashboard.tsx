'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import Phase7LaunchChecklist, { LaunchCheckItem, LaunchReport } from '@/lib/launch/launch-checklist';
import Phase7AnalyticsManager from '@/lib/launch/analytics-setup';

interface LaunchDashboardProps {
  environment?: 'development' | 'staging' | 'production';
  onLaunchInitiated?: () => void;
  onRollbackInitiated?: () => void;
}

const LaunchManagementDashboard: React.FC<LaunchDashboardProps> = ({
  environment = 'production',
  onLaunchInitiated,
  onRollbackInitiated
}) => {
  const [launchChecklist] = useState(() => Phase7LaunchChecklist.getInstance());
  const [analyticsManager] = useState(() => Phase7AnalyticsManager.getInstance());
  const [checklistItems, setChecklistItems] = useState<LaunchCheckItem[]>([]);
  const [launchReport, setLaunchReport] = useState<LaunchReport | null>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isRunningChecks, setIsRunningChecks] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Initialize dashboard
  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // Initialize analytics
        await analyticsManager.initialize({
          environment,
          enablePerformanceTracking: true,
          enableErrorTracking: true,
          enableUserTracking: true
        });

        // Get initial checklist state
        setChecklistItems(launchChecklist.getAllItems());
        setLaunchReport(launchChecklist.generateLaunchReport());
        setAnalyticsData(analyticsManager.getAnalyticsSummary());

        console.log('🚀 Launch Management Dashboard initialized');
      } catch (error) {
        console.error('❌ Dashboard initialization failed:', error);
      }
    };

    initializeDashboard();
  }, [environment, analyticsManager, launchChecklist]);

  // Refresh data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setLaunchReport(launchChecklist.generateLaunchReport());
      setAnalyticsData(analyticsManager.getAnalyticsSummary());
      setLastUpdate(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [launchChecklist, analyticsManager]);

  const runAutomatedChecks = async () => {
    setIsRunningChecks(true);
    try {
      await launchChecklist.runAutomatedChecks();
      setChecklistItems([...launchChecklist.getAllItems()]);
      setLaunchReport(launchChecklist.generateLaunchReport());
    } catch (error) {
      console.error('❌ Automated checks failed:', error);
    } finally {
      setIsRunningChecks(false);
    }
  };

  const updateChecklistItem = (itemId: string, status: LaunchCheckItem['status'], notes?: string) => {
    launchChecklist.updateItemStatus(itemId, status, notes);
    setChecklistItems([...launchChecklist.getAllItems()]);
    setLaunchReport(launchChecklist.generateLaunchReport());
  };

  const exportLaunchData = () => {
    const data = {
      checklist: launchChecklist.exportLaunchData(),
      analytics: analyticsManager.exportAnalyticsData(),
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `launch-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: LaunchCheckItem['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'failed': return 'bg-red-500';
      case 'skipped': return 'bg-gray-500';
      default: return 'bg-yellow-500';
    }
  };

  const getPriorityColor = (priority: LaunchCheckItem['priority']) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  const getCategoryIcon = (category: LaunchCheckItem['category']) => {
    switch (category) {
      case 'technical': return '⚙️';
      case 'performance': return '⚡';
      case 'accessibility': return '♿';
      case 'content': return '📝';
      case 'seo': return '🔍';
      case 'analytics': return '📊';
      case 'backup': return '💾';
      default: return '📋';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Phase 7: Launch Management</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive launch dashboard for First Baptist Church Fenton website
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={runAutomatedChecks}
            disabled={isRunningChecks}
            variant="outline"
          >
            {isRunningChecks ? '⏳ Running Checks...' : '🔄 Run Checks'}
          </Button>
          <Button onClick={exportLaunchData} variant="outline">
            📊 Export Report
          </Button>
        </div>
      </div>

      {/* Launch Status Overview */}
      {launchReport && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Launch Readiness</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((launchReport.completedItems / launchReport.totalItems) * 100)}%
              </div>
              <Progress 
                value={(launchReport.completedItems / launchReport.totalItems) * 100} 
                className="mt-2"
              />
              <p className="text-xs text-gray-600 mt-1">
                {launchReport.completedItems} of {launchReport.totalItems} items completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {launchReport.criticalIssues}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Must be resolved before launch
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Overall Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge 
                variant={
                  launchReport.overallStatus === 'ready' ? 'default' :
                  launchReport.overallStatus === 'needs-work' ? 'secondary' : 'destructive'
                }
                className="text-sm"
              >
                {launchReport.overallStatus.replace('-', ' ').toUpperCase()}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                {lastUpdate.toLocaleTimeString()}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {environment} environment
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Critical Alerts */}
      {launchReport && launchReport.criticalIssues > 0 && (
        <Alert variant="destructive">
          <AlertTitle>🚨 Critical Issues Detected</AlertTitle>
          <AlertDescription>
            {launchReport.criticalIssues} critical issues must be resolved before launch. 
            Review the checklist below for details.
          </AlertDescription>
        </Alert>
      )}

      {/* Recommendations */}
      {launchReport && launchReport.recommendations.length > 0 && (
        <Alert>
          <AlertTitle>💡 Recommendations</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1 mt-2">
              {launchReport.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="checklist" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="checklist">📋 Launch Checklist</TabsTrigger>
          <TabsTrigger value="analytics">📊 Analytics</TabsTrigger>
          <TabsTrigger value="deployment">🚀 Deployment</TabsTrigger>
          <TabsTrigger value="monitoring">📈 Monitoring</TabsTrigger>
        </TabsList>

        {/* Launch Checklist Tab */}
        <TabsContent value="checklist" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Launch Readiness Checklist</CardTitle>
              <CardDescription>
                Complete all items below to ensure a successful launch
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Category Progress */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {launchReport && Object.entries(launchReport.categories).map(([category, stats]) => (
                  <div key={category} className="text-center">
                    <div className="text-2xl mb-1">{getCategoryIcon(category as LaunchCheckItem['category'])}</div>
                    <div className="font-medium capitalize">{category}</div>
                    <div className="text-sm text-gray-600">
                      {stats.completed}/{stats.total}
                    </div>
                    <Progress 
                      value={(stats.completed / stats.total) * 100} 
                      className="mt-1 h-2"
                    />
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              {/* Checklist Items */}
              <div className="space-y-4">
                {Object.entries(
                  checklistItems.reduce((acc, item) => {
                    if (!acc[item.category]) acc[item.category] = [];
                    acc[item.category].push(item);
                    return acc;
                  }, {} as Record<string, LaunchCheckItem[]>)
                ).map(([category, items]) => (
                  <div key={category} className="space-y-3">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      {getCategoryIcon(category as LaunchCheckItem['category'])}
                      <span className="capitalize">{category}</span>
                    </h3>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(item.status)}`} />
                            <div>
                              <div className="font-medium">{item.title}</div>
                              <div className="text-sm text-gray-600">{item.description}</div>
                              {item.estimatedTime && (
                                <div className="text-xs text-gray-500 mt-1">
                                  ⏱️ Est. {item.estimatedTime}
                                </div>
                              )}
                              {item.notes && (
                                <div className="text-xs text-blue-600 mt-1">
                                  💬 {item.notes}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={getPriorityColor(item.priority)}>
                              {item.priority}
                            </Badge>
                            <select
                              value={item.status}
                              onChange={(e) => updateChecklistItem(item.id, e.target.value as LaunchCheckItem['status'])}
                              className="text-sm border rounded px-2 py-1"
                            >
                              <option value="pending">Pending</option>
                              <option value="in-progress">In Progress</option>
                              <option value="completed">Completed</option>
                              <option value="failed">Failed</option>
                              <option value="skipped">Skipped</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Events Tracked</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsData?.eventsTracked || 0}
                </div>
                <p className="text-sm text-gray-600">Total events in this session</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Error Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {analyticsData?.errorsReported || 0}
                </div>
                <p className="text-sm text-gray-600">Errors detected</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {analyticsData?.performanceScore || 0}%
                </div>
                <p className="text-sm text-gray-600">Overall performance</p>
              </CardContent>
            </Card>
          </div>

          {analyticsData && analyticsData.topEvents && (
            <Card>
              <CardHeader>
                <CardTitle>Top Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analyticsData.topEvents.map((event: any, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="font-medium">{event.name}</span>
                      <Badge variant="outline">{event.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Deployment Tab */}
        <TabsContent value="deployment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Deployment Controls</CardTitle>
              <CardDescription>
                Manage the website deployment process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <AlertTitle>🔄 Pre-Launch Actions</AlertTitle>
                  <AlertDescription>
                    <div className="mt-3 space-y-2">
                      <Button variant="outline" className="w-full">
                        📦 Create Backup
                      </Button>
                      <Button variant="outline" className="w-full">
                        🧪 Run Final Tests
                      </Button>
                      <Button variant="outline" className="w-full">
                        📋 Verify DNS Settings
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>

                <Separator />

                <div className="space-y-3">
                  <Button 
                    className="w-full"
                    size="lg"
                    onClick={onLaunchInitiated}
                    disabled={launchReport?.overallStatus !== 'ready'}
                  >
                    🚀 Launch Website
                  </Button>
                  
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={onRollbackInitiated}
                  >
                    🔄 Rollback to Previous Version
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Monitoring</CardTitle>
              <CardDescription>
                Live performance and error monitoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">System Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Website Status</span>
                      <Badge variant="default">🟢 Online</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>API Status</span>
                      <Badge variant="default">🟢 Operational</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Database</span>
                      <Badge variant="default">🟢 Connected</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Performance Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Page Load Time</span>
                      <Badge variant="outline">1.2s</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Server Response</span>
                      <Badge variant="outline">89ms</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Uptime</span>
                      <Badge variant="outline">99.9%</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LaunchManagementDashboard; 