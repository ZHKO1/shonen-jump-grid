"use client";
import { useEffect, useRef } from "react";
import useComicStatusStore from "@/store";
import { Grid } from "./grid";
import { ContainerContext } from "./context/container";
import { getPageFromComicConfig } from "./utils";
import { LOGO_PAGE_GRIDS_CONFIG, LOGO_PAGE_HEIGHT } from "./constant";
import { on, off } from "@/lib";

export default function Canvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pageId = useComicStatusStore(state => state.currentPageStatus.id);
  const setCurrentPageId = useComicStatusStore(state => state.setCurrentPageId);
  const resetCurrentGridId = useComicStatusStore(state => state.resetCurrentGridId);
  const addHistoryStep = useComicStatusStore(state => state.addHistoryStep);
  const setCurrentLayerType = useComicStatusStore(state => state.setCurrentLayerType);
  const step = useComicStatusStore(state => state.historySteps[state.currentHistoryStepIndex]);
  const comicConfig = step?.comicConfig;
  const page = comicConfig && getPageFromComicConfig(comicConfig, pageId);
  const grids = page && page.grids;
  const height = page && page.height;
  const extraProp = height ? { style: { height } } : {};

  useEffect(() => {
    addHistoryStep({
      type: "init",
      comicConfig: {
        pages: [{
          id: "page0",
          height: LOGO_PAGE_HEIGHT,
          readonly: true,
          logo: {
            url: "/logo.jpg"
          },
          grids: LOGO_PAGE_GRIDS_CONFIG
        }]
      }
    });
    setCurrentPageId("page0");
    setCurrentLayerType("logo");
  }, [setCurrentPageId, addHistoryStep]);

  useEffect(() => {
    if (!(grids && grids.length)) {
      return;
    }
    if (!containerRef.current) {
      return;
    }

    const handleDocumentClick = () => {
      resetCurrentGridId();
    }
    on(containerRef.current, "click", handleDocumentClick);

    return () => {
      if (!(grids && grids.length)) {
        return;
      }
      if (!containerRef.current) {
        return;
      }

      off(containerRef.current, "click", handleDocumentClick);
    }
  }, [grids && grids.length, containerRef.current])

  return (
    <div className="p-3 flex items-center justify-center text-4xl font-bold text-black">
      {
        grids && <div ref={containerRef} className="canvas-content w-[720px] bg-gray-100 relative overflow-hidden border-2 border-gray-400"
          {...extraProp}>
          <ContainerContext.Provider value={{ container: containerRef }}>
            {grids.map((grid) => (<Grid grid={grid} key={grid.id} />))}
          </ContainerContext.Provider>
        </div>
      }
    </div >
  );
}
