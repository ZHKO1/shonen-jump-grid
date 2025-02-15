"use client"
import { Button } from "@/components/ui/button";
import useStepsStore from "../../store/step";

export default function HeaderBar() {
  const { nextStep, prevStep } = useStepsStore();
  
  return (
    <div className="w-full h-full flex items-center justify-center font-bold text-black">
      <Button size="sm" className="mr-20" onClick={prevStep}>prev</Button>
      <Button size="sm" onClick={nextStep}>next</Button>
    </div>
  );
}
