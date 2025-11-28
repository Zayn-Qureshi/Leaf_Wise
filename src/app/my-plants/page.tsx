import MyPlantsGrid from '@/components/my-plants/my-plants-grid';

export const metadata = {
  title: 'My Plants - LeafWise',
};

export default function MyPlantsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12 text-center relative">
        <div className="absolute inset-0 gradient-subtle rounded-3xl blur-3xl opacity-30 -z-10" />
        <div className="relative py-8 px-4">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl font-headline mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            My Favorite Plants
          </h1>
          <p className="mt-3 text-xl text-muted-foreground max-w-2xl mx-auto">
            Your personal collection of beloved plants, all in one place.
          </p>
        </div>
      </div>
      <MyPlantsGrid />
    </div>
  );
}
