import { useEffect, useRef } from 'react'
import type { CrownApi } from '../lib/crown3d'

/**
 * The MMUN crown in real 3D (three.js), loaded only as it approaches the
 * screen. It sways as you scroll past and leans to the pointer.
 */
export function CrownStage() {
  const stage = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const el = canvas.current
    const box = stage.current
    if (!el || !box) return
    const animate = document.documentElement.dataset.motion !== 'off'
    let api: CrownApi | null = null
    let cancelled = false
    let frame = 0

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const r = box.getBoundingClientRect()
        const p = 1 - (r.top + r.height) / (window.innerHeight + r.height)
        api?.scroll(Math.max(0, Math.min(1, p)))
      })
    }

    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || api) return
        io.disconnect()
        try {
          const { createCrown } = await import('../lib/crown3d')
          if (cancelled) return
          api = createCrown(el, animate)
          box.dataset.ready = 'true'
          onScroll()
        } catch {
          // No WebGL: the flat crown fallback stays visible
          box.dataset.ready = 'false'
        }
      },
      { rootMargin: '500px' },
    )
    io.observe(box)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelled = true
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
      api?.destroy()
    }
  }, [])

  return (
    <div ref={stage} data-crown-stage className="crown-stage relative h-[44svh] min-h-[18rem] sm:h-[58svh]">
      <canvas
        ref={canvas}
        className="absolute inset-x-0 top-0 bottom-12 h-[calc(100%-3rem)] w-full"
        role="img"
        aria-label="The MMUN crown in 3D, turning slowly"
      />
      <p className="pointer-events-none absolute inset-x-0 bottom-4 text-center font-mono text-xs tracking-[0.2em] text-white/80 uppercase">
        <span className="pointer-coarse:hidden">Move your pointer to turn the crown</span>
        <span className="hidden pointer-coarse:inline">Scroll to sway the crown</span>
      </p>
    </div>
  )
}
