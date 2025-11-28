'use server';

import { diagnoseAndIdentifyPlant } from '@/ai/flows/diagnose-and-identify-plant-flow';
import type { PlantScan, PlantSuggestion } from './types';

export async function identifyPlant(
  imageDataUri: string
): Promise<Omit<PlantScan, 'id' | 'image' | 'timestamp' | 'isFavorite' | 'notes' | 'reminder'>> {
  if (!imageDataUri || !imageDataUri.startsWith('data:image')) {
    throw new Error('A valid image data URI is required for identification.');
  }

  // Directly use Gemini for identification and diagnosis
  const aiResult = await diagnoseAndIdentifyPlant({
    commonName: undefined, // Let AI identify it
    scientificName: undefined,
    photoDataUri: imageDataUri,
  });

  if (!aiResult || !aiResult.plantType) {
    throw new Error('Could not identify the plant from the image.');
  }

  return {
    commonName: aiResult.commonName || 'Unknown Plant',
    scientificName: aiResult.scientificName || 'Unknown Scientific Name',
    confidence: 0.95, // Gemini doesn't return a confidence score like Pl@ntNet, so we assume high confidence if it returns a result
    otherSuggestions: [], // Gemini flow doesn't currently return multiple identification candidates in the same way
    careTips: aiResult.diagnosis,
    careSummary: aiResult.careSummary,
    plantType: aiResult.plantType,
    toxicity: aiResult.toxicity,
    growthHabit: aiResult.growthHabit,
    origin: aiResult.origin,
    floweringPeriod: aiResult.floweringPeriod,
    propagationTips: aiResult.propagationTips,
    funFact: aiResult.funFact,
    suggestions: aiResult.suggestions || [],
  };
}
