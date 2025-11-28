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
      <div className="mb-12 text-center relative">
        <div className="absolute inset-0 gradient-subtle rounded-3xl blur-3xl opacity-30 -z-10" />
        <div className="relative py-8 px-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Leaf className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl font-headline bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Discover New Plants
            </h1>
          </div>
          <p className="mt-3 text-xl text-muted-foreground max-w-2xl mx-auto">
            Get inspired by our curated collection of beautiful plants from around the world.
          </p>
        </div>
      </div>

      <PlantGrid plants={discoverPlants} />
    </div>
  );
}
