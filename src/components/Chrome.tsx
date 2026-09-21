import { useCallback, useEffect, useRef, useState } from 'react'
import { Menu } from './Menu'
import { Crown, Wordmark } from './ui'

export function Chrome() {
  return (
    <>
      <div className="grain-wrap" aria-hidden>
        <div className="grain" />
      </div>
      <div aria-hidden className="fixed inset-x-0 top-0 z-[95] h-1 origin-left scale-x-0 bg-orange" data-progress />
      <Cursor />
      <Nav />
    </>
  )
}

function Cursor() {
  return (
    <div aria-hidden className="cursor">
      <div data-cursor-dot className="invisible fixed top-0 left-0 size-2.5 rounded-full bg-orange-deep" />
      <div
        data-cursor-ring
        className="invisible fixed top-0 left-0 grid size-10 place-items-center rounded-full border-2 border-un"
      >
      </div>
      <span
        data-cursor-text
        className="invisible fixed top-0 left-0 rounded-full bg-ink px-3 py-1.5 font-mono text-[11px] font-medium tracking-[0.16em] whitespace-nowrap text-white uppercase"
      />
    </div>
  )
}

function Nav() {
  const [open, setOpen] = useState(false)
  const opener = useRef<HTMLButtonElement>(null)
  const close = useCallback(() => setOpen(false), [])

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[100]">
        <div className="wrap flex items-center justify-between py-4 sm:py-5">
          <a
            href="#top"
            className="pointer-events-auto flex min-h-11 items-center gap-3 rounded-full bg-paper py-1.5 pr-5 pl-4 shadow-[0_6px_24px_-12px_rgb(43_9_6/0.5)] backdrop-blur-md"
            aria-label="MMUN, back to the top"
          >
            <Crown className="h-7 w-auto text-un" />
            <Wordmark className="h-3.5 w-auto text-ink" />
          </a>

          <div className="pointer-events-none hidden items-center gap-3 rounded-full bg-paper px-5 py-2.5 text-[0.78rem] font-bold tracking-[0.28em] text-ink uppercase shadow-[0_6px_24px_-12px_rgb(43_9_6/0.5)] backdrop-blur-md md:flex">
            <span className="overflow-hidden">
              <span data-chapter-num className="block text-orange-deep">
                01
              </span>
            </span>
            <span className="h-[2px] w-8 bg-ink/25" />
            <span className="overflow-hidden">
              <span data-chapter-label className="block">
                Prologue
              </span>
            </span>
          </div>

          <div className="pointer-events-auto flex items-center gap-2">
            <MotionToggle />
            <button
              ref={opener}
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="menu"
              className="flex min-h-11 min-w-11 items-center justify-center gap-3 rounded-full bg-ink px-3.5 text-sm font-bold ring-2 ring-paper/85 min-[400px]:px-5 tracking-[0.2em] text-white uppercase shadow-[0_6px_24px_-12px_rgb(43_9_6/0.6)] transition-colors hover:bg-un"
              data-cursor="Open"
            >
              <span className="max-[399px]:sr-only">Menu</span>
              <span aria-hidden className="grid gap-1">
                <span className="block h-px w-5 bg-current" />
                <span className="block h-px w-3 bg-current" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <Menu open={open} onClose={close} opener={opener} />
    </>
  )
}

/** Visitors can switch the animation on or off; the choice is remembered. */
function MotionToggle() {
  const [on, setOn] = useState(true)
  useEffect(() => setOn(document.documentElement.dataset.motion !== 'off'), [])
  const toggle = () => {
    const next = on ? 'off' : 'on'
    try {
      localStorage.setItem('mmun-motion', next)
    } catch {
      // storage unavailable: still applies to this page
    }
    window.location.reload()
  }
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      title={on ? 'Turn the animation off' : 'Turn the animation on'}
      className="flex min-h-11 items-center gap-2 rounded-full bg-paper px-4 text-sm font-bold text-ink shadow-[0_6px_24px_-12px_rgb(43_9_6/0.5)] backdrop-blur-md transition-colors hover:bg-orange"
    >
      <span aria-hidden className={`size-2.5 rounded-full ${on ? 'bg-orange-deep' : 'bg-ink-soft'}`} />
      <span className="hidden sm:inline">Motion {on ? 'on' : 'off'}</span>
      <span aria-hidden className="text-xs tracking-wide uppercase sm:hidden">{on ? 'On' : 'Off'}</span>
      <span className="sr-only sm:hidden">Motion</span>
    </button>
  )
}
