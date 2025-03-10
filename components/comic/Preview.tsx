"use client";
import React, { useEffect, useRef, useState } from "react";

import Background from "@/components/background";
import ActionBar, { ActionType } from "@/components/action-bar";
import { CloseIcon } from "@/components/action-bar/Icons";
import { Height, Width } from "./core/config";
import Comic from "./Comic";
import { ComicConfig } from "./core/type";
import { resizeScale } from "./util";

export default function Preview({ config, onClose }: { config: ComicConfig | null, onClose: () => void }) {
  const comicContianerRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const handleClose = () => {
    onClose();
  }

  const onLoad = (resolve: () => {}) => {
    setTimeout(() => {
      setLoading(false);
      resolve();
    }, 1500);
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
          <div className="relative" ref={comicContianerRef}
            style={{
              width: Width,
              height: Height,
            }}>
            {
              loading && <div className="absolute w-26 right-10 bottom-10 grid grid-cols-4">
                <div className="col-span-1 flex flex-wrap items-center justify-center w-10 h-10">
                  {
                    [0, 1, 2, 3].map((i) => {
                      return (<div
                        className="flex items-center justify-center size-4 m-0.5 bg-yellow-600 animate-loading"
                        style={{
                          animationDelay: `calc(150ms * ${i + 1})`
                        }}
                      ></div>)
                    })
                  }
                </div>
                <span className="col-span-3 text-3xl pl-1">Loading...</span>
              </div>
            }
            <Comic config={config} autoPlay={true} onLoad={onLoad} />
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

