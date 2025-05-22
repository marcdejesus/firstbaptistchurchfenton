// This file is machine-generated - edit at your own risk.
'use server';
/**
 * @fileOverview Generates a concise summary of an event based on its details.
 *
 * - generateEventSummary - A function that generates the event summary.
 * - GenerateEventSummaryInput - The input type for the generateEventSummary function.
 * - GenerateEventSummaryOutput - The return type for the generateEventSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEventSummaryInputSchema = z.object({
  title: z.string().describe('The title of the event.'),
  date: z.string().describe('The date of the event (e.g., YYYY-MM-DD).'),
  time: z.string().describe('The time of the event (e.g., HH:MM AM/PM).'),
  location: z.string().describe('The location of the event.'),
  description: z.string().describe('A detailed description of the event.'),
});
export type GenerateEventSummaryInput = z.infer<typeof GenerateEventSummaryInputSchema>;

const GenerateEventSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the event.'),
});
export type GenerateEventSummaryOutput = z.infer<typeof GenerateEventSummaryOutputSchema>;

export async function generateEventSummary(input: GenerateEventSummaryInput): Promise<GenerateEventSummaryOutput> {
  return generateEventSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'eventSummaryPrompt',
  input: {schema: GenerateEventSummaryInputSchema},
  output: {schema: GenerateEventSummaryOutputSchema},
  prompt: `You are an expert event summarizer. Your task is to create a concise and informative summary of an event based on the provided details.

Event Title: {{title}}
Date: {{date}}
Time: {{time}}
Location: {{location}}
Description: {{description}}

Summary:`, // Keep the summary concise and focused on the key details.
});

const generateEventSummaryFlow = ai.defineFlow(
  {
    name: 'generateEventSummaryFlow',
    inputSchema: GenerateEventSummaryInputSchema,
    outputSchema: GenerateEventSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
