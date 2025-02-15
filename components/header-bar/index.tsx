"use client"
import { Button } from "@/components/ui/button";
import useStepsStore from "../../store/step";

export default function HeaderBar() {
  const { nextStep, prevStep } = useStepsStore();
  
  return (
    <div className="w-full h-12 flex items-center justify-center font-bold text-black border-b">
      <Button size="sm" variant="outline" className="mr-20" onClick={prevStep}>prev</Button>
      <Button size="sm" variant="outline" onClick={nextStep}>next</Button>
    </div>
  );
}
