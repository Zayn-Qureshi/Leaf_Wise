'use server';

import { diagnosePlant } from '@/ai/flows/diagnose-plant-flow';
import type { PlantScan } from './types';

export async function identifyPlant(
  imageDataUri: string
): Promise<Omit<PlantScan, 'id' | 'image' | 'timestamp'>> {
  
  console.log('Identifying plant...');

  if (!imageDataUri || !imageDataUri.startsWith('data:image')) {
    throw new Error('A valid image data URI is required for identification.');
  }

  // This is a mock response.
  // A real implementation could have more complex logic or call a Genkit flow.
  const result = await diagnosePlant({
    photoDataUri: imageDataUri,
    description: "A plant that needs identification and diagnosis."
  })

  return {
    commonName: result.identification.commonName,
    scientificName: result.identification.latinName,
    confidence: result.identification.isPlant ? 0.95 : 0.2, // Mock confidence
    careTips: result.diagnosis.diagnosis,
  };
}
