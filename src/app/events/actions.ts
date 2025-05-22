'use server';

import { generateEventSummary as aiGenerateEventSummary } from '@/ai/flows/event-summary-generator';
import type { GenerateEventSummaryInput } from '@/types';

export async function generateEventSummaryAction(
  input: GenerateEventSummaryInput
): Promise<{ summary: string } | { error: string }> {
  try {
    // Validate input here if necessary, though Zod in the flow should handle it
    const result = await aiGenerateEventSummary(input);
    return { summary: result.summary };
  } catch (e) {
    console.error("AI Summary Generation Error:", e);
    // Check if e is an Error instance to safely access message
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { error: `Failed to generate summary: ${errorMessage}` };
  }
}
