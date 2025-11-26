export interface PlantSuggestion {
  commonName: string;
  scientificName: string;
  confidence: number;
}

export interface PlantScan {
  id: string;
  image: string; // data URI
  timestamp: number;
  commonName: string;
  scientificName: string;
  confidence: number;
  careTips: string;
  isFavorite?: boolean;
  notes?: string;
  // AI generated fields
  plantType?: string;
  toxicity?: string;
  growthHabit?: string;
  careSummary?: string;
  suggestions?: PlantSuggestion[];
}
