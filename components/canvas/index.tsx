"use client";
import { useEffect, useRef } from "react";
import { useEventListener } from "@/hooks";
import useStepsStore from '@/store/step';
import useConfigStore from "@/store/config";
import { Grid } from "./components/grid";
import { GridConfig } from "./components/grid/types";
import { ContainerContext } from "./context/container";
import { getPageFromComicConfig } from "./components/grid/utils";

const defaultConfig: GridConfig[] = [
  {
    "type": "rect",
    "lt_x": 18,
    "lt_y": 18,
    "rb_x": 703,
    "rb_y": 1063,
    "id": 0,
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
    "id": 0
  },
  {
    "type": "poly",
    "path": [
      { x: 261, y: 18 },
      { x: 601, y: 18 },
      { x: 486, y: 521 },
      { x: 146, y: 521 },
    ],
    "id": 1
  },
  {
    "type": "poly",
    "path": [
      { x: 611, y: 18 },
      { x: 703, y: 18 },
      { x: 703, y: 248 },
      { x: 559, y: 248 },
    ],
    "id": 2
  },
  {
    "type": "poly",
    "path": [
      { x: 554, y: 268 },
      { x: 726, y: 268 },
      { x: 726, y: 521 },
      { x: 498, y: 521 },
    ],
    "id": 3
  },
  {
    "type": "rect",
    "lt_x": 18,
    "lt_y": 556,
    "rb_x": 579,
    "rb_y": 1063,
    "id": 4
  },
  {
    "type": "rect",
    "lt_x": 590,
    "lt_y": 556,
    "rb_x": 703,
    "rb_y": 747,
    "id": 5
  },
  {
    "type": "rect",
    "lt_x": 590,
    "lt_y": 757,
    "rb_x": 703,
    "rb_y": 895,
    "id": 6
  },
  {
    "type": "rect",
    "lt_x": 590,
    "lt_y": 905,
    "rb_x": 703,
    "rb_y": 1063,
    "id": 7
  }
]

const defaultConfig2: GridConfig[] = [
  {
    "type": "rect",
    "lt_x": 18,
    "lt_y": 9,
    "rb_x": 703,
    "rb_y": 519,
    "id": 0,
  },
  {
    "type": "poly",
    "path": [
      { x: 18, y: 541 },
      { x: 354, y: 541 },
      { x: 354, y: 779 },
      { x: 18, y: 692 },
    ],
    "id": 1,
  },
  {
    "type": "poly",
    "path": [
      { x: 18, y: 702 },
      { x: 354, y: 789 },
      { x: 354, y: 884 },
      { x: 18, y: 884 },
    ],
    "id": 2,
  },
  {
    "type": "rect",
    "lt_x": 365,
    "lt_y": 541,
    "rb_x": 703,
    "rb_y": 884,
    "id": 3,
  }
]

const defaultConfig3: GridConfig[] = [
  {
    "type": "rect",
    "lt_x": 18,
    "lt_y": 878,
    "rb_x": 526,
    "rb_y": 1062,
    "id": 0,
  },
  {
    "type": "rect",
    "lt_x": 539,
    "lt_y": 555,
    "rb_x": 703,
    "rb_y": 1062,
    "id": 1,
  },
  {
    "type": "poly",
    "path": [
      { x: 18, y: 555 },
      { x: 186, y: 555 },
      { x: 314, y: 858 },
      { x: 18, y: 858 },
    ],
    "id": 2
  },
  {
    "type": "poly",
    "path": [
      { x: 200, y: 555 },
      { x: 526, y: 555 },
      { x: 526, y: 858 },
      { x: 328, y: 858 }
    ],
    "id": 3
  },
  {
    "type": "rect",
    "lt_x": 18,
    "lt_y": 397,
    "rb_x": 195,
    "rb_y": 523,
    "id": 4
  },
  {
    "type": "poly",
    "path": [
      { x: 205, y: 397 },
      { x: 445, y: 397 },
      { x: 486, y: 523 },
      { x: 205, y: 523 }
    ],
    "id": 5
  },
  {
    "type": "poly",
    "path": [
      { x: 456, y: 397 },
      { x: 703, y: 397 },
      { x: 703, y: 523 },
      { x: 497, y: 523 }
    ],
    "id": 6
  },
  {
    "type": "rect",
    "lt_x": 18,
    "lt_y": 158,
    "rb_x": 703,
    "rb_y": 380,
    "id": 7
  },
  {
    "type": "rect",
    "lt_x": 18,
    "lt_y": 18,
    "rb_x": 255,
    "rb_y": 141,
    "id": 8
  },
  {
    "type": "rect",
    "lt_x": 264,
    "lt_y": 18,
    "rb_x": 544,
    "rb_y": 141,
    "id": 9
  },
  {
    "type": "rect",
    "lt_x": 556,
    "lt_y": 18,
    "rb_x": 703,
    "rb_y": 141,
    "id": 10
  }
]

export default function Canvas() {
  const { resetCurrentGridId, getCurrentPageId, setCurrentPageId } = useConfigStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const { addHistoryStep, getCurrentHistoryStep } = useStepsStore();
  const step = getCurrentHistoryStep();
  const pageId = getCurrentPageId();
  const comicConfig = step?.comicConfig;
  const page = comicConfig && getPageFromComicConfig(comicConfig, pageId);
  const grids = page && page.grids;

  const handleDocumentClick = () => {
    resetCurrentGridId();
  }

  useEffect(() => {
    setCurrentPageId("page0");
    addHistoryStep({
      type: "init",
      comicConfig: {
        pages: [{
          id: "page0",
          grids: defaultConfig3
        }]
      }
    });
  }, []);

  useEventListener("click", handleDocumentClick, containerRef);

  return (
    <div className="p-3 flex items-center justify-center text-4xl font-bold text-black">
      <div ref={containerRef} className="canvas-content w-[720px] h-[1080px] bg-gray-100 relative overflow-hidden before:absolute before:border-2 before:top-0 before:left-0 before:w-[720px] before:h-[1080px] before:border-gray-400 before:pointer-events-none">
        <ContainerContext.Provider value={{ container: containerRef }}>
          {grids && grids.map((grid) => (<Grid grid={grid} key={grid.id} />))}
        </ContainerContext.Provider>
      </div>
    </div>
  );
}
