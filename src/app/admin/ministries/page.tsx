"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, EyeOff, Heart, Mail, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function MinistriesAdminPage() {
  const router = useRouter();
  const [ministries, setMinistries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch ministries on component mount
  useEffect(() => {
    const fetchMinistries = async () => {
      try {
        const response = await fetch('/api/admin/ministries');
        if (response.ok) {
          const data = await response.json();
          setMinistries(data);
        }
      } catch (error) {
        console.error('Error fetching ministries:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMinistries();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Ministries</h1>
          <p className="text-muted-foreground">
            Manage your church ministries and programs
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/ministries/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Ministry
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Ministries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ministries.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {ministries.filter(ministry => ministry.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Adults</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {ministries.filter(ministry => ministry.targetAudience === 'Adults').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Youth & Children</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {ministries.filter(ministry => ['Youth', 'Children'].includes(ministry.targetAudience || '')).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ministries List */}
      <Card>
        <CardHeader>
          <CardTitle>All Ministries</CardTitle>
          <CardDescription>
            Manage your church ministries and programs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading ministries...</p>
            </div>
          ) : ministries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ministries.map((ministry, index) => (
                <div
                  key={ministry.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  {/* Image and Order */}
                  <div className="relative mb-4">
                    <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      {ministry.imageUrl ? (
                        <Image
                          src={ministry.imageUrl}
                          alt={ministry.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Heart className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    {/* Order Badge */}
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary">
                        #{ministry.order || index + 1}
                      </Badge>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-2 right-2">
                      <Badge variant={ministry.isActive ? "default" : "secondary"}>
                        {ministry.isActive ? "Active" : "Hidden"}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{ministry.name}</h3>
                    
                    {ministry.targetAudience && (
                      <div className="flex items-center">
                        <Badge 
                          variant="outline" 
                          className={
                            ministry.targetAudience === 'Adults' ? 'border-blue-200 text-blue-700' :
                            ministry.targetAudience === 'Youth' ? 'border-purple-200 text-purple-700' :
                            ministry.targetAudience === 'Children' ? 'border-green-200 text-green-700' :
                            'border-gray-200 text-gray-700'
                          }
                        >
                          {ministry.targetAudience}
                        </Badge>
                      </div>
                    )}
                    
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {ministry.description}
                    </p>
                    
                    <div className="space-y-1">
                      {ministry.meetingTime && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {ministry.meetingTime}
                        </div>
                      )}
                      
                      {ministry.contactEmail && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Mail className="h-3 w-3 mr-1" />
                          {ministry.contactEmail}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="text-xs text-muted-foreground">
                      {new Date(ministry.updatedAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/ministries/${ministry.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={ministry.isActive ? "text-gray-500" : "text-green-600"}
                        onClick={async () => {
                          try {
                            const response = await fetch(`/api/admin/ministries/${ministry.id}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ ...ministry, isActive: !ministry.isActive })
                            });
                            if (response.ok) {
                              setMinistries(prev => 
                                prev.map(m => 
                                  m.id === ministry.id 
                                    ? { ...m, isActive: !m.isActive }
                                    : m
                                )
                              );
                            }
                          } catch (error) {
                            console.error('Error toggling ministry status:', error);
                          }
                        }}
                      >
                        {ministry.isActive ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600"
                        onClick={async () => {
                          if (confirm('Are you sure you want to delete this ministry?')) {
                            try {
                              const response = await fetch(`/api/admin/ministries/${ministry.id}`, {
                                method: 'DELETE'
                              });
                              if (response.ok) {
                                setMinistries(prev => prev.filter(m => m.id !== ministry.id));
                              }
                            } catch (error) {
                              console.error('Error deleting ministry:', error);
                            }
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Heart className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium mb-2">No ministries yet</h3>
              <p className="text-muted-foreground mb-4">
                Get started by adding your first ministry.
              </p>
              <Button asChild>
                <Link href="/admin/ministries/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Ministry
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Ministry Management Tips</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700 space-y-2">
          <p>• Use compelling images that represent each ministry's purpose</p>
          <p>• Write clear descriptions that explain the ministry's mission and activities</p>
          <p>• Include meeting times and contact information for easy connection</p>
          <p>• Organize ministries by target audience (Adults, Youth, Children)</p>
          <p>• Use the order field to prioritize which ministries appear first</p>
        </CardContent>
      </Card>
    </div>
  );
}
