'use client';

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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import useLocalStorage from '@/hooks/use-local-storage';
import { HISTORY_STORAGE_KEY } from '@/lib/constants';
import type { PlantScan } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Trash2, AlertTriangle } from 'lucide-react';

export default function SettingsPage() {
  const [, setHistory] = useLocalStorage<PlantScan[]>(HISTORY_STORAGE_KEY, []);
  const { toast } = useToast();

  const handleClearHistory = () => {
    setHistory([]);
    toast({
      title: 'History Cleared',
      description: 'Your plant identification history has been successfully deleted.',
    });
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl font-headline">
          Settings
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Manage your app settings and data.
        </p>
      </div>
      
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>
            Manage your saved application data. Be careful, these actions cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border border-destructive/50 p-4">
            <div>
              <h3 className="font-semibold">Clear Scan History</h3>
              <p className="text-sm text-muted-foreground">
                This will permanently delete all of your saved plant scans.
              </p>
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> Clear History
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <div className="flex justify-center mb-4">
                    <div className="rounded-full bg-destructive/10 p-3">
                      <AlertTriangle className="h-8 w-8 text-destructive" />
                    </div>
                  </div>
                  <AlertDialogTitle className="text-center">Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription className="text-center">
                    This action cannot be undone. This will permanently delete your entire scan history.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="sm:justify-center">
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearHistory} className="bg-destructive hover:bg-destructive/90">
                    Yes, delete everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
