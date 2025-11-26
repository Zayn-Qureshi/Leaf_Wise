import { suggestRelatedPlants } from "@/ai/flows/suggest-related-plants";
import { ListTree, Flower2 } from "lucide-react";

export default async function RelatedPlants({ plantName, photoDataUri }: { plantName: string, photoDataUri: string }) {
  const { suggestions } = await suggestRelatedPlants({ plantName, photoDataUri });

  return (
    <div>
      <h3 className="font-semibold text-lg mb-2 flex items-center gap-2 text-foreground/80">
        <ListTree className="h-5 w-5 text-accent"/>
        Related Plants
      </h3>
      <ul className="space-y-2">
        {suggestions.map((plant, index) => (
          <li key={index} className="flex items-center gap-3">
            <Flower2 className="h-4 w-4 text-primary/70"/>
            <span className="text-foreground/90">{plant}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
