import { summarizeCareTips } from "@/ai/flows/summarize-care-tips";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sparkles } from "lucide-react";

export default async function CareSummary({ careTips }: { careTips: string }) {
  const { summary } = await summarizeCareTips({ careTips });

  return (
    <div>
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger className="font-semibold text-lg text-foreground/80">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-accent"/>
                    AI Care Summary
                </div>
            </AccordionTrigger>
            <AccordionContent className="text-base text-foreground/90">
                {summary}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
    </div>
  );
}
