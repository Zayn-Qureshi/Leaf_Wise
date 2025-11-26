export interface PlantScan {
  id: string;
  image: string; // data URI
  timestamp: number;
  commonName: string;
  scientificName: string;
  confidence: number;
  careTips: string;
  // AI generated fields
  careSummary?: string;
  suggestions?: string[];
}
