'use client';

import type { ImagePlaceholder } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function PlantGrid({ plants }: { plants: ImagePlaceholder[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {plants.map(plant => (
        <Card key={plant.id} className="overflow-hidden shadow-md card-hover border-primary/10 group">
          <CardHeader className="p-0">
            <div className="aspect-square relative w-full">
              <Image
                src={plant.imageUrl}
                alt={plant.description}
                fill
                style={{ objectFit: 'cover' }}
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <CardTitle className="text-lg font-bold text-primary capitalize">
              {plant.imageHint}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{plant.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
