'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import useLocalStorage from '@/hooks/use-local-storage';
import { useToast } from '@/hooks/use-toast';
import { HISTORY_STORAGE_KEY } from '@/lib/constants';
import type { PlantScan } from '@/lib/types';
import { AlertTriangle, Bell, HelpCircle, Info, Trash2 } from 'lucide-react';

function AboutSection() {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/90">
      <p>
        <strong>LeafWise</strong> is your personal plant care companion, designed
        to help you identify plants and learn how to care for them.
      </p>
      <p>
        Using advanced AI and the powerful Pl@ntNet API, you can simply snap a
        photo of a plant, and LeafWise will tell you what it is, along with
        detailed care instructions and other useful insights.
      </p>
      <p>
        Whether you're a seasoned gardener or just starting your plant journey,
        LeafWise is here to help you grow.
      </p>
    </div>
  );
}

function FaqSection() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>How does plant identification work?</AccordionTrigger>
        <AccordionContent>
          LeafWise uses your phone's camera or an uploaded image to identify
          plants. We send the image to the Pl@ntNet API, a powerful plant
          identification service. Then, our own AI provides additional details
          like care tips and related species.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is my data private?</AccordionTrigger>
        <AccordionContent>
          Yes. All of your scan history is stored directly on your device in
          your browser's local storage. It is never uploaded to our servers.
          Clearing your history from the settings page will permanently delete
          it from your device.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>
          What if the identification seems wrong?
        </AccordionTrigger>
        <AccordionContent>
          AI identification is not always 100% perfect. Factors like image
          quality, lighting, and the plant's maturity can affect accuracy. For
          best results, use a clear, well-lit photo of a key feature like a leaf
          or flower.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default function SettingsPage() {
  const [, setHistory] = useLocalStorage<PlantScan[]>(HISTORY_STORAGE_KEY, []);
  const { toast } = useToast();

  const handleClearHistory = () => {
    setHistory([]);
    toast({
      title: 'History Cleared',
      description:
        'Your plant identification history has been successfully deleted.',
    });
  };

  const handleRequestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        variant: 'destructive',
        title: 'Unsupported Browser',
        description: 'This browser does not support desktop notifications.',
      });
      return;
    }

    if (Notification.permission === 'granted') {
        toast({
            title: 'Permissions Granted',
            description: 'You have already granted notification permissions.',
        });
        return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      toast({
        title: 'Permissions Granted',
        description: 'You will now receive watering reminders.',
      });
    } else {
        toast({
            variant: 'destructive',
            title: 'Permissions Denied',
            description: 'You will not receive notifications unless you enable them in your browser settings.',
        });
    }
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

      <div className="space-y-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>App Settings</CardTitle>
            <CardDescription>
              Configure notifications and other application preferences.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                    <h3 className="font-semibold">Enable Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                    Allow the app to send you watering reminders.
                    </p>
                </div>
                <Button onClick={handleRequestNotificationPermission}>
                    <Bell className="mr-2 h-4 w-4" /> Allow
                </Button>
            </div>
          </CardContent>
        </Card>


        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>
              Manage your saved application data. Be careful, these actions
              cannot be undone.
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
                    <AlertDialogTitle className="text-center">
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                      This action cannot be undone. This will permanently delete
                      your entire scan history.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="sm:justify-center">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleClearHistory}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Yes, delete everything
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>

        <Accordion type="multiple" className="space-y-6">
          <AccordionItem value="about">
            <Card className="shadow-md">
              <AccordionTrigger className="p-6 text-lg font-semibold w-full hover:no-underline [&[data-state=open]>svg]:-rotate-180">
                <div className="flex items-center gap-3">
                  <Info />
                  About LeafWise
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-6 pt-0">
                <AboutSection />
              </AccordionContent>
            </Card>
          </AccordionItem>

          <AccordionItem value="faq">
            <Card className="shadow-md">
              <AccordionTrigger className="p-6 text-lg font-semibold w-full hover:no-underline [&[data-state=open]>svg]:-rotate-180">
                <div className="flex items-center gap-3">
                  <HelpCircle />
                  Help & FAQ
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-6 pt-0">
                <FaqSection />
              </AccordionContent>
            </Card>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
