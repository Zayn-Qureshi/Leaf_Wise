'use server';

import type { PlantScan } from './types';

export async function identifyPlant(
  imageDataUri: string
): Promise<Omit<PlantScan, 'id' | 'image' | 'timestamp'>> {
  // In a real app, this would call an external Plant ID API with the image data.
  // We simulate the API call and return mock data.
  
  console.log('Identifying plant...');
  await new Promise(resolve => setTimeout(resolve, 2500)); // Simulate network delay

  if (!imageDataUri || !imageDataUri.startsWith('data:image')) {
    throw new Error('A valid image data URI is required for identification.');
  }

  // This is a mock response.
  // A real implementation could have more complex logic or call a Genkit flow.
  return {
    commonName: 'Swiss Cheese Plant',
    scientificName: 'Monstera deliciosa',
    confidence: 0.92,
    careTips: `Watering: Water every 1-2 weeks, allowing soil to dry out between waterings. Increase frequency with increased light.
Light: Thrives in bright to medium indirect light. Not suited for intense, direct sun.
Temperature: Prefers warm, humid conditions between 65-85°F (18-30°C). Keep away from drafts.
Soil: Use a well-draining peat-based potting mix.
Fertilizer: Feed every month during the growing season (spring/summer) with a balanced liquid fertilizer. Reduce to every other month in fall and winter.
Pruning: Prune to maintain size and shape. You can remove yellow or damaged leaves as they appear.`,
  };
}
