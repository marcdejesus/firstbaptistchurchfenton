import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Homepage Slideshow | Admin Dashboard',
  description: 'Manage homepage slideshow images',
  robots: 'noindex, nofollow',
};

async function getSlides() {
  try {
    const slides = await prisma.homeSlideshow.findMany({
      orderBy: { order: 'asc' }
    });
    return slides;
  } catch (error) {
    console.error('Error fetching slides:', error);
    return [];
  }
}

export default async function SlideshowAdminPage() {
  const session = await getServerSession(authOptions);
  const slides = await getSlides();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Hero Background Images</h1>
          <p className="text-muted-foreground">
            Manage the background images that cycle in your homepage hero section
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/home/slideshow/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Slide
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Slides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{slides.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {slides.filter(slide => slide.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Hidden</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-500">
              {slides.filter(slide => !slide.isActive).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Slideshow List */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Background Images</CardTitle>
          <CardDescription>
            Manage the background images that cycle behind your homepage hero text
          </CardDescription>
        </CardHeader>
        <CardContent>
          {slides.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Image */}
                  <div className="relative aspect-video bg-gray-100">
                    {slide.imageUrl ? (
                      <Image
                        src={slide.imageUrl}
                        alt={slide.title || 'Slideshow image'}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ImageIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Order Badge */}
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary">
                        #{slide.order || index + 1}
                      </Badge>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-2 right-2">
                      <Badge variant={slide.isActive ? "default" : "secondary"}>
                        {slide.isActive ? "Active" : "Hidden"}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="space-y-2">
                      {slide.title && (
                        <h3 className="font-medium text-lg">{slide.title}</h3>
                      )}
                      {slide.subtitle && (
                        <p className="text-sm text-muted-foreground">
                          {slide.subtitle}
                        </p>
                      )}
                      {slide.linkUrl && slide.linkText && (
                        <div className="text-xs text-blue-600">
                          Link: {slide.linkText}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="text-xs text-muted-foreground">
                        {new Date(slide.updatedAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/home/slideshow/${slide.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={slide.isActive ? "text-gray-500" : "text-green-600"}
                        >
                          {slide.isActive ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <ImageIcon className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium mb-2">No slides yet</h3>
              <p className="text-muted-foreground mb-4">
                Get started by adding your first slideshow image.
              </p>
              <Button asChild>
                <Link href="/admin/home/slideshow/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Slide
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Slideshow Tips</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700 space-y-2">
          <p>• Use high-quality images with a 16:9 aspect ratio (1920x1080px recommended)</p>
          <p>• These images will appear behind the hero text with a dark overlay</p>
          <p>• Choose images that look good with white text overlaid</p>
          <p>• Images cycle automatically every 7 seconds</p>
          <p>• Use the order field to control the sequence</p>
        </CardContent>
      </Card>
    </div>
  );
}
