'use server';

import { diagnosePlant } from '@/ai/flows/diagnose-plant-flow';
import type { PlantScan } from './types';

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
      throw new Error(`Pl@ntNet API request failed: ${response.statusText} - ${errorText}`);
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
  } catch (error) {
    console.error('Error identifying with Pl@ntNet:', error);
    throw new Error('Failed to identify plant with Pl@ntNet.');
  }
}

export async function identifyPlant(
  imageDataUri: string
): Promise<Omit<PlantScan, 'id' | 'image' | 'timestamp'>> {
  
  console.log('Identifying plant with Pl@ntNet...');

  if (!imageDataUri || !imageDataUri.startsWith('data:image')) {
    throw new Error('A valid image data URI is required for identification.');
  }

  const identificationResult = await identifyWithPlantNet(imageDataUri);

  const diagnosisResult = await diagnosePlant({
    photoDataUri: imageDataUri,
    description: `The plant has been identified as ${identificationResult.commonName} (${identificationResult.scientificName}). Now, provide care tips for this plant.`,
  });

  return {
    ...identificationResult,
    careTips: diagnosisResult.diagnosis.diagnosis,
  };
}