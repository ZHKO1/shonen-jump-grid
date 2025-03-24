import type { ComicConfig } from './core/type'
import { useEffect, useImperativeHandle, useRef } from 'react'
import { Comic } from './core'

export interface ComicProps {
  config?: ComicConfig | null
  autoPlay?: boolean
  onLoad?: (a: any) => void
}

export interface ComicRef {
  replay: () => void
  play: () => void
  pause: () => void
  setCurrentTime: (time: number) => void
}

function ComicComponent({ ref, config, autoPlay, onLoad }: ComicProps & { ref?: React.RefObject<ComicRef | null> }) {
  const container = useRef<HTMLDivElement>(null)
  const comicRef = useRef<Comic>(null)
  const comic = comicRef.current

  useImperativeHandle(ref, () => ({
    replay() {
      if (comic) {
        comic.replay()
      }
    },
    play() {
      if (comic) {
        comic.play()
      }
    },
    pause() {
      if (comic) {
        comic.pause()
      }
    },
    setCurrentTime(time: number) {
      if (comic) {
        comic.setCurrentTime(time)
      }
    },
  }))

  useEffect(() => {
    const comic_ = new Comic()
    const promise = new Promise<void>((resolve) => {
      if (comic_ && config) {
        comic_.init(config, container.current!).then(() => {
          if (onLoad) {
            onLoad(resolve)
          }
          else {
            resolve()
          }
        })
      }
    })
    promise.then(() => {
      if (autoPlay && comic_) {
        comic_.play()
      }
    }).catch((e) => {
      console.error(e)
    })
    comicRef.current = comic_

    return () => {
      promise.then(() => {
        if (comic_) {
          comic_.destory()
        }
      })
      comicRef.current = null
    }
  }, [config, autoPlay, onLoad])

  return (
    <>
      <div className="comic_container" ref={container}>
      </div>
    </>
  )
}

ComicComponent.displayName = 'ComicComponent'

export default ComicComponent
