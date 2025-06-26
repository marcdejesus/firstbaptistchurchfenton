"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, Send, MessageSquare, Smartphone, Monitor } from 'lucide-react';

interface UserFeedback {
  id: string;
  timestamp: number;
  userInfo: {
    name: string;
    email: string;
    age: string;
    techComfort: 'beginner' | 'intermediate' | 'advanced';
    device: 'mobile' | 'tablet' | 'desktop';
  };
  usabilityRating: number;
  designRating: number;
  performanceRating: number;
  accessibilityRating: number;
  overallRating: number;
  specificFeedback: {
    easyToNavigate: boolean;
    designAppealing: boolean;
    loadsFast: boolean;
    textReadable: boolean;
    buttonsEasyToClick: boolean;
    findInformation: boolean;
  };
  comments: string;
  issues: string[];
  suggestions: string[];
  pageUrl: string;
  browserInfo: string;
}

interface FeedbackFormProps {
  onSubmit: (feedback: UserFeedback) => void;
  isVisible: boolean;
  onClose: () => void;
}

const UserFeedbackCollector: React.FC<FeedbackFormProps> = ({ 
  onSubmit, 
  isVisible, 
  onClose 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    techComfort: 'intermediate' as const,
    device: 'desktop' as const,
    usabilityRating: 5,
    designRating: 5,
    performanceRating: 5,
    accessibilityRating: 5,
    overallRating: 5,
    easyToNavigate: true,
    designAppealing: true,
    loadsFast: true,
    textReadable: true,
    buttonsEasyToClick: true,
    findInformation: true,
    comments: '',
    issues: '',
    suggestions: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isVisible) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const feedback: UserFeedback = {
      id: `feedback-${Date.now()}`,
      timestamp: Date.now(),
      userInfo: {
        name: formData.name,
        email: formData.email,
        age: formData.age,
        techComfort: formData.techComfort,
        device: formData.device
      },
      usabilityRating: formData.usabilityRating,
      designRating: formData.designRating,
      performanceRating: formData.performanceRating,
      accessibilityRating: formData.accessibilityRating,
      overallRating: formData.overallRating,
      specificFeedback: {
        easyToNavigate: formData.easyToNavigate,
        designAppealing: formData.designAppealing,
        loadsFast: formData.loadsFast,
        textReadable: formData.textReadable,
        buttonsEasyToClick: formData.buttonsEasyToClick,
        findInformation: formData.findInformation
      },
      comments: formData.comments,
      issues: formData.issues.split('\n').filter(issue => issue.trim()),
      suggestions: formData.suggestions.split('\n').filter(suggestion => suggestion.trim()),
      pageUrl: window.location.href,
      browserInfo: navigator.userAgent
    };

    try {
      onSubmit(feedback);
      // Reset form
      setFormData({
        name: '', email: '', age: '', techComfort: 'intermediate', device: 'desktop',
        usabilityRating: 5, designRating: 5, performanceRating: 5, 
        accessibilityRating: 5, overallRating: 5,
        easyToNavigate: true, designAppealing: true, loadsFast: true,
        textReadable: true, buttonsEasyToClick: true, findInformation: true,
        comments: '', issues: '', suggestions: ''
      });
      setCurrentStep(1);
      onClose();
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating: React.FC<{
    rating: number;
    onRatingChange: (rating: number) => void;
    label: string;
  }> = ({ rating, onRatingChange, label }) => (
    <div className="space-y-2">
      <Label className="text-desktop-textMedium font-body">{label}</Label>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className="p-1 focus:outline-none focus:ring-2 focus:ring-primary-orange rounded"
          >
            <Star
              className={`h-6 w-6 ${
                star <= rating 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  const YesNoQuestion: React.FC<{
    question: string;
    value: boolean;
    onChange: (value: boolean) => void;
  }> = ({ question, value, onChange }) => (
    <div className="space-y-2">
      <Label className="text-desktop-textMedium font-body">{question}</Label>
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`px-4 py-2 rounded transition-colors ${
            value 
              ? 'bg-green-100 text-green-800 border-green-300' 
              : 'bg-gray-100 text-gray-600 border-gray-300'
          } border`}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`px-4 py-2 rounded transition-colors ${
            !value 
              ? 'bg-red-100 text-red-800 border-red-300' 
              : 'bg-gray-100 text-gray-600 border-gray-300'
          } border`}
        >
          No
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-scheme-1-background">
        <CardHeader className="bg-scheme-2-background">
          <CardTitle className="text-desktop-heading3 font-heading text-scheme-2-text flex items-center">
            <MessageSquare className="mr-2 h-6 w-6" />
            Website Feedback - Phase 6 Testing
          </CardTitle>
          <p className="text-desktop-textMedium text-scheme-2-text opacity-80 font-body">
            Help us improve the new First Baptist Church website by sharing your experience.
          </p>
          <div className="flex justify-between items-center mt-4">
            <div className="flex space-x-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step <= currentStep 
                      ? 'bg-primary-orange text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-scheme-2-text"
            >
              ×
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: User Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-desktop-heading4 font-heading text-scheme-1-text">
                  About You
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name (Optional)</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="age">Age Range</Label>
                  <select
                    id="age"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    className="w-full p-2 border border-scheme-1-border rounded"
                  >
                    <option value="">Select age range</option>
                    <option value="under-18">Under 18</option>
                    <option value="18-30">18-30</option>
                    <option value="31-50">31-50</option>
                    <option value="51-70">51-70</option>
                    <option value="over-70">Over 70</option>
                  </select>
                </div>

                <div>
                  <Label>How comfortable are you with technology?</Label>
                  <div className="flex space-x-4 mt-2">
                    {[
                      { value: 'beginner', label: 'Beginner' },
                      { value: 'intermediate', label: 'Intermediate' },
                      { value: 'advanced', label: 'Advanced' }
                    ].map(option => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, techComfort: option.value as any }))}
                        className={`px-4 py-2 rounded border transition-colors ${
                          formData.techComfort === option.value
                            ? 'bg-primary-orange text-white border-primary-orange'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>What device are you using?</Label>
                  <div className="flex space-x-4 mt-2">
                    {[
                      { value: 'mobile', label: 'Mobile', icon: Smartphone },
                      { value: 'tablet', label: 'Tablet', icon: Monitor },
                      { value: 'desktop', label: 'Desktop', icon: Monitor }
                    ].map(option => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, device: option.value as any }))}
                        className={`flex items-center px-4 py-2 rounded border transition-colors ${
                          formData.device === option.value
                            ? 'bg-primary-orange text-white border-primary-orange'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <option.icon className="mr-2 h-4 w-4" />
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Ratings */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-desktop-heading4 font-heading text-scheme-1-text">
                  Rate Your Experience
                </h3>
                
                <StarRating
                  label="Overall Experience"
                  rating={formData.overallRating}
                  onRatingChange={(rating) => setFormData(prev => ({ ...prev, overallRating: rating }))}
                />
                
                <StarRating
                  label="Ease of Use & Navigation"
                  rating={formData.usabilityRating}
                  onRatingChange={(rating) => setFormData(prev => ({ ...prev, usabilityRating: rating }))}
                />
                
                <StarRating
                  label="Visual Design & Appearance"
                  rating={formData.designRating}
                  onRatingChange={(rating) => setFormData(prev => ({ ...prev, designRating: rating }))}
                />
                
                <StarRating
                  label="Speed & Performance"
                  rating={formData.performanceRating}
                  onRatingChange={(rating) => setFormData(prev => ({ ...prev, performanceRating: rating }))}
                />
                
                <StarRating
                  label="Text Readability & Accessibility"
                  rating={formData.accessibilityRating}
                  onRatingChange={(rating) => setFormData(prev => ({ ...prev, accessibilityRating: rating }))}
                />
              </div>
            )}

            {/* Step 3: Specific Questions */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-desktop-heading4 font-heading text-scheme-1-text">
                  Specific Questions
                </h3>
                
                <YesNoQuestion
                  question="Was it easy to navigate the website?"
                  value={formData.easyToNavigate}
                  onChange={(value) => setFormData(prev => ({ ...prev, easyToNavigate: value }))}
                />
                
                <YesNoQuestion
                  question="Do you find the design visually appealing?"
                  value={formData.designAppealing}
                  onChange={(value) => setFormData(prev => ({ ...prev, designAppealing: value }))}
                />
                
                <YesNoQuestion
                  question="Did the website load quickly?"
                  value={formData.loadsFast}
                  onChange={(value) => setFormData(prev => ({ ...prev, loadsFast: value }))}
                />
                
                <YesNoQuestion
                  question="Is the text easy to read?"
                  value={formData.textReadable}
                  onChange={(value) => setFormData(prev => ({ ...prev, textReadable: value }))}
                />
                
                <YesNoQuestion
                  question="Are the buttons easy to click/tap?"
                  value={formData.buttonsEasyToClick}
                  onChange={(value) => setFormData(prev => ({ ...prev, buttonsEasyToClick: value }))}
                />
                
                <YesNoQuestion
                  question="Could you easily find the information you were looking for?"
                  value={formData.findInformation}
                  onChange={(value) => setFormData(prev => ({ ...prev, findInformation: value }))}
                />
              </div>
            )}

            {/* Step 4: Comments */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-desktop-heading4 font-heading text-scheme-1-text">
                  Additional Feedback
                </h3>
                
                <div>
                  <Label htmlFor="comments">General Comments</Label>
                  <Textarea
                    id="comments"
                    value={formData.comments}
                    onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
                    placeholder="Share your overall thoughts about the website..."
                    rows={4}
                  />
                </div>
                
                <div>
                  <Label htmlFor="issues">Issues or Problems (one per line)</Label>
                  <Textarea
                    id="issues"
                    value={formData.issues}
                    onChange={(e) => setFormData(prev => ({ ...prev, issues: e.target.value }))}
                    placeholder="List any problems you encountered..."
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="suggestions">Suggestions for Improvement (one per line)</Label>
                  <Textarea
                    id="suggestions"
                    value={formData.suggestions}
                    onChange={(e) => setFormData(prev => ({ ...prev, suggestions: e.target.value }))}
                    placeholder="How can we make the website better?"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-scheme-1-border">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                >
                  Previous
                </Button>
              )}
              
              {currentStep < 4 ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className="ml-auto bg-primary-orange hover:bg-primary-orange-dark"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="ml-auto bg-primary-orange hover:bg-primary-orange-dark"
                >
                  {isSubmitting ? 'Submitting...' : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Feedback
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserFeedbackCollector;
export type { UserFeedback }; 