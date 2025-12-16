'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, UploadCloud } from 'lucide-react';
import type { PlantScan } from '@/lib/types';
import Image from 'next/image';

const formSchema = z.object({
  commonName: z.string().min(2, { message: 'Common name is required.' }),
  scientificName: z.string().optional(),
  image: z.string({ required_error: 'An image is required.' }),
  notes: z.string().optional(),
  careTips: z.string().optional(),
  plantType: z.string().optional(),
  toxicity: z.string().optional(),
  growthHabit: z.string().optional(),
});

type AddPlantFormProps = {
  onPlantAdded: (plant: Omit<PlantScan, 'id' | 'timestamp' | 'confidence' | 'isFavorite' | 'suggestions'>) => void;
};

export function AddPlantForm({ onPlantAdded }: AddPlantFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      commonName: '',
      scientificName: '',
      notes: '',
      careTips: '',
      plantType: '',
      toxicity: '',
      growthHabit: '',
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        form.setValue('image', result);
        form.clearErrors('image');
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 500));
    onPlantAdded(values);
    setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
        <FormField
          control={form.control}
          name="image"
          render={() => (
            <FormItem>
              <FormLabel>Plant Image</FormLabel>
              <FormControl>
                <>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div
                    className="mt-2 flex justify-center items-center w-full h-48 rounded-md border-2 border-dashed border-input cursor-pointer hover:bg-muted/50"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {imagePreview ? (
                      <Image src={imagePreview} alt="Plant preview" width={192} height={192} className="h-full w-full object-cover rounded-md" />
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <UploadCloud className="mx-auto h-12 w-12" />
                        <p>Click to upload an image</p>
                      </div>
                    )}
                  </div>
                </>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="commonName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Common Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Swiss Cheese Plant" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="scientificName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Scientific Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Monstera deliciosa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="plantType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plant Type</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Indoor, Flower" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="growthHabit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Growth Habit</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Bushy, Vining" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="toxicity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Toxicity</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Toxic to cats and dogs" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="careTips"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Care Instructions</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., Water every 1-2 weeks, allow soil to dry out." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Personal Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., Purchased from the local nursery on May 5th." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? 'Adding...' : 'Add Plant'}
        </Button>
      </form>
    </Form>
  );
}