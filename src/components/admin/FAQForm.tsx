"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    name: string;
  } | null;
}

interface FAQFormProps {
  faq?: FAQ | null;
  isNew: boolean;
}

export function FAQForm({ faq, isNew }: FAQFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    question: faq?.question || '',
    answer: faq?.answer || '',
    order: faq?.order || 0,
    isActive: faq?.isActive ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = isNew ? '/api/admin/faq' : `/api/admin/faq/${faq?.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: isNew ? 'FAQ created!' : 'FAQ updated!',
          description: isNew
            ? 'The new FAQ has been created successfully.'
            : 'The FAQ has been updated successfully.',
        });
        router.push('/admin/faq');
        router.refresh();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Something went wrong.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save FAQ. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!faq || isNew) return;

    if (!confirm('Are you sure you want to delete this FAQ? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/faq/${faq.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'FAQ deleted!',
          description: 'The FAQ has been deleted successfully.',
        });
        router.push('/admin/faq');
        router.refresh();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to delete FAQ.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete FAQ. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" asChild>
        <Link href="/admin/faq">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to FAQs
        </Link>
      </Button>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>{isNew ? 'Create New FAQ' : 'Edit FAQ'}</CardTitle>
          <CardDescription>
            {isNew
              ? 'Fill in the details below to create a new frequently asked question.'
              : 'Update the question and answer details below.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question */}
            <div className="space-y-2">
              <Label htmlFor="question">Question *</Label>
              <Input
                id="question"
                value={formData.question}
                onChange={(e) => handleChange('question', e.target.value)}
                placeholder="What is your question?"
                required
                disabled={isLoading}
              />
              <p className="text-sm text-muted-foreground">
                This is the question that visitors will see.
              </p>
            </div>

            {/* Answer */}
            <div className="space-y-2">
              <Label htmlFor="answer">Answer *</Label>
              <Textarea
                id="answer"
                value={formData.answer}
                onChange={(e) => handleChange('answer', e.target.value)}
                placeholder="Provide a clear and helpful answer..."
                rows={6}
                required
                disabled={isLoading}
              />
              <p className="text-sm text-muted-foreground">
                Write a clear, comprehensive answer to help your visitors.
              </p>
            </div>

            {/* Order */}
            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => handleChange('order', parseInt(e.target.value) || 0)}
                placeholder="0"
                disabled={isLoading}
                min="0"
              />
              <p className="text-sm text-muted-foreground">
                Lower numbers appear first. Use 0 for automatic ordering.
              </p>
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleChange('isActive', checked)}
                disabled={isLoading}
              />
              <Label htmlFor="isActive">
                Active (visible on website)
              </Label>
            </div>

            {/* Metadata */}
            {!isNew && faq && (
              <div className="text-sm text-muted-foreground space-y-1 pt-4 border-t">
                <p>Created by {faq.user?.name || 'Unknown'} on {new Date(faq.createdAt).toLocaleDateString()}</p>
                {faq.updatedAt && faq.updatedAt !== faq.createdAt && (
                  <p>Last updated on {new Date(faq.updatedAt).toLocaleDateString()}</p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t">
              <div>
                {!isNew && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete FAQ
                  </Button>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" asChild disabled={isLoading}>
                  <Link href="/admin/faq">Cancel</Link>
                </Button>
                <Button type="submit" disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading
                    ? 'Saving...'
                    : isNew
                    ? 'Create FAQ'
                    : 'Update FAQ'
                  }
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
