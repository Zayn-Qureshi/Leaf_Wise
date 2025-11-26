'use server';
/**
 * @fileOverview A plant problem diagnosis and identification AI agent.
 *
 * - diagnoseAndIdentifyPlant - A function that handles the plant diagnosis and identification process.
 * - DiagnoseAndIdentifyPlantInput - The input type for the diagnoseAndIdentifyPlant function.
 * - DiagnoseAndIdentifyPlantOutput - The return type for the diagnoseAndIdentifyPlant function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input Schema
const DiagnoseAndIdentifyPlantInputSchema = z.object({
  commonName: z.string().describe('The common name of the identified plant.'),
  scientificName: z.string().describe('The scientific name of the plant.'),
});
export type DiagnoseAndIdentifyPlantInput = z.infer<typeof DiagnoseAndIdentifyPlantInputSchema>;

// Output Schema
const DiagnoseAndIdentifyPlantOutputSchema = z.object({
    isHealthy: z.boolean().describe('Whether or not the plant is healthy.'),
    diagnosis: z.string().describe("The diagnosis of the plant's health, including detailed care tips."),
});
export type DiagnoseAndIdentifyPlantOutput = z.infer<typeof DiagnoseAndIdentifyPlantOutputSchema>;

// Genkit Flow
const prompt = ai.definePrompt({
    name: 'diagnosePlantForCareTipsPrompt',
    input: { schema: DiagnoseAndIdentifyPlantInputSchema },
    output: { schema: DiagnoseAndIdentifyPlantOutputSchema },
    prompt: `You are an expert botanist. A plant has been identified as {{commonName}} ({{scientificName}}). 
    
    Based on this identification, provide detailed care instructions. Also, make an assessment of the plant's health based on the initial identification. For the purpose of this tool, assume the plant is healthy unless common issues for this species are obvious.
    
    Your response should be a diagnosis of the plant's health and comprehensive care tips.`,
});
  
const diagnoseAndIdentifyPlantFlow = ai.defineFlow(
  {
    name: 'diagnoseAndIdentifyPlantFlow',
    inputSchema: DiagnoseAndIdentifyPlantInputSchema,
    outputSchema: z.object({
        diagnosis: z.string(),
    }),
  },
  async (input) => {
    const { output } = await prompt(input);
    
    if (!output) {
      throw new Error('Failed to get diagnosis from the AI model.');
    }

    return {
      diagnosis: output.diagnosis,
    };
  }
);


export async function diagnoseAndIdentifyPlant(input: DiagnoseAndIdentifyPlantInput): Promise<{ diagnosis: string }> {
    return diagnoseAndIdentifyPlantFlow(input);
}
