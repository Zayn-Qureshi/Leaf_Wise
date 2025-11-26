'use client';

import { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, HelpCircle, Leaf, Percent, BrainCircuit } from 'lucide-react';
import { format } from 'date-fns';

import useLocalStorage from '@/hooks/use-local-storage';
import type { PlantScan } from '@/lib/types';
import { HISTORY_STORAGE_KEY } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import CareSummary from './care-summary';
import RelatedPlants from './related-plants';

export default function PlantDetailsView({ id }: { id: string }) {
  const [history] = useLocalStorage<PlantScan[]>(HISTORY_STORAGE_KEY, []);
  const [scan, setScan] = useState<PlantScan | null | undefined>(undefined);

  useEffect(() => {
    const foundScan = history.find(s => s.id === id);
    setScan(foundScan || null);
  }, [id, history]);

  if (scan === undefined) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-[60vh] w-full" />
      </div>
    );
  }

  if (scan === null) {
    return (
      <div className="container mx-auto flex h-[80vh] flex-col items-center justify-center text-center">
        <HelpCircle className="h-16 w-16 text-destructive" />
        <h1 className="mt-4 text-3xl font-bold">Scan Not Found</h1>
        <p className="mt-2 text-lg text-muted-foreground">The plant scan you're looking for doesn't exist or has been deleted.</p>
        <Button asChild className="mt-6">
          <Link href="/history">Back to History</Link>
        </Button>
      </div>
    );
  }
  
  const confidenceValue = Math.round(scan.confidence * 100);

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <Button asChild variant="outline">
          <Link href="/history">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to History
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="overflow-hidden shadow-lg">
            <div className="aspect-square relative w-full">
              <Image src={scan.image} alt={scan.commonName} fill style={{ objectFit: 'cover' }} />
            </div>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <BrainCircuit className="text-primary"/>
                AI Generated Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
               <Suspense fallback={<InfoCardSkeleton title="Care Summary" />}>
                 <CareSummary careTips={scan.careTips} />
               </Suspense>
               <Suspense fallback={<InfoCardSkeleton title="Related Plants" />}>
                 <RelatedPlants plantName={scan.commonName} photoDataUri={scan.image} />
               </Suspense>
            </CardContent>
          </Card>

        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h1 className="text-3xl font-bold text-primary font-headline">{scan.commonName}</h1>
              <p className="text-lg text-muted-foreground italic">{scan.scientificName}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-muted-foreground">
                <Calendar className="mr-2 h-5 w-5" />
                <span>Identified on {format(new Date(scan.timestamp), 'MMMM d, yyyy')}</span>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-foreground flex items-center gap-1.5"><Percent className="h-4 w-4"/> Confidence</span>
                  <span className="text-sm font-bold text-primary">{confidenceValue}%</span>
                </div>
                <Progress value={confidenceValue} aria-label={`${confidenceValue}% confidence`} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><Leaf className="text-primary"/> Full Care Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap font-body text-foreground">
                {scan.careTips}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

const InfoCardSkeleton = ({title}: {title: string}) => (
  <div>
    <h3 className="font-semibold text-lg mb-2 text-foreground/80">{title}</h3>
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  </div>
);
