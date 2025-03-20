'use client'
import type { ComicConfig } from './core/type'
import type { ActionType } from '@/components/action-bar'
import { useCallback, useRef, useState } from 'react'
import ActionBar from '@/components/action-bar'
import { CloseIcon } from '@/components/action-bar/Icons'
import Background from '@/components/background'
import { useResizeScale } from '@/hooks'
import Comic from './Comic'
import { Height, Width } from './core/config'

export default function Preview({ config, onClose }: { config: ComicConfig | null, onClose: () => void }) {
  const comicContianerRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const { scaleX, scaleY } = useResizeScale(Width, Height, comicContianerRef)

  const handleClose = () => {
    onClose()
  }

  const onLoad = useCallback((resolve: () => void) => {
    setTimeout(() => {
      setLoading(false)
      resolve()
    }, 1500)
  }, [setLoading])

  const actions = [
    {
      Icon: CloseIcon,
      onClick: handleClose,
    },
  ].filter(action => action) as ActionType[]

  return (
    <>
      <Background
        className="bg-black text-white"
        ref={comicContianerRef}
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div
            className="relative"
            style={{
              width: Width,
              height: Height,
              transform: `scale(${scaleX}, ${scaleY})`,
            }}
          >
            {
              loading && (
                <div className="absolute w-26 right-10 bottom-10 flex h-10">
                  <div className="flex flex-wrap items-center justify-center w-10 h-10">
                    {
                      [0, 1, 2, 3].map((i) => {
                        return (
                          <div
                            key={i}
                            className="flex items-center justify-center size-4 m-0.5 bg-yellow-600 animate-loading"
                            style={{
                              animationDelay: `calc(150ms * ${i + 1})`,
                            }}
                          >
                          </div>
                        )
                      })
                    }
                  </div>
                  <span className="text-2xl pl-1 leading-10">Loading...</span>
                </div>
              )
            }
            <Comic config={config} autoPlay onLoad={onLoad} />
          </div>
        </div>
      </Background>
      <ActionBar
        className="fixed top-4 right-4 z-[101]"
        actions={actions}
      />
    </>
  )
}
