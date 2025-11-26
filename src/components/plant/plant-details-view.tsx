'use client';

import { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, HelpCircle, Leaf, Percent, BrainCircuit, Type, ShieldAlert, GitCommitHorizontal, Lightbulb, Star, Notebook, Loader2, Droplets, Globe, Flower, Beaker, StarIcon, Share2 } from 'lucide-react';
import { format, addDays } from 'date-fns';

import useLocalStorage from '@/hooks/use-local-storage';
import type { PlantScan, PlantSuggestion, Reminder } from '@/lib/types';
import { HISTORY_STORAGE_KEY } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import CareSummary from './care-summary';
import RelatedPlants from './related-plants';
import { Badge } from '../ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <div className="text-primary">{icon}</div>
      <div>
        <p className="font-semibold text-foreground/90">{label}</p>
        <p className="text-muted-foreground">{value}</p>
      </div>
    </div>
  );
}

function Suggestions({ suggestions }: { suggestions: PlantSuggestion[] }) {
  if (!suggestions || suggestions.length === 0) return null;
  
  return (
    <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
        <AccordionTrigger className="font-semibold text-lg text-foreground/80">
            <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-accent"/>
                Other Possible Matches
            </div>
        </AccordionTrigger>
        <AccordionContent>
            <ul className="space-y-3">
            {suggestions.map((suggestion, index) => (
                <li key={index} className="p-3 rounded-md bg-muted/30">
                    <p className="font-semibold text-primary">{suggestion.commonName}</p>
                    <p className="text-sm text-muted-foreground italic">{suggestion.scientificName}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <Progress value={suggestion.confidence * 100} className="w-24 h-2" />
                        <span className="text-xs text-muted-foreground">{Math.round(suggestion.confidence * 100)}% match</span>
                    </div>
                </li>
            ))}
            </ul>
        </AccordionContent>
        </AccordionItem>
    </Accordion>
  );
}

