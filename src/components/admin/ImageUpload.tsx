"use client";

import { useState, useCallback } from 'react';
import { UploadButton } from '@/utils/uploadthing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { deleteUploadThingFile } from '@/utils/uploadthing';

interface ImageUploadProps {
  title: string;
  description?: string;
  uploadType: 'imageUploader' | 'slideshowUploader' | 'ministryUploader';
  currentImage?: {
    url: string;
    key: string;
  } | null;
  onImageChange: (image: { url: string; key: string } | null) => void;
  maxFileSize?: string;
  className?: string;
}

export function ImageUpload({
  title,
  description,
  uploadType,
  currentImage,
  onImageChange,
  maxFileSize = "4MB",
  className = ""
}: ImageUploadProps) {
  
  console.log("🎨 [ImageUpload] Component initialized with props:", {
    title,
    description,
    uploadType,
    hasCurrentImage: !!currentImage,
    currentImageUrl: currentImage?.url,
    currentImageKey: currentImage?.key,
    maxFileSize,
    className
  });
  
  // Add a simple test to see if component is working
  console.log("🎨 [ImageUpload] Component is working - this should appear in console");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleUploadComplete = useCallback((res: any) => {
    console.log("🎯 [ImageUpload] Upload complete callback triggered");
    console.log("📦 [ImageUpload] Response received:", res);
    
    setIsUploading(false);
    
    if (res && res[0]) {
      const file = res[0];
      console.log("✅ [ImageUpload] File data extracted:", {
        url: file.url,
        key: file.key,
        name: file.name,
        size: file.size
      });
      
      onImageChange({
        url: file.url,
        key: file.key
      });
      
      toast({
        title: 'Upload successful!',
        description: 'Your image has been uploaded successfully.',
      });
    } else {
      console.warn("⚠️ [ImageUpload] No file data in response:", res);
    }
  }, [onImageChange, toast]);

  const handleUploadError = useCallback((error: Error) => {
    console.error("❌ [ImageUpload] Upload error occurred:", error);
    console.error("❌ [ImageUpload] Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    setIsUploading(false);
    toast({
      title: 'Upload failed',
      description: error.message || 'Something went wrong with the upload.',
      variant: 'destructive',
    });
  }, [toast]);

  const handleDeleteImage = async () => {
    if (!currentImage?.key) return;

    try {
      await deleteUploadThingFile(currentImage.key);
      onImageChange(null);
      toast({
        title: 'Image deleted',
        description: 'The image has been removed successfully.',
      });
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: 'Failed to delete the image. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getUploaderConfig = () => {
    console.log("⚙️ [ImageUpload] Getting uploader config for type:", uploadType);
    
    let config;
    switch (uploadType) {
      case 'slideshowUploader':
        config = {
          endpoint: 'slideshowUploader',
          maxFileSize: '8MB',
          acceptedFiles: ['image/*']
        };
        break;
      case 'ministryUploader':
        config = {
          endpoint: 'ministryUploader',
          maxFileSize: '4MB',
          acceptedFiles: ['image/*']
        };
        break;
      default:
        config = {
          endpoint: 'imageUploader',
          maxFileSize: '4MB',
          acceptedFiles: ['image/*']
        };
        break;
    }
    
    console.log("⚙️ [ImageUpload] Generated config:", config);
    return config;
  };

  const config = getUploaderConfig();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          {title}
        </CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Image Display */}
        {currentImage && (
          <div className="relative group">
            <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={currentImage.url}
                alt="Current image"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteImage}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                Current Image
              </Badge>
              <span className="text-xs text-muted-foreground">
                Key: {currentImage.key.substring(0, 20)}...
              </span>
            </div>
          </div>
        )}

        {/* Upload Area */}
        {!currentImage && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <UploadButton
              endpoint={config.endpoint}
              onUploadBegin={(file) => {
                console.log("🚀 [ImageUpload] UploadButton begin triggered for endpoint:", config.endpoint);
                console.log("🚀 [ImageUpload] File being uploaded:", file);
                console.log("🚀 [ImageUpload] Config object:", config);
                setIsUploading(true);
              }}
              onClientUploadComplete={(res) => {
                console.log("🎯 [ImageUpload] UploadButton complete callback triggered");
                console.log("📦 [ImageUpload] UploadButton response:", res);
                handleUploadComplete(res);
              }}
              onUploadError={handleUploadError}
              className="w-full h-32 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
            >
              <div className="text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm font-medium">Click to upload image</p>
                <p className="text-xs text-muted-foreground mt-1">Max file size: {config.maxFileSize}</p>
              </div>
            </UploadButton>
          </div>
        )}

        {/* Replace Image Button */}
        {currentImage && (
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => onImageChange(null)}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Replace Image
            </Button>
          </div>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2 text-sm text-muted-foreground">Uploading...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
