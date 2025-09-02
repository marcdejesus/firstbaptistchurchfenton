import React from 'react';

/**
 * Formats text description preserving original line breaks and paragraph structure
 * @param description - The raw text description from the database
 * @param className - Optional CSS classes to apply to paragraphs
 * @returns Array of JSX elements with proper formatting
 */
export function formatDescription(description: string, className?: string): JSX.Element[] {
  if (!description) return [];

  // Split by double line breaks for paragraphs
  const paragraphs = description.split(/\n\s*\n/).filter(para => para.trim().length > 0);
  
  return paragraphs.map((paragraph, index) => {
    // Within each paragraph, convert single line breaks to <br/> tags
    const lines = paragraph.split('\n').filter(line => line.trim().length > 0);
    
    return (
      <p key={index} className={`mb-4 last:mb-0 ${className || ''}`}>
        {lines.map((line, lineIndex) => (
          <React.Fragment key={lineIndex}>
            {line.trim()}
            {lineIndex < lines.length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
    );
  });
}

/**
 * Converts a description to plain text for truncation purposes
 * @param description - The raw text description
 * @param maxLength - Maximum length before truncation
 * @returns Formatted plain text
 */
export function formatDescriptionAsPlainText(description: string, maxLength?: number): string {
  if (!description) return '';
  
  // Replace multiple line breaks with single spaces for plain text display
  const plainText = description.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
  
  if (maxLength && plainText.length > maxLength) {
    return plainText.substring(0, maxLength).trim() + '...';
  }
  
  return plainText;
}
