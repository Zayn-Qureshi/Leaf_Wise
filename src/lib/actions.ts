'use server';

import { diagnoseAndIdentifyPlant } from '@/ai/flows/diagnose-and-identify-plant-flow';
import type { PlantScan } from './types';

async function callPlantNetApi(imageDataUri: string) {
  const apiKey = process.env.PLANTNET_API_KEY;
  if (!apiKey) {
    throw new Error('Pl@ntNet API key is not configured.');
  }
  const apiUrl = `https://my-api.plantnet.org/v2/identify/all?api-key=${apiKey}`;
  
  const base64Data = imageDataUri.split(',')[1];
  if (!base64Data) {
      throw new Error('Invalid image data URI provided.');
  }

  const requestBody = {
      images: [base64Data],
      organs: ['leaf', 'flower', 'fruit', 'bark']
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Pl@ntNet API Error: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Pl@ntNet API request failed: ${response.statusText}.`);
    }

    const data = await response.json();
    return data;

  } catch (error: any) {
    console.error('Error calling Pl@ntNet API:', error);
    throw new Error(`Failed to get response from Pl@ntNet: ${error.message}`);
  }
}

export async function identifyPlant(
  imageDataUri: string
): Promise<Omit<PlantScan, 'id' | 'image' | 'timestamp'>> {
  
  if (!imageDataUri || !imageDataUri.startsWith('data:image')) {
    throw new Error('A valid image data URI is required for identification.');
  }

  const plantNetResult = await callPlantNetApi(imageDataUri);

  const bestMatch = plantNetResult?.results?.[0];
  if (!bestMatch) {
    throw new Error('Could not identify the plant from the image.');
  }

  const identification = {
    commonName: bestMatch.species.commonNames?.[0] || 'Unknown',
    scientificName: bestMatch.species.scientificNameWithoutAuthor,
    confidence: bestMatch.score,
  };

  const aiResult = await diagnoseAndIdentifyPlant({
    commonName: identification.commonName,
    scientificName: identification.scientificName,
  });

  return {
    ...identification,
    careTips: aiResult.diagnosis,
    plantType: aiResult.plantType,
    toxicity: aiResult.toxicity,
    growthHabit: aiResult.growthHabit,
  };
}
