"use client"
import { Button } from "@/components/ui/button";
import { Forward, LayoutDashboard, Reply } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Toggle } from "@/components/ui/toggle";
import useStepsStore from "@/store/step";
import useComicStatusStore from "@/store";

export default function HeaderBar() {
  const { nextHistoryStep, prevHistoryStep } = useStepsStore();
  const showAttrCard = useComicStatusStore(state => state.showAttrCard);
  const setShowAttrCard = useComicStatusStore(state => state.setShowAttrCard);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-full p-2 border-b-2">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={prevHistoryStep}>
                <Reply className="h-4 w-4" />
                <span className="sr-only">Previous</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Previous</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={nextHistoryStep}>
                <Forward className="h-4 w-4" />
                <span className="sr-only">Next</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Next</TooltipContent>
          </Tooltip>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Toggle aria-label="Toggle italic" pressed={showAttrCard} onPressedChange={(pressed) => setShowAttrCard(pressed)}>
            <LayoutDashboard className="h-4 w-4" />
            <span className="sr-only">Detail</span>
          </Toggle>
        </div>
      </div>
    </TooltipProvider>
  );
}
