'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { Heart, Trash2, Calendar, Star, Leaf, PlusCircle } from 'lucide-react';
import { useState } from 'react';

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
import { AddPlantForm } from './add-plant-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

export default function MyPlantsGrid() {
  const [history, setHistory] = useLocalStorage<PlantScan[]>(HISTORY_STORAGE_KEY, []);
  const [isAddPlantOpen, setAddPlantOpen] = useState(false);
  const { toast } = useToast();

  const favoritePlants = history.filter(scan => scan.isFavorite);

  const handleDelete = (id: string) => {
    setHistory(prevHistory => prevHistory.filter(scan => scan.id !== id));
    toast({
      title: 'Plant Removed',
      description: 'The plant has been removed from your history.',
    });
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

  const handlePlantAdded = (newPlant: Omit<PlantScan, 'id' | 'timestamp' | 'confidence'>) => {
    const newScan: PlantScan = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      confidence: 1, // Manually added plants have 100% confidence
      isFavorite: true, // Automatically favorite manually added plants
      ...newPlant
    };
    setHistory(prev => [newScan, ...prev]);
    setAddPlantOpen(false);
    toast({
      title: 'Plant Added!',
      description: `${newScan.commonName} has been added to your collection.`,
    });
  };

  if (favoritePlants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
        <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-xl font-semibold text-foreground">No Favorite Plants Yet</h3>
        <p className="mt-2 text-base text-muted-foreground">Favorite a plant from your history or add one manually.</p>
        <div className="mt-6 flex gap-4">
          <Button asChild>
            <Link href="/history">View History</Link>
          </Button>
          <Dialog open={isAddPlantOpen} onOpenChange={setAddPlantOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary">
                <PlusCircle className="mr-2 h-4 w-4" /> Add a Plant
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a New Plant</DialogTitle>
              </DialogHeader>
              <AddPlantForm onPlantAdded={handlePlantAdded} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Dialog open={isAddPlantOpen} onOpenChange={setAddPlantOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Plant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a New Plant</DialogTitle>
            </DialogHeader>
            <AddPlantForm onPlantAdded={handlePlantAdded} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {favoritePlants.map(scan => (
          <Card key={scan.id} className="flex flex-col overflow-hidden shadow-md transition-shadow hover:shadow-xl">
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
                  "text-yellow-400"
                )}
                onClick={() => toggleFavorite(scan.id)}
              >
                <Star className="h-5 w-5 fill-current" />
                <span className="sr-only">Toggle Favorite</span>
              </Button>
            </CardHeader>
            <CardContent className="flex-grow p-4">
              {scan.confidence < 1 && (
                <Badge variant="secondary" className="mb-2">
                  Confidence: {Math.round(scan.confidence * 100)}%
                </Badge>
              )}
               {scan.confidence === 1 && (
                 <Badge variant="secondary" className="mb-2 bg-green-100 text-green-800">
                  Manually Added
                </Badge>
              )}
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
    </>
  );
}