export default function PlantDetailsView({ id }: { id: string }) {
  const [history, setHistory] = useLocalStorage<PlantScan[]>(HISTORY_STORAGE_KEY, []);
  const [scan, setScan] = useState<PlantScan | null | undefined>(undefined);
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const foundScan = history.find(s => s.id === id);
    setScan(foundScan || null);
    if (foundScan) {
      setNotes(foundScan.notes || '');
    }
  }, [id, history]);

  const toggleFavorite = () => {
    if (!scan) return;
    const newHistory = history.map(s => {
      if (s.id === id) {
        const updatedScan = { ...s, isFavorite: !s.isFavorite };
        toast({
          title: updatedScan.isFavorite ? 'Added to Favorites' : 'Removed from Favorites',
          description: `${updatedScan.commonName} has been ${updatedScan.isFavorite ? 'added to' : 'removed from'} your favorites.`,
        });
        return updatedScan;
      }
      return s;
    });
    setHistory(newHistory);
  };
  
  const handleSaveNotes = () => {
    if (!scan) return;
    setIsSaving(true);
    
    setTimeout(() => {
      const newHistory = history.map(s => {
        if (s.id === id) {
          return { ...s, notes };
        }
        return s;
      });
      setHistory(newHistory);
      setIsSaving(false);
      toast({
        title: 'Notes Saved',
        description: `Your notes for ${scan.commonName} have been updated.`,
      });
    }, 500);
  };
  
  const handleSetReminder = (frequency: number) => {
    if (!scan) return;

    if (Notification.permission !== 'granted') {
      toast({
        variant: 'destructive',
        title: 'Notifications not enabled',
        description: 'Please enable notifications in settings to set reminders.',
      });
      return;
    }

    const newReminder: Reminder = { frequency, lastWatered: Date.now() };

    const newHistory = history.map(s =>
      s.id === id ? { ...s, reminder: newReminder } : s
    );
    setHistory(newHistory);
    
    const nextWateringDate = addDays(new Date(), frequency);

    // This is a simplified client-side notification.
    // A robust solution would use a service worker with push notifications.
    setTimeout(() => {
        new Notification(`Time to water your ${scan.commonName}!`, {
            body: `It's been ${frequency} days. Give your plant some love.`,
            icon: scan.image,
        });
    }, nextWateringDate.getTime() - Date.now());


    toast({
      title: 'Reminder Set!',
      description: `You'll be reminded to water your ${scan.commonName} every ${frequency} days.`,
    });
  };

  const handleShare = async () => {
    if (!scan) return;

    const shareData = {
      title: `Check out this plant: ${scan.commonName}`,
      text: `I identified a ${scan.commonName} (${scan.scientificName}) using LeafWise! Here's a fun fact: ${scan.funFact}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast({ title: 'Shared successfully!' });
      } else {
        // Fallback for browsers that don't support the Web Share API
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        toast({ title: 'Copied to clipboard!', description: 'Plant details copied for easy sharing.' });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        variant: 'destructive',
        title: 'Sharing failed',
        description: 'Could not share the plant details at this time.',
      });
    }
  };


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
      <div className="mb-6 flex flex-wrap gap-2 justify-between items-center">
        <Button asChild variant="outline">
          <Link href="/history">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to History
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleShare}
          >
            <Share2 className="mr-2 h-5 w-5" />
            Share
          </Button>
          <Button
            variant="outline"
            onClick={toggleFavorite}
            className={cn(scan.isFavorite && "bg-yellow-400/10 border-yellow-500 text-yellow-600 hover:bg-yellow-400/20")}
          >
            <Star className={cn("mr-2 h-5 w-5", scan.isFavorite && "fill-current text-yellow-500")} />
            {scan.isFavorite ? 'Favorite' : 'Add to Favorites'}
          </Button>
        </div>
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
                <Droplets className="text-primary"/>
                Watering Reminder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Set a reminder to get notified when it's time to water this plant.
              </p>
              <Select onValueChange={(value) => handleSetReminder(Number(value))} defaultValue={scan.reminder?.frequency.toString()}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Set reminder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Every day</SelectItem>
                  <SelectItem value="3">Every 3 days</SelectItem>
                  <SelectItem value="7">Every 7 days</SelectItem>
                  <SelectItem value="14">Every 14 days</SelectItem>
                </SelectContent>
              </Select>
               {scan.reminder && (
                 <p className="text-sm text-green-600">
                    Reminder set for every {scan.reminder.frequency} days.
                 </p>
               )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Notebook className="text-primary"/>
                Personal Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Add your personal notes here... e.g., 'Watered on Monday', 'Moved to a sunnier spot'."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={5}
                disabled={isSaving}
              />
              <Button onClick={handleSaveNotes} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Notes'
                )}
              </Button>
            </CardContent>
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
          
          {scan.suggestions && scan.suggestions.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <Suggestions suggestions={scan.suggestions} />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Leaf className="text-primary"/>
                Plant Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoRow icon={<Type className="h-5 w-5" />} label="Plant Type" value={scan.plantType} />
              <InfoRow icon={<GitCommitHorizontal className="h-5 w-5" />} label="Growth Habit" value={scan.growthHabit} />
              <InfoRow icon={<ShieldAlert className="h-5 w-5" />} label="Toxicity" value={scan.toxicity} />
              <InfoRow icon={<Globe className="h-5 w-5" />} label="Origin" value={scan.origin} />
              <InfoRow icon={<Flower className="h-5 w-5" />} label="Flowering Period" value={scan.floweringPeriod} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl"><Beaker className="text-primary"/> Propagation</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{scan.propagationTips}</p>
            </CardContent>
          </Card>

          <Card className="bg-accent/10 border-accent/30">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-accent/90"><StarIcon className="text-accent"/> Fun Fact</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-accent/90 font-medium">{scan.funFact}</p>
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
