'use server';
/**
 * @fileOverview A plant health diagnosis AI agent.
 *
 * - diagnosePlantHealth - A function that handles the plant health diagnosis process.
 * - DiagnosePlantHealthInput - The input type for the diagnosePlantHealth function.
 * - DiagnosePlantHealthOutput - The return type for the diagnosePlantHealth function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DiagnosePlantHealthInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A close-up photo of the affected part of a plant (e.g., a leaf), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DiagnosePlantHealthInput = z.infer<typeof DiagnosePlantHealthInputSchema>;

const DiagnosePlantHealthOutputSchema = z.object({
    isHealthy: z.boolean().describe('Whether or not the plant appears to be healthy.'),
    potentialIssues: z.array(z.object({
        issue: z.string().describe("The name of the potential disease, pest, or deficiency (e.g., 'Powdery Mildew', 'Spider Mites', 'Nitrogen Deficiency')."),
        description: z.string().describe("A brief description of the issue and its common symptoms visible in the photo."),
        treatment: z.string().describe("Actionable, step-by-step advice on how to treat the issue. Include organic and chemical treatment options if applicable."),
    })).describe("A list of potential health issues identified from the photo.")
});
export type DiagnosePlantHealthOutput = z.infer<typeof DiagnosePlantHealthOutputSchema>;


export async function diagnosePlantHealth(input: DiagnosePlantHealthInput): Promise<DiagnosePlantHealthOutput> {
  return diagnosePlantHealthFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnosePlantHealthPrompt',
  input: { schema: DiagnosePlantHealthInputSchema },
  output: { schema: DiagnosePlantHealthOutputSchema },
  prompt: `You are an expert plant pathologist. Your task is to analyze the provided image of a plant to identify any signs of disease, pests, or nutrient deficiencies.

Analyze the image provided here: {{media url=photoDataUri}}

Based on your analysis, determine if the plant is healthy. If you identify any issues, provide a list of potential problems. For each problem, include:
1. The name of the issue (e.g., "Powdery Mildew," "Spider Mites," "Iron Deficiency").
2. A description of the issue and its symptoms.
3. A detailed, step-by-step treatment plan.

If the plant in the image appears healthy, state that and return an empty array for potential issues.`,
});

const diagnosePlantHealthFlow = ai.defineFlow(
  {
    name: 'diagnosePlantHealthFlow',
    inputSchema: DiagnosePlantHealthInputSchema,
    outputSchema: DiagnosePlantHealthOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('The AI model failed to return a diagnosis.');
    }
    return output;
  }
);
