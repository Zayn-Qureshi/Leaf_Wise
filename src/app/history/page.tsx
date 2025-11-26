import HistoryList from '@/components/history/history-list';

export const metadata = {
  title: 'Scan History - LeafWise',
};

export default function HistoryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl font-headline">
          Your Plant Diary
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          A collection of all the plants you've identified.
        </p>
      </div>
      <HistoryList />
    </div>
  );
}
