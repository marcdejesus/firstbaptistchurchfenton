import type { ContentModerationResult } from '@/types';

// Basic list of inappropriate words to filter
// This is a simple implementation - in production you'd want a more comprehensive system
const inappropriateWords = [
  'damn', 'hell', 'shit', 'fuck', 'bitch', 'ass', 'bastard', 'crap',
  'piss', 'slut', 'whore', 'dick', 'cock', 'pussy', 'tits', 'boobs',
  'nigger', 'faggot', 'retard', 'gay', 'lesbian', 'homo', 'queer',
  'kill', 'die', 'death', 'murder', 'suicide', 'hate', 'nazi', 
  'terrorist', 'bomb', 'weapon', 'drug', 'cocaine', 'marijuana',
  // Add more words as needed
];

/**
 * Moderates content by checking for inappropriate words
 * Returns cleaned content with flagged words replaced with asterisks
 */
export function moderateContent(content: string): ContentModerationResult {
  if (!content || content.trim().length === 0) {
    return {
      isClean: true,
      flaggedWords: [],
      cleanedContent: content
    };
  }

  const words = content.toLowerCase().split(/\s+/);
  const flaggedWords: string[] = [];
  let cleanedContent = content;

  // Check each word against our inappropriate words list
  inappropriateWords.forEach(badWord => {
    const regex = new RegExp(`\\b${badWord}\\b`, 'gi');
    if (regex.test(content)) {
      flaggedWords.push(badWord);
      // Replace with asterisks of same length
      const replacement = '*'.repeat(badWord.length);
      cleanedContent = cleanedContent.replace(regex, replacement);
    }
  });

  return {
    isClean: flaggedWords.length === 0,
    flaggedWords,
    cleanedContent
  };
}

/**
 * Checks if content contains excessive caps (might indicate shouting)
 */
export function hasExcessiveCaps(content: string): boolean {
  if (!content || content.length < 10) return false;
  
  const uppercaseCount = (content.match(/[A-Z]/g) || []).length;
  const letterCount = (content.match(/[a-zA-Z]/g) || []).length;
  
  if (letterCount === 0) return false;
  
  const capsPercentage = uppercaseCount / letterCount;
  return capsPercentage > 0.5; // More than 50% caps
}

/**
 * Checks if content contains suspicious patterns (URLs, emails, phone numbers)
 * that might be spam
 */
export function containsSuspiciousPatterns(content: string): boolean {
  const patterns = [
    // URLs
    /https?:\/\/[^\s]+/gi,
    // Email addresses
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi,
    // Phone numbers (various formats)
    /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/gi,
    // Repeated characters (might be spam)
    /(.)\1{4,}/gi
  ];

  return patterns.some(pattern => pattern.test(content));
}

/**
 * Comprehensive content validation for forum posts
 */
export function validateForumContent(content: string, title?: string): {
  isValid: boolean;
  warnings: string[];
  cleanedContent: string;
  cleanedTitle?: string;
} {
  const warnings: string[] = [];
  
  // Moderate main content
  const contentResult = moderateContent(content);
  let cleanedContent = contentResult.cleanedContent;
  
  // Moderate title if provided
  let cleanedTitle = title;
  if (title) {
    const titleResult = moderateContent(title);
    cleanedTitle = titleResult.cleanedContent;
    
    if (titleResult.flaggedWords.length > 0) {
      warnings.push(`Title contains inappropriate language: ${titleResult.flaggedWords.join(', ')}`);
    }
  }
  
  // Check for various issues
  if (contentResult.flaggedWords.length > 0) {
    warnings.push(`Content contains inappropriate language: ${contentResult.flaggedWords.join(', ')}`);
  }
  
  if (hasExcessiveCaps(content)) {
    warnings.push('Content contains excessive capital letters (appears to be shouting)');
  }
  
  if (containsSuspiciousPatterns(content)) {
    warnings.push('Content contains suspicious patterns (URLs, emails, or spam-like text)');
  }
  
  if (content.trim().length < 10) {
    warnings.push('Content is too short (minimum 10 characters)');
  }
  
  if (content.length > 5000) {
    warnings.push('Content is too long (maximum 5000 characters)');
  }

  return {
    isValid: warnings.length === 0,
    warnings,
    cleanedContent,
    cleanedTitle
  };
} 