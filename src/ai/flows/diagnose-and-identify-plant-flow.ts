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
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DiagnoseAndIdentifyPlantInput = z.infer<typeof DiagnoseAndIdentifyPlantInputSchema>;

// Output Schema
const DiagnoseAndIdentifyPlantOutputSchema = z.object({
  identification: z.object({
    commonName: z.string().describe('The common name of the identified plant.'),
    scientificName: z.string().describe('The scientific name of the plant.'),
    confidence: z.number().describe('The confidence score of the identification (0-1).'),
  }),
  diagnosis: z.object({
    isHealthy: z.boolean().describe('Whether or not the plant is healthy.'),
    diagnosis: z.string().describe("The diagnosis of the plant's health, including detailed care tips."),
  }),
});
export type DiagnoseAndIdentifyPlantOutput = z.infer<typeof DiagnoseAndIdentifyPlantOutputSchema>;


// Pl@ntNet API call
async function identifyWithPlantNet(
    imageDataUri: string
  ): Promise<{ commonName: string; scientificName: string; confidence: number }> {
    const apiKey = process.env.PLANTNET_API_KEY;
    if (!apiKey) {
      throw new Error('Pl@ntNet API key is not configured.');
    }
  
    const apiUrl = `https://my-api.plantnet.org/v2/identify/all?api-key=${apiKey}`;
  
    const formData = new FormData();
    const blob = await fetch(imageDataUri).then(res => res.blob());
    formData.append('images', blob, 'plant.jpg');
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Pl@ntNet API Error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Pl@ntNet API request failed: ${response.statusText}. ${errorText}`);
      }
  
      const data = await response.json();
      const bestMatch = data.bestMatch;
  
      if (!bestMatch) {
        throw new Error('No plant could be identified from the image.');
      }
  
      return {
        commonName: bestMatch.commonNames?.[0] || 'Unknown',
        scientificName: bestMatch.species.scientificNameWithoutAuthor,
        confidence: bestMatch.score,
      };
    } catch (error: any) {
      console.error('Error identifying with Pl@ntNet:', error);
      throw new Error(`Failed to identify plant with Pl@ntNet: ${error.message}`);
    }
}


// Genkit Flow
const prompt = ai.definePrompt({
    name: 'diagnosePlantForCareTipsPrompt',
    input: { schema: z.object({ plantName: z.string(), scientificName: z.string() }) },
    output: { schema: DiagnoseAndIdentifyPlantOutputSchema.shape.diagnosis },
    prompt: `You are an expert botanist. A plant has been identified as {{plantName}} ({{scientificName}}). 
    
    Based on this identification, provide detailed care instructions. Also, make an assessment of the plant's health based on the initial identification. For the purpose of this tool, assume the plant is healthy unless common issues for this species are obvious.
    
    Your response should be a diagnosis of the plant's health and comprehensive care tips.`,
});
  
const diagnoseAndIdentifyPlantFlow = ai.defineFlow(
  {
    name: 'diagnoseAndIdentifyPlantFlow',
    inputSchema: DiagnoseAndIdentifyPlantInputSchema,
    outputSchema: DiagnoseAndIdentifyPlantOutputSchema,
  },
  async (input) => {
    const identificationResult = await identifyWithPlantNet(input.photoDataUri);

    const { output } = await prompt({
        plantName: identificationResult.commonName,
        scientificName: identificationResult.scientificName,
    });

    if (!output) {
      throw new Error('Failed to get diagnosis from the AI model.');
    }

    return {
      identification: identificationResult,
      diagnosis: output,
    };
  }
);


export async function diagnoseAndIdentifyPlant(input: DiagnoseAndIdentifyPlantInput): Promise<DiagnoseAndIdentifyPlantOutput> {
    return diagnoseAndIdentifyPlantFlow(input);
}
