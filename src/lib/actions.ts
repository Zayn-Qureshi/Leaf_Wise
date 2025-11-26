'use server';

import { diagnoseAndIdentifyPlant } from '@/ai/flows/diagnose-and-identify-plant-flow';
import type { PlantScan } from './types';


export async function identifyPlant(
  imageDataUri: string
): Promise<Omit<PlantScan, 'id' | 'image' | 'timestamp'>> {
  
  if (!imageDataUri || !imageDataUri.startsWith('data:image')) {
    throw new Error('A valid image data URI is required for identification.');
  }

  const result = await diagnoseAndIdentifyPlant({
    photoDataUri: imageDataUri,
  });

  return {
    commonName: result.identification.commonName,
    scientificName: result.identification.scientificName,
    confidence: result.identification.confidence,
    careTips: result.diagnosis.diagnosis,
  };
}
