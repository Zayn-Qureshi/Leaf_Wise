'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Camera, Upload, Loader2, Sparkles, AlertCircle, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import useLocalStorage from '@/hooks/use-local-storage';
import { identifyPlant } from '@/lib/actions';
import type { PlantScan } from '@/lib/types';
import { HISTORY_STORAGE_KEY } from '@/lib/constants';

export default function PlantIdentifier() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { toast } = useToast();
  const [, setHistory] = useLocalStorage<PlantScan[]>(HISTORY_STORAGE_KEY, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIdentify = async () => {
    if (!imagePreview) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await identifyPlant(imagePreview);
      const newScan: PlantScan = {
        id: crypto.randomUUID(),
        image: imagePreview,
        timestamp: Date.now(),
        ...result,
      };

      setHistory(prevHistory => [newScan, ...prevHistory]);
      toast({
        title: 'Plant Identified!',
        description: `It's a ${result.commonName}.`,
      });
      router.push(`/plant/${newScan.id}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Identification Failed',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setImagePreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4">
      <Card className="overflow-hidden shadow-lg">
        <CardHeader className="bg-primary/5 p-4 sm:p-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl font-headline">
              Identify Your Plant
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Snap a photo or upload an image to discover your plant's secrets.
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
          />

          {isLoading ? (
            <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-lg font-medium text-primary">Identifying your plant...</p>
              <p className="text-muted-foreground">This may take a moment. We're consulting our digital botanists!</p>
            </div>
          ) : imagePreview ? (
            <div className="space-y-4">
              <div className="relative aspect-square w-full max-w-md mx-auto overflow-hidden rounded-lg border-2 border-primary/20 shadow-md">
                <Image src={imagePreview} alt="Plant preview" fill style={{ objectFit: 'cover' }} />
                <Button variant="destructive" size="icon" className="absolute top-2 right-2 rounded-full h-8 w-8" onClick={reset}>
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove image</span>
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                <Button onClick={handleIdentify} size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Identify Plant
                </Button>
                <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full">
                  Choose a different image
                </Button>
              </div>
            </div>
          ) : (
            <div
              className="relative flex flex-col items-center justify-center space-y-6 rounded-lg border-2 border-dashed border-gray-300 p-8 sm:p-12 text-center transition-colors hover:border-primary/50"
            >
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button onClick={() => fileInputRef.current?.click()} size="lg" className="flex-1">
                    <Camera className="mr-2 h-5 w-5" />
                    Take Photo
                  </Button>
                  <Button onClick={() => fileInputRef.current?.click()} size="lg" className="flex-1" variant="secondary">
                    <Upload className="mr-2 h-5 w-5" />
                    Upload from Gallery
                  </Button>
                </div>
              </div>
            </div>
          )}

          {error && !isLoading && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
