'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { 
  Upload, 
  Search, 
  Grid3X3, 
  List, 
  Filter,
  MoreHorizontal,
  Edit2,
  Trash2,
  Download,
  Eye,
  FolderOpen,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { MediaFile, MediaFilter, MediaManagerProps } from '@/types/cms';
import { MEDIA_FOLDERS } from '@/types/cms';

export function MediaManager({ 
  onSelect, 
  selectionMode = 'single', 
  allowUpload = true,
  filter,
  defaultFolder = 'general'
}: MediaManagerProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>(defaultFolder);
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [editingFile, setEditingFile] = useState<MediaFile | null>(null);
  const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);

  // Mock data - replace with actual API calls
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([
    {
      id: 1,
      uuid: '1',
      filename: 'church-exterior.jpg',
      originalName: 'Church Exterior Photo.jpg',
      filePath: '/uploads/church-exterior.jpg',
      fileUrl: '/placeholder.jpg',
      fileSize: 2048576,
      mimeType: 'image/jpeg',
      width: 1920,
      height: 1080,
      altText: 'Beautiful exterior view of First Baptist Church Fenton',
      caption: 'Main entrance to our church building',
      folder: 'general',
      tags: ['church', 'building', 'exterior'],
      isOptimized: true,
      uploadedBy: 1,
      uploadedByName: 'Admin User',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!allowUpload) return;
    
    setIsUploading(true);
    
    for (const file of acceptedFiles) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', selectedFolder);
        formData.append('altText', ''); // Will be filled in by user later
        
        // Mock upload - replace with actual API call
        const newFile: MediaFile = {
          id: Date.now(),
          uuid: Math.random().toString(36),
          filename: file.name.replace(/[^a-zA-Z0-9.-]/g, '_'),
          originalName: file.name,
          filePath: `/uploads/${file.name}`,
          fileUrl: URL.createObjectURL(file),
          fileSize: file.size,
          mimeType: file.type,
          altText: '',
          folder: selectedFolder,
          tags: [],
          isOptimized: false,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        setMediaFiles(prev => [newFile, ...prev]);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
    
    setIsUploading(false);
  }, [allowUpload, selectedFolder]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: !allowUpload
  });

  const filteredFiles = mediaFiles.filter(file => {
    if (selectedFolder !== 'all' && file.folder !== selectedFolder) return false;
    if (searchTerm && !file.filename.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !file.altText?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (file: MediaFile) => {
    if (selectionMode === 'single') {
      setSelectedFiles([file.id]);
      onSelect?.(file);
    } else {
      setSelectedFiles(prev => 
        prev.includes(file.id) 
          ? prev.filter(id => id !== file.id)
          : [...prev, file.id]
      );
    }
  };

  const handleEditFile = async (file: MediaFile, updates: Partial<MediaFile>) => {
    try {
      // Mock API call - replace with actual implementation
      const updatedFile = { ...file, ...updates, updatedAt: new Date() };
      setMediaFiles(prev => prev.map(f => f.id === file.id ? updatedFile : f));
      setEditingFile(null);
    } catch (error) {
      console.error('Failed to update file:', error);
    }
  };

  const handleDeleteFile = async (fileId: number) => {
    if (confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
      try {
        // Mock API call - replace with actual implementation
        setMediaFiles(prev => prev.filter(f => f.id !== fileId));
      } catch (error) {
        console.error('Failed to delete file:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold">Media Library</h2>
          <p className="text-muted-foreground">
            Manage your photos and media files
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Upload Area */}
      {allowUpload && (
        <Card>
          <CardContent className="p-6">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                isDragActive 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {isDragActive ? 'Drop files here' : 'Upload Media Files'}
              </h3>
              <p className="text-muted-foreground mb-4">
                Drag and drop images here, or click to select files
              </p>
              <p className="text-sm text-muted-foreground">
                Supports: JPEG, PNG, WebP, GIF • Max size: 10MB per file
              </p>
              {isUploading && (
                <div className="mt-4">
                  <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-lg">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                    Uploading...
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={selectedFolder} onValueChange={setSelectedFolder}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select folder" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Folders</SelectItem>
            {MEDIA_FOLDERS.map((folder) => (
              <SelectItem key={folder} value={folder}>
                <div className="flex items-center">
                  <FolderOpen className="h-4 w-4 mr-2" />
                  {folder.charAt(0).toUpperCase() + folder.slice(1)}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* File Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filteredFiles.map((file) => (
            <Card 
              key={file.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedFiles.includes(file.id) ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleFileSelect(file)}
            >
              <CardContent className="p-2">
                <div className="aspect-square relative mb-2 rounded-lg overflow-hidden bg-gray-100">
                  {file.mimeType.startsWith('image/') ? (
                    <Image
                      src={file.fileUrl}
                      alt={file.altText || file.filename}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-2xl">📄</span>
                    </div>
                  )}
                  
                  <div className="absolute top-2 right-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setPreviewFile(file)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditingFile(file)}>
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <a href={file.fileUrl} download={file.originalName}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteFile(file.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium truncate" title={file.originalName}>
                    {file.originalName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.fileSize)}
                  </p>
                  {file.folder && (
                    <Badge variant="outline" className="text-xs mt-1">
                      {file.folder}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredFiles.map((file) => (
                <div 
                  key={file.id}
                  className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 ${
                    selectedFiles.includes(file.id) ? 'bg-primary/5' : ''
                  }`}
                  onClick={() => handleFileSelect(file)}
                >
                  <div className="flex-shrink-0 w-12 h-12 relative rounded-lg overflow-hidden bg-gray-100 mr-4">
                    {file.mimeType.startsWith('image/') ? (
                      <Image
                        src={file.fileUrl}
                        alt={file.altText || file.filename}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span>📄</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.originalName}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(file.fileSize)} • {file.mimeType}
                    </p>
                    {file.altText && (
                      <p className="text-sm text-muted-foreground truncate">
                        Alt: {file.altText}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {file.folder && (
                      <Badge variant="outline">{file.folder}</Badge>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setPreviewFile(file)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditingFile(file)}>
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <a href={file.fileUrl} download={file.originalName}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteFile(file.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit File Dialog */}
      {editingFile && (
        <Dialog open={!!editingFile} onOpenChange={() => setEditingFile(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit File Details</DialogTitle>
              <DialogDescription>
                Update the alt text and other metadata for this file
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="alt-text">Alt Text *</Label>
                <Textarea
                  id="alt-text"
                  defaultValue={editingFile.altText || ''}
                  placeholder="Describe what's in this image for accessibility"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Alt text helps screen readers describe images to visually impaired users
                </p>
              </div>
              
              <div>
                <Label htmlFor="caption">Caption (Optional)</Label>
                <Input
                  id="caption"
                  defaultValue={editingFile.caption || ''}
                  placeholder="Optional caption for display"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="folder">Folder</Label>
                <Select defaultValue={editingFile.folder}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MEDIA_FOLDERS.map((folder) => (
                      <SelectItem key={folder} value={folder}>
                        {folder.charAt(0).toUpperCase() + folder.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingFile(null)}>
                Cancel
              </Button>
              <Button onClick={() => {
                const altText = (document.getElementById('alt-text') as HTMLTextAreaElement)?.value;
                const caption = (document.getElementById('caption') as HTMLInputElement)?.value;
                handleEditFile(editingFile, { altText, caption });
              }}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Preview Dialog */}
      {previewFile && (
        <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{previewFile.originalName}</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-4 top-4"
                onClick={() => setPreviewFile(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogHeader>
            
            <div className="space-y-4">
              {previewFile.mimeType.startsWith('image/') && (
                <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={previewFile.fileUrl}
                    alt={previewFile.altText || previewFile.filename}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">File Size:</span> {formatFileSize(previewFile.fileSize)}
                </div>
                <div>
                  <span className="font-medium">Type:</span> {previewFile.mimeType}
                </div>
                {previewFile.width && previewFile.height && (
                  <>
                    <div>
                      <span className="font-medium">Dimensions:</span> {previewFile.width} × {previewFile.height}
                    </div>
                    <div>
                      <span className="font-medium">Folder:</span> {previewFile.folder}
                    </div>
                  </>
                )}
                {previewFile.altText && (
                  <div className="col-span-2">
                    <span className="font-medium">Alt Text:</span> {previewFile.altText}
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default MediaManager;
