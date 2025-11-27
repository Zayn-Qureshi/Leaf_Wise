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
  photoDataUri: z.string().describe('A photo of the plant, as a data URI.'),
});
export type DiagnoseAndIdentifyPlantInput = z.infer<typeof DiagnoseAndIdentifyPlantInputSchema>;

// Output Schema
const DiagnoseAndIdentifyPlantOutputSchema = z.object({
    isHealthy: z.boolean().describe('Whether or not the plant is healthy.'),
    diagnosis: z.string().describe("A detailed diagnosis of the plant's health, including comprehensive care tips covering watering, sunlight, soil, and fertilization."),
    careSummary: z.string().describe("A concise summary of the plant care tips, easy to understand."),
    plantType: z.string().describe("The plant's category (e.g., Indoor, Outdoor, Tree, Shrub, Flower)."),
    toxicity: z.string().describe("Information on the plant's toxicity to humans and pets. State if it's non-toxic."),
    growthHabit: z.string().describe("The typical growth habit of the plant (e.g., Bushy, Vining, Upright)."),
    origin: z.string().describe("The geographical origin or native region of the plant."),
    floweringPeriod: z.string().describe("The typical time of year the plant is expected to flower, if applicable."),
    propagationTips: z.string().describe("Tips on how to propagate the plant."),
    funFact: z.string().describe("An interesting and fun fact about the plant."),
    suggestions: z.array(z.string()).describe('An array of 3-5 visually similar or related plant species names.'),
});
export type DiagnoseAndIdentifyPlantOutput = z.infer<typeof DiagnoseAndIdentifyPlantOutputSchema>;

// Genkit Flow
const prompt = ai.definePrompt({
    name: 'diagnosePlantForCareTipsPrompt',
    input: { schema: DiagnoseAndIdentifyPlantInputSchema },
    output: { schema: DiagnoseAndIdentifyPlantOutputSchema },
    prompt: `You are an expert botanist. A plant has been identified as {{commonName}} ({{scientificName}}). 
    
    Based on this identification and the provided photo, provide the following information:
    1. A detailed diagnosis of the plant's health and comprehensive care tips (watering, sunlight, soil, fertilization).
    2. A concise, easy-to-understand summary of the care tips.
    3. The plant's type or category (e.g., Indoor, Outdoor, Tree, Shrub, Flower).
    4. Toxicity information for pets and humans.
    5. The plant's typical growth habit (e.g., Bushy, Vining, Upright).
    6. The geographical origin of the plant.
    7. The plant's typical flowering period.
    8. Tips on how to propagate the plant.
    9. A fun, interesting fact about the plant.
    10. A list of 3-5 other visually similar plants or plants that are often found in the same family or environment.

    Photo: {{media url=photoDataUri}}

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
