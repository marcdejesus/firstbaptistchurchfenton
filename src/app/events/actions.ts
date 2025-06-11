'use server';

import type { GenerateEventSummaryInput } from '@/types';

export async function generateEventSummaryAction(
  input: GenerateEventSummaryInput
): Promise<{ summary: string } | { error: string }> {
  try {
    // Simple fallback summary generation without AI
    const summary = `Join us for ${input.title} on ${input.date} at ${input.time} in ${input.location}. ${input.description.substring(0, 100)}${input.description.length > 100 ? '...' : ''}`;
    
    return { summary };
  } catch (e) {
    console.error("Summary Generation Error:", e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { error: `Failed to generate summary: ${errorMessage}` };
  }
}
