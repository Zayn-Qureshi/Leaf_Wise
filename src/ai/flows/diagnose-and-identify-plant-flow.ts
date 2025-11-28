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
  commonName: z.string().optional().describe('The common name of the identified plant (optional).'),
  scientificName: z.string().optional().describe('The scientific name of the plant (optional).'),
  photoDataUri: z.string().describe('A photo of the plant, as a data URI.'),
});
export type DiagnoseAndIdentifyPlantInput = z.infer<typeof DiagnoseAndIdentifyPlantInputSchema>;

// Output Schema
const DiagnoseAndIdentifyPlantOutputSchema = z.object({
  commonName: z.string().describe('The common name of the identified plant.'),
  scientificName: z.string().describe('The scientific name of the plant.'),
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
  prompt: `You are an expert botanist. 
    
    Identify the plant in the provided photo. If a common name and scientific name are provided, use them as a hint, but verify them against the image.
    
    {{#if commonName}}
    Hint: The user thinks this is {{commonName}} ({{scientificName}}).
    {{/if}}

    Based on the image and identification, provide the following information:
    1. The Common Name of the plant.
    2. The Scientific Name of the plant.
    3. A detailed diagnosis of the plant's health and comprehensive care tips (watering, sunlight, soil, fertilization).
    4. A concise, easy-to-understand summary of the care tips.
    5. The plant's type or category (e.g., Indoor, Outdoor, Tree, Shrub, Flower).
    6. Toxicity information for pets and humans.
    7. The plant's typical growth habit (e.g., Bushy, Vining, Upright).
    8. The geographical origin of the plant.
    9. The plant's typical flowering period.
    10. Tips on how to propagate the plant.
    11. A fun, interesting fact about the plant.
    12. A list of 3-5 other visually similar plants or plants that are often found in the same family or environment.

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
