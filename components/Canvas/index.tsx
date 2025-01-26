"use client";
import { Grid, GridConfig } from "./grid";
import { ContainerContext } from "./context/container";
import { useEffect, useRef } from "react";
import useStepsStore from '../store/step'



const defaultConfig: GridConfig[] = [
  {
    "type": "rect",
    "lt_x": 18,
    "lt_y": 18,
    "rb_x": 703,
    "rb_y": 1063,
    "index": 0,
  }
]

const defaultConfig1: GridConfig[] = [
  {
    "type": "poly",
    "path": [
      { x: 18, y: 18 },
      { x: 251, y: 18 },
      { x: 136, y: 521 },
      { x: 18, y: 521 },
    ],
    index: 0
  },
  {
    "type": "poly",
    "path": [
      { x: 261, y: 18 },
      { x: 601, y: 18 },
      { x: 486, y: 521 },
      { x: 146, y: 521 },
    ],
    index: 1
  },
  {
    "type": "poly",
    "path": [
      { x: 611, y: 18 },
      { x: 703, y: 18 },
      { x: 703, y: 248 },
      { x: 559, y: 248 },
    ],
    index: 2
  },
  {
    "type": "poly",
    "path": [
      { x: 554, y: 268 },
      { x: 726, y: 268 },
      { x: 726, y: 521 },
      { x: 498, y: 521 },
    ],
    index: 3
  },
  {
    "type": "rect",
    "lt_x": 18,
    "lt_y": 556,
    "rb_x": 579,
    "rb_y": 1063,
    index: 4
  },
  {
    "type": "rect",
    "lt_x": 590,
    "lt_y": 556,
    "rb_x": 703,
    "rb_y": 747,
    index: 5
  },
  {
    "type": "rect",
    "lt_x": 590,
    "lt_y": 757,
    "rb_x": 703,
    "rb_y": 895,
    index: 6
  },
  {
    "type": "rect",
    "lt_x": 590,
    "lt_y": 905,
    "rb_x": 703,
    "rb_y": 1063,
    index: 7
  }
]

const defaultConfig2: GridConfig[] = [
  {
    "type": "rect",
    "lt_x": 18,
    "lt_y": 9,
    "rb_x": 703,
    "rb_y": 519,
    index: 0,
  },
  {
    "type": "poly",
    "path": [
      { x: 18, y: 541 },
      { x: 354, y: 541 },
      { x: 354, y: 779 },
      { x: 18, y: 692 },
    ],
    index: 1,
  },
  {
    "type": "poly",
    "path": [
      { x: 18, y: 702 },
      { x: 354, y: 789 },
      { x: 354, y: 884 },
      { x: 18, y: 884 },
    ],
    index: 2,
  },
  {
    "type": "rect",
    "lt_x": 365,
    "lt_y": 541,
    "rb_x": 703,
    "rb_y": 884,
    index: 3,
  }
]

export default function Canvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { addStep, getCurrentStep } = useStepsStore();
  const step = getCurrentStep();
  useEffect(() => {
    addStep({ type: "init", comicConfig: defaultConfig });
  }, []);
  return (
    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-black">
      <div ref={containerRef} className="canvas-content w-[720px] h-full bg-gray-100 relative overflow-hidden after:absolute after:border-2 after:top-0 after:left-0 after:right-0 after:bottom-0 after:border-gray-400 after:pointer-events-none">
        <ContainerContext.Provider value={{ container: containerRef }}>
          {step && step.comicConfig.map((grid) => (<Grid grid={grid} key={grid.index} />))}
        </ContainerContext.Provider>
      </div>
    </div>
  );
}
