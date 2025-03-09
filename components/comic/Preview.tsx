"use client";
import React, { useEffect, useRef } from "react";

import Background from "@/components/background";
import ActionBar, { ActionType } from "@/components/action-bar";
import { CloseIcon } from "@/components/action-bar/Icons";
import { Height, Width } from "./core/config";
import Comic from "./Comic";
import { ComicConfig } from "./core/type";
import { resizeScale } from "./util";

export default function Preview({ config, onClose }: { config: ComicConfig | null, onClose: () => void }) {
  const comicContianerRef = useRef(null);

  const handleClose = () => {
    onClose();
  }

  const actions = [
    {
      Icon: CloseIcon,
      onClick: handleClose,
    }
  ].filter(action => action) as ActionType[];

  useEffect(() => {
    const { calcRate, windowResize, unWindowResize } = resizeScale(Width, Height, comicContianerRef.current!);
    calcRate();
    windowResize();

    return () => {
      unWindowResize();
    }
  }, []);

  return (
    <>
      <Background
        className="bg-black text-white"
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="" ref={comicContianerRef}
            style={{
              width: Width,
              height: Height,
            }}>
            <Comic config={config} autoPlay={true} />
          </div>
        </div>
      </Background>
      <ActionBar
        className="fixed top-4 right-4 z-[101]"
        actions={actions}
      />
    </>
  );
}

