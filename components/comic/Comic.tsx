import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { ComicConfig } from './core/type';
import { Comic } from './core';

export interface ComicProps {
  config?: ComicConfig | null,
  autoPlay?: boolean,
  onLoad?: (a: any) => void
}

export interface ComicRef {
  play: () => void;
  pause: () => void;
  setCurrentTime: (time: number) => void
}

const ComicComponent = forwardRef<ComicRef, ComicProps>(({ config, autoPlay, onLoad }, ref) => {
  const container = useRef<HTMLDivElement>(null);
  const comicRef = useRef<Comic>(null);
  const comic = comicRef.current;

  useImperativeHandle(ref, () => ({
    play: function () {
      if (comic) {
        comic.play();
      }
    },
    pause: function () {
      if (comic) {
        comic.pause();
      }
    },
    setCurrentTime: function (time: number) {
      if (comic) {
        comic.setCurrentTime(time);
      }
    }
  }))

  useEffect(() => {
    const comic_ = new Comic();
    const promise = new Promise(async (resolve) => {
      if (comic_ && config) {
        await comic_.init(config, container.current!);
      }
      if (onLoad) {
        onLoad(resolve);
      }
    });
    promise.then(() => {
      if (autoPlay && comic_) {
        comic_.play();
      }
    }).catch(e => {
      console.log(e);
    });
    comicRef.current = comic_;

    return () => {
      promise.then(() => {
        if (comic_) {
          comic_.destory()
        }
      });
      comicRef.current = null;
    }
  }, [config, autoPlay, onLoad]);

  return <>
    <div className="comic_container" ref={container}>
    </div>
  </>
});

ComicComponent.displayName = "ComicComponent";

export default ComicComponent;
