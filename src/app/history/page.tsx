import HistoryList from '@/components/history/history-list';

export const metadata = {
  title: 'Scan History - LeafWise',
};

export default function HistoryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12 text-center relative">
        <div className="absolute inset-0 gradient-subtle rounded-3xl blur-3xl opacity-30 -z-10" />
        <div className="relative py-8 px-4">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl font-headline mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Your Plant Diary
          </h1>
          <p className="mt-3 text-xl text-muted-foreground max-w-2xl mx-auto">
            A beautiful collection of all the plants you've identified on your journey.
          </p>
        </div>
      </div>
      <HistoryList />
    </div>
  );
}
