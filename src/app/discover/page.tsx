import { PlantGrid } from '@/components/discover/plant-grid';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Leaf } from 'lucide-react';

export const metadata = {
  title: 'Discover Plants - LeafWise',
  description: 'Explore a variety of beautiful plants from around the world.',
};

export default function DiscoverPage() {
  const discoverPlants = PlaceHolderImages.filter(p => p.id !== 'home-hero');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl font-headline">
          Discover New Plants
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Get inspired by our curated collection of beautiful plants.
        </p>
      </div>

      <PlantGrid plants={discoverPlants} />
    </div>
  );
}
