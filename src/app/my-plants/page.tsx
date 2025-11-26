import MyPlantsGrid from '@/components/my-plants/my-plants-grid';

export const metadata = {
  title: 'My Plants - LeafWise',
};

export default function MyPlantsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl font-headline">
          My Favorite Plants
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          A collection of all the plants you've favorited.
        </p>
      </div>
      <MyPlantsGrid />
    </div>
  );
}
