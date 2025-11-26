'use server';

/**
 * @fileOverview Summarizes plant care tips from the Plant-ID API.
 *
 * - summarizeCareTips - A function that summarizes plant care tips.
 * - SummarizeCareTipsInput - The input type for the summarizeCareTips function.
 * - SummarizeCareTipsOutput - The return type for the summarizeCareTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeCareTipsInputSchema = z.object({
  careTips: z
    .string()
    .describe('The care tips for the plant, as provided by the Plant-ID API.'),
});
export type SummarizeCareTipsInput = z.infer<typeof SummarizeCareTipsInputSchema>;

const SummarizeCareTipsOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise summary of the plant care tips, easy to understand.'),
});
export type SummarizeCareTipsOutput = z.infer<typeof SummarizeCareTipsOutputSchema>;

export async function summarizeCareTips(input: SummarizeCareTipsInput): Promise<SummarizeCareTipsOutput> {
  return summarizeCareTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeCareTipsPrompt',
  input: {schema: SummarizeCareTipsInputSchema},
  output: {schema: SummarizeCareTipsOutputSchema},
  prompt: `You are an expert horticulturalist. Please summarize the following plant care tips into a concise and easy-to-understand format. 

Care Tips: {{{careTips}}}`,
});

const summarizeCareTipsFlow = ai.defineFlow(
  {
    name: 'summarizeCareTipsFlow',
    inputSchema: SummarizeCareTipsInputSchema,
    outputSchema: SummarizeCareTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
