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
    diagnosis: z.string().describe("A detailed diagnosis of the plant's health, including comprehensive care tips covering watering, sunlight, soil, and fertilization."),
    plantType: z.string().describe("The plant's category (e.g., Indoor, Outdoor, Tree, Shrub, Flower)."),
    toxicity: z.string().describe("Information on the plant's toxicity to humans and pets. State if it's non-toxic."),
    growthHabit: z.string().describe("The typical growth habit of the plant (e.g., Bushy, Vining, Upright)."),
});
export type DiagnoseAndIdentifyPlantOutput = z.infer<typeof DiagnoseAndIdentifyPlantOutputSchema>;

// Genkit Flow
const prompt = ai.definePrompt({
    name: 'diagnosePlantForCareTipsPrompt',
    input: { schema: DiagnoseAndIdentifyPlantInputSchema },
    output: { schema: DiagnoseAndIdentifyPlantOutputSchema },
    prompt: `You are an expert botanist. A plant has been identified as {{commonName}} ({{scientificName}}). 
    
    Based on this identification, provide the following information:
    1. A detailed diagnosis of the plant's health and comprehensive care tips (watering, sunlight, soil, fertilization).
    2. The plant's type or category (e.g., Indoor, Outdoor, Tree, Shrub, Flower).
    3. Toxicity information for pets and humans.
    4. The plant's typical growth habit (e.g., Bushy, Vining, Upright).

    For the health assessment, assume the plant is healthy unless common issues for this species are obvious.
    `,
});
  
const diagnoseAndIdentifyPlantFlow = ai.defineFlow(
  {
    name: 'diagnoseAndIdentifyPlantFlow',
    inputSchema: DiagnoseAndIdentifyPlantInputSchema,
    outputSchema: DiagnoseAndIdentifyPlantOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    
    if (!output) {
      throw new Error('Failed to get diagnosis from the AI model.');
    }

    return output;
  }
);


export async function diagnoseAndIdentifyPlant(input: DiagnoseAndIdentifyPlantInput): Promise<DiagnoseAndIdentifyPlantOutput> {
    return diagnoseAndIdentifyPlantFlow(input);
}
