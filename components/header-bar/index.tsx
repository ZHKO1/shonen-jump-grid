"use client"
import { Button } from "@/components/ui/button";
import { Forward, LayoutDashboard, Reply } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Toggle } from "@/components/ui/toggle";
import useStepsStore from "@/store/step";
import useConfigStore from "@/store/config";

export default function HeaderBar() {
  const { nextStep, prevStep } = useStepsStore();
  const { setIsAttrCardShowed, getIsAttrCardShowed } = useConfigStore();

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-full flex-col">
        <div className="flex items-center p-2">
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={prevStep}>
                  <Reply className="h-4 w-4" />
                  <span className="sr-only">Previous</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Previous</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={nextStep}>
                  <Forward className="h-4 w-4" />
                  <span className="sr-only">Next</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Next</TooltipContent>
            </Tooltip>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Toggle aria-label="Toggle italic" pressed={getIsAttrCardShowed()} onPressedChange={(pressed) => setIsAttrCardShowed(pressed)}>
              <LayoutDashboard className="h-4 w-4" />
              <span className="sr-only">Detail</span>
            </Toggle>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
