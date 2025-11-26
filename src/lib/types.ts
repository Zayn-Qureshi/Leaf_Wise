export interface PlantSuggestion {
  commonName: string;
  scientificName: string;
  confidence: number;
}

export interface Reminder {
  frequency: number; // in days
  lastWatered: number; // timestamp
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
  reminder?: Reminder;
  // AI generated fields
  plantType?: string;
  toxicity?: string;
  growthHabit?: string;
  careSummary?: string;
  suggestions?: PlantSuggestion[];
  origin?: string;
  floweringPeriod?: string;
  propagationTips?: string;
  funFact?: string;
}
