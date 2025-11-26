import Hero from '@/components/home/hero';
import PlantIdentifier from '@/components/home/plant-identifier';
import { Leaf, Sparkles, Sprout } from 'lucide-react';

const features = [
  {
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    title: 'Instant Identification',
    description: 'Use your camera to identify any plant in seconds with our powerful AI.',
  },
  {
    icon: <Sprout className="h-8 w-8 text-primary" />,
    title: 'Detailed Care Guides',
    description: 'Get personalized care instructions to help your plants thrive.',
  },
  {
    icon: <Leaf className="h-8 w-8 text-primary" />,
    title: 'Personal Plant Diary',
    description: 'Keep a record of all your identified plants in your personal collection.',
  },
];

export default function Home() {
  return (
    <>
      <Hero />
      <section id="features" className="py-16 sm:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl font-headline">
              Everything You Need to Grow
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              LeafWise is more than just an identifier. It's your partner in plant care.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="identifier" className="py-16 sm:py-24 bg-muted/30">
        <PlantIdentifier />
      </section>
    </>
  );
}
