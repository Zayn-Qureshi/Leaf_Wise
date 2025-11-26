'use server';

/**
 * @fileOverview Provides suggestions for visually similar or related plant species.
 *
 * - suggestRelatedPlants - A function that suggests related plant species based on an input image.
 * - SuggestRelatedPlantsInput - The input type for the suggestRelatedPlants function.
 * - SuggestRelatedPlantsOutput - The return type for the suggestRelatedPlants function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRelatedPlantsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
  plantName: z.string().describe('The common name of the identified plant.'),
});
export type SuggestRelatedPlantsInput = z.infer<typeof SuggestRelatedPlantsInputSchema>;

const SuggestRelatedPlantsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of suggested related plant species names.'),
});
export type SuggestRelatedPlantsOutput = z.infer<typeof SuggestRelatedPlantsOutputSchema>;

export async function suggestRelatedPlants(input: SuggestRelatedPlantsInput): Promise<SuggestRelatedPlantsOutput> {
  return suggestRelatedPlantsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRelatedPlantsPrompt',
  input: {schema: SuggestRelatedPlantsInputSchema},
  output: {schema: SuggestRelatedPlantsOutputSchema},
  prompt: `You are a botanical expert. Given a plant and its photo, suggest other visually similar plants or plants that are often found in the same family or environment as the given plant.

Plant Name: {{{plantName}}}
Photo: {{media url=photoDataUri}}

Suggestions:`,
});

const suggestRelatedPlantsFlow = ai.defineFlow(
  {
    name: 'suggestRelatedPlantsFlow',
    inputSchema: SuggestRelatedPlantsInputSchema,
    outputSchema: SuggestRelatedPlantsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
