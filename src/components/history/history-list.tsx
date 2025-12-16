'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { Leaf, Trash2, Calendar, Star, AlertTriangle } from 'lucide-react';

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
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function HistoryList() {
  const [history, setHistory] = useLocalStorage<PlantScan[]>(HISTORY_STORAGE_KEY, []);
  const { toast } = useToast();

  const handleDelete = (id: string) => {
    setHistory(prevHistory => prevHistory.filter(scan => scan.id !== id));
  };

  const toggleFavorite = (id: string) => {
    const newHistory = history.map(scan => {
      if (scan.id === id) {
        const updatedScan = { ...scan, isFavorite: !scan.isFavorite };
        toast({
          title: updatedScan.isFavorite ? 'Added to Favorites' : 'Removed from Favorites',
          description: `${updatedScan.commonName} has been ${updatedScan.isFavorite ? 'added to' : 'removed from'} your favorites.`,
        });
        return updatedScan;
      }
      return scan;
    });
    setHistory(newHistory);
  };


  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/30 p-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 gradient-subtle opacity-20" />
        <div className="relative z-10">
          <div className="mx-auto h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Leaf className="h-12 w-12 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-3">No History Yet</h3>
          <p className="text-base text-muted-foreground mb-8 max-w-md">
            Start your plant identification journey! Discover and learn about the amazing plants around you.
          </p>
          <Button asChild size="lg" className="gradient-primary text-white">
            <Link href="/">Identify Your First Plant</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {history.map(scan => (
        <Card key={scan.id} className="flex flex-col overflow-hidden shadow-md card-hover border-primary/10">
          <CardHeader className="p-0 relative">
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
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "absolute top-2 right-2 h-9 w-9 rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50",
                scan.isFavorite && "text-yellow-400"
              )}
              onClick={() => toggleFavorite(scan.id)}
            >
              <Star className={cn("h-5 w-5", scan.isFavorite && "fill-current")} />
              <span className="sr-only">Toggle Favorite</span>
            </Button>
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
                    This will permanently delete the scan for &quot;{scan.commonName}&quot;. This action cannot be undone.
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
