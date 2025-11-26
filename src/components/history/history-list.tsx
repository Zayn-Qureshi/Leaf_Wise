'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { Leaf, Trash2, Calendar, AlertTriangle } from 'lucide-react';

import useLocalStorage from '@/hooks/use-local-storage';
import { HISTORY_STORAGE_KEY } from '@/lib/constants';
import type { PlantScan } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

export default function HistoryList() {
  const [history, setHistory] = useLocalStorage<PlantScan[]>(HISTORY_STORAGE_KEY, []);

  const handleDelete = (id: string) => {
    setHistory(prevHistory => prevHistory.filter(scan => scan.id !== id));
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
        <Leaf className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-xl font-semibold text-foreground">No History Yet</h3>
        <p className="mt-2 text-base text-muted-foreground">Start identifying plants to see your history here.</p>
        <Button asChild className="mt-6">
          <Link href="/">Identify a Plant</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {history.map(scan => (
        <Card key={scan.id} className="flex flex-col overflow-hidden shadow-md transition-shadow hover:shadow-xl">
          <CardHeader className="p-0">
            <Link href={`/plant/${scan.id}`} className="block">
              <div className="aspect-square relative w-full">
                <Image
                  src={scan.image}
                  alt={scan.commonName}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </Link>
          </CardHeader>
          <CardContent className="flex-grow p-4">
            <Badge variant="secondary" className="mb-2">
              Confidence: {Math.round(scan.confidence * 100)}%
            </Badge>
            <CardTitle className="text-xl font-bold text-primary">
              <Link href={`/plant/${scan.id}`} className="hover:underline">
                {scan.commonName}
              </Link>
            </CardTitle>
            <p className="text-sm text-muted-foreground italic">{scan.scientificName}</p>
          </CardContent>
          <CardFooter className="flex justify-between items-center p-4 bg-muted/50">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formatDistanceToNow(new Date(scan.timestamp), { addSuffix: true })}</span>
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete scan</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the scan for "{scan.commonName}". This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(scan.id)} className="bg-destructive hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
