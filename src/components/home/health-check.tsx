'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, Loader2, Sparkles, AlertCircle, X, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { diagnosePlantHealth, type DiagnosePlantHealthOutput } from '@/ai/flows/diagnose-plant-health-flow';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Badge } from '../ui/badge';

type HealthCheckProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export default function HealthCheck({ isOpen, onOpenChange }: HealthCheckProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DiagnosePlantHealthOutput | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setError(null);
      setResult(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiagnose = async () => {
    if (!imagePreview) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const diagnosisResult = await diagnosePlantHealth({ photoDataUri: imagePreview });
      setResult(diagnosisResult);
      toast({
        title: 'Health Check Complete!',
        description: diagnosisResult.isHealthy ? 'Your plant looks healthy.' : `Found ${diagnosisResult.potentialIssues.length} potential issue(s).`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Diagnosis Failed',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setImagePreview(null);
    setError(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
    }
    onOpenChange(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Stethoscope className="text-primary"/>
            Plant Health Check
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
            />
          
            {isLoading && (
              <div className="flex flex-col items-center justify-center space-y-4 rounded-lg p-12 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-lg font-medium text-primary">Analyzing plant health...</p>
                <p className="text-muted-foreground">This may take a moment.</p>
              </div>
            )}

            {!isLoading && result && (
               <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
                 <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2 border-primary/20 shadow-md">
                    <Image src={imagePreview!} alt="Plant preview" fill style={{ objectFit: 'cover' }} />
                 </div>
                 {result.isHealthy ? (
                    <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
                        <AlertTitle className="font-bold flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-green-600"/>
                            Plant Appears Healthy!
                        </AlertTitle>
                        <AlertDescription>
                            Based on the image, we didn't find any obvious signs of disease or pests. Keep up the great work!
                        </AlertDescription>
                    </Alert>
                 ) : (
                    <Accordion type="multiple" defaultValue={result.potentialIssues.map(p => p.issue)} className="w-full">
                        {result.potentialIssues.map((issue, index) => (
                           <AccordionItem value={issue.issue} key={index}>
                                <AccordionTrigger>
                                    <div className="flex flex-col text-left">
                                        <span className="font-semibold text-primary">{issue.issue}</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-3">
                                    <p className="text-sm text-muted-foreground">{issue.description}</p>
                                    <div>
                                        <h4 className="font-semibold mb-1">Treatment Plan:</h4>
                                        <p className="text-sm whitespace-pre-wrap font-mono bg-muted/50 p-2 rounded-md">{issue.treatment}</p>
                                    </div>
                                </AccordionContent>
                           </AccordionItem>
                        ))}
                    </Accordion>
                 )}
                <Button onClick={reset} variant="outline" className="w-full">Start New Health Check</Button>
               </div>
            )}

            {!isLoading && !result && (
              <>
                {imagePreview ? (
                   <div className="space-y-4">
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2 border-primary/20 shadow-md">
                        <Image src={imagePreview} alt="Plant preview" fill style={{ objectFit: 'cover' }} />
                        <Button variant="destructive" size="icon" className="absolute top-2 right-2 rounded-full h-8 w-8" onClick={reset}>
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove image</span>
                        </Button>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Button onClick={handleDiagnose} size="lg" className="w-full">
                        <Sparkles className="mr-2 h-5 w-5" />
                        Diagnose Plant
                        </Button>
                        <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full">
                          Choose a different image
                        </Button>
                    </div>
                   </div>
                ) : (
                    <div
                        className="relative flex flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition-colors hover:border-primary/50 cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload className="h-10 w-10 text-muted-foreground"/>
                        <p className="text-muted-foreground">Upload a photo of an affected area (e.g., a leaf or stem).</p>
                    </div>
                )}
              </>
            )}

            {error && !isLoading && (
                <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
