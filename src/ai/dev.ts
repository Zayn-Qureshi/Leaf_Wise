import { config } from 'dotenv';
config();

import '@/ai/flows/diagnose-and-identify-plant-flow.ts';
import '@/ai/flows/suggest-related-plants.ts';
import '@/ai/flows/summarize-care-tips.ts';
import '@/ai/flows/diagnose-plant-health-flow.ts';
