"use client"
import useStepsStore from "../../store/step";

export default function HeaderBar() {
  const { nextStep, prevStep } = useStepsStore();
  
  return (
    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-black">
      <button className="mr-20" onClick={prevStep}>prev</button>
      <button onClick={nextStep}>next</button>
    </div>
  );
}
