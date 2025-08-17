'use client';

import React, { useState, useEffect } from 'react';
import { Save, Eye, RotateCcw, HelpCircle, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import MediaManager from './MediaManager';
import type { EditableArea, PageContent, ContentUpdateForm, MediaFile } from '@/types/cms';

interface ContentEditorProps {
  pageSlug: string;
  pageName: string;
  editableAreas: EditableArea[];
  currentContent: PageContent[];
  onSave: (updates: ContentUpdateForm[]) => Promise<void>;
  isLoading?: boolean;
}

interface ContentChange {
  sectionKey: string;
  value: string;
  altText?: string;
  mediaId?: number;
}

export function ContentEditor({
  pageSlug,
  pageName,
  editableAreas,
  currentContent,
  onSave,
  isLoading = false
}: ContentEditorProps) {
  const [changes, setChanges] = useState<Map<string, ContentChange>>(new Map());
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedMediaArea, setSelectedMediaArea] = useState<string | null>(null);

  // Initialize form state with current content
  useEffect(() => {
    const initialChanges = new Map<string, ContentChange>();
    editableAreas.forEach(area => {
      const content = currentContent.find(c => c.sectionKey === area.areaKey);
      if (content) {
        initialChanges.set(area.areaKey, {
          sectionKey: area.areaKey,
          value: content.contentValue || '',
          altText: content.altText,
          mediaId: content.mediaId
        });
      } else {
        initialChanges.set(area.areaKey, {
          sectionKey: area.areaKey,
          value: area.defaultValue || '',
          altText: '',
          mediaId: undefined
        });
      }
    });
    setChanges(initialChanges);
  }, [editableAreas, currentContent]);

  const updateChange = (sectionKey: string, updates: Partial<ContentChange>) => {
    setChanges(prev => {
      const newChanges = new Map(prev);
      const existing = newChanges.get(sectionKey) || { sectionKey, value: '' };
      newChanges.set(sectionKey, { ...existing, ...updates });
      return newChanges;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updates: ContentUpdateForm[] = Array.from(changes.entries()).map(([sectionKey, change]) => ({
        pageSlug,
        sectionKey,
        contentValue: change.value,
        altText: change.altText,
        mediaId: change.mediaId
      }));
      
      await onSave(updates);
    } catch (error) {
      console.error('Failed to save content:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to discard all changes?')) {
      // Reset to original content
      const resetChanges = new Map<string, ContentChange>();
      editableAreas.forEach(area => {
        const content = currentContent.find(c => c.sectionKey === area.areaKey);
        if (content) {
          resetChanges.set(area.areaKey, {
            sectionKey: area.areaKey,
            value: content.contentValue || '',
            altText: content.altText,
            mediaId: content.mediaId
          });
        } else {
          resetChanges.set(area.areaKey, {
            sectionKey: area.areaKey,
            value: area.defaultValue || '',
            altText: '',
            mediaId: undefined
          });
        }
      });
      setChanges(resetChanges);
    }
  };

  const hasChanges = () => {
    return Array.from(changes.entries()).some(([sectionKey, change]) => {
      const original = currentContent.find(c => c.sectionKey === sectionKey);
      if (!original) {
        return change.value !== (editableAreas.find(a => a.areaKey === sectionKey)?.defaultValue || '');
      }
      return (
        change.value !== (original.contentValue || '') ||
        change.altText !== (original.altText || '') ||
        change.mediaId !== original.mediaId
      );
    });
  };

  const renderField = (area: EditableArea) => {
    const change = changes.get(area.areaKey);
    if (!change) return null;

    const commonProps = {
      id: area.areaKey,
      required: area.isRequired,
      disabled: isLoading || isSaving
    };

    switch (area.contentType) {
      case 'text':
        return area.maxLength && area.maxLength > 100 ? (
          <Textarea
            {...commonProps}
            value={change.value}
            onChange={(e) => updateChange(area.areaKey, { value: e.target.value })}
            placeholder={area.defaultValue || `Enter ${area.areaLabel.toLowerCase()}`}
            maxLength={area.maxLength}
            rows={3}
            className="resize-none"
          />
        ) : (
          <Input
            {...commonProps}
            type="text"
            value={change.value}
            onChange={(e) => updateChange(area.areaKey, { value: e.target.value })}
            placeholder={area.defaultValue || `Enter ${area.areaLabel.toLowerCase()}`}
            maxLength={area.maxLength}
          />
        );

      case 'html':
        return (
          <Textarea
            {...commonProps}
            value={change.value}
            onChange={(e) => updateChange(area.areaKey, { value: e.target.value })}
            placeholder={area.defaultValue || `Enter ${area.areaLabel.toLowerCase()}`}
            rows={6}
            className="font-mono text-sm resize-none"
          />
        );

      case 'url':
        return (
          <Input
            {...commonProps}
            type="url"
            value={change.value}
            onChange={(e) => updateChange(area.areaKey, { value: e.target.value })}
            placeholder="https://example.com"
          />
        );

      case 'image':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Dialog open={selectedMediaArea === area.areaKey} onOpenChange={(open) => setSelectedMediaArea(open ? area.areaKey : null)}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    {change.mediaId ? 'Change Image' : 'Select Image'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl">
                  <DialogHeader>
                    <DialogTitle>Select Image for {area.areaLabel}</DialogTitle>
                    <DialogDescription>
                      Choose an image from your media library or upload a new one
                    </DialogDescription>
                  </DialogHeader>
                  <MediaManager
                    onSelect={(file: MediaFile) => {
                      updateChange(area.areaKey, { 
                        value: file.fileUrl, 
                        mediaId: file.id,
                        altText: file.altText || ''
                      });
                      setSelectedMediaArea(null);
                    }}
                    selectionMode="single"
                    allowUpload={true}
                    defaultFolder="general"
                  />
                </DialogContent>
              </Dialog>
            </div>
            
            {change.value && (
              <div className="space-y-2">
                <div className="relative aspect-video max-w-sm bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={change.value}
                    alt={change.altText || area.areaLabel}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <Label htmlFor={`${area.areaKey}-alt`} className="text-sm font-medium">
                    Alt Text (Required for accessibility)
                  </Label>
                  <Input
                    id={`${area.areaKey}-alt`}
                    value={change.altText || ''}
                    onChange={(e) => updateChange(area.areaKey, { altText: e.target.value })}
                    placeholder="Describe this image for screen readers"
                    className="mt-1"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Alt text helps visually impaired users understand what the image shows
                  </p>
                </div>
              </div>
            )}
          </div>
        );

      case 'boolean':
        return (
          <div className="flex items-center space-x-3">
            <input
              {...commonProps}
              type="checkbox"
              checked={change.value === 'true'}
              onChange={(e) => updateChange(area.areaKey, { value: e.target.checked ? 'true' : 'false' })}
              className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <Label htmlFor={area.areaKey} className="text-sm">
              Enable {area.areaLabel}
            </Label>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold">Edit {pageName}</h1>
            <p className="text-muted-foreground">
              Make changes to the content on this page. All changes will be saved automatically.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={!hasChanges() || isSaving}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Changes
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              disabled={isSaving}
            >
              <Eye className="h-4 w-4 mr-2" />
              {showPreview ? 'Hide Preview' : 'Preview'}
            </Button>
            
            <Button
              onClick={handleSave}
              disabled={!hasChanges() || isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* Status */}
        {hasChanges() && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <p className="text-orange-800 font-medium">
                  You have unsaved changes
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content Form */}
        <div className="grid gap-6">
          {editableAreas
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((area) => (
              <Card key={area.areaKey}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {area.areaLabel}
                        {area.isRequired && (
                          <Badge variant="destructive" className="text-xs">
                            Required
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {area.contentType}
                        </Badge>
                      </CardTitle>
                      {area.helpText && (
                        <CardDescription>{area.helpText}</CardDescription>
                      )}
                    </div>
                    
                    {area.helpText && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <HelpCircle className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>{area.helpText}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <Label htmlFor={area.areaKey} className="text-sm font-medium">
                      {area.areaLabel}
                      {area.isRequired && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    {renderField(area)}
                    {area.maxLength && (
                      <p className="text-xs text-muted-foreground">
                        {changes.get(area.areaKey)?.value.length || 0} / {area.maxLength} characters
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        {/* Preview Mode */}
        {showPreview && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">Preview Mode</CardTitle>
              <CardDescription className="text-blue-700">
                This shows how your changes will appear on the website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-white rounded-lg p-6 space-y-4">
                {editableAreas.map((area) => {
                  const change = changes.get(area.areaKey);
                  if (!change?.value) return null;
                  
                  return (
                    <div key={area.areaKey}>
                      <h4 className="text-sm font-medium text-gray-600 mb-1">
                        {area.areaLabel}
                      </h4>
                      {area.contentType === 'image' ? (
                        <div className="space-y-2">
                          <img
                            src={change.value}
                            alt={change.altText || area.areaLabel}
                            className="max-w-xs rounded-lg"
                          />
                          {change.altText && (
                            <p className="text-xs text-gray-500">
                              Alt text: {change.altText}
                            </p>
                          )}
                        </div>
                      ) : area.contentType === 'html' ? (
                        <div 
                          className="prose prose-sm"
                          dangerouslySetInnerHTML={{ __html: change.value }}
                        />
                      ) : (
                        <p className="text-gray-900">{change.value}</p>
                      )}
                      <Separator className="mt-3" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
}

export default ContentEditor;
