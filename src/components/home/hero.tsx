'use client';

import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowDown } from 'lucide-react';
import Image from 'next/image';

export default function Hero() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'home-hero');

  const scrollToIdentifier = () => {
    document.getElementById('identifier')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-[60vh] min-h-[400px] sm:h-[70vh] md:h-[80vh] flex items-center justify-center text-center text-white">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          style={{ objectFit: 'cover' }}
          className="brightness-50"
          priority
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="relative z-10 max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl font-headline">
          Unlock the Secrets of Your Plants
        </h1>
        <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto">
          Snap a photo, identify any plant, and get the care guides you need to help them thrive. Your green journey starts here.
        </p>
        <div className="mt-10">
          <Button size="lg" onClick={scrollToIdentifier} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Identify a Plant
            <ArrowDown className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
