import { useEffect, useRef, useState } from 'react'
import { chapters, org } from '../data/content'
import { Crown } from './ui'

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
  const menu = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    menu.current?.querySelector('a')?.focus()
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[100] max-sm:bg-[linear-gradient(180deg,rgb(19_34_58/0.28),rgb(19_34_58/0))]">
        <div className="wrap flex items-center justify-between py-4 sm:py-5">
          <a
            href="#top"
            className="pointer-events-auto flex min-h-11 items-center gap-3 rounded-full bg-paper/90 py-1.5 pr-5 pl-4 shadow-[0_6px_24px_-12px_rgb(19_34_58/0.5)] backdrop-blur-md"
            aria-label="MMUN, back to the top"
          >
            <Crown className="h-6 w-8 text-un" />
            <span className="font-display text-xl font-semibold tracking-wide text-ink">MMUN</span>
          </a>

          <div className="pointer-events-none hidden items-center gap-3 rounded-full bg-paper/90 px-5 py-2.5 text-[0.78rem] font-bold tracking-[0.28em] text-ink uppercase shadow-[0_6px_24px_-12px_rgb(19_34_58/0.5)] backdrop-blur-md md:flex">
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
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="menu"
              className="flex min-h-11 min-w-11 items-center justify-center gap-3 rounded-full bg-ink px-3.5 text-sm font-bold min-[400px]:px-5 tracking-[0.2em] text-white uppercase shadow-[0_6px_24px_-12px_rgb(19_34_58/0.6)] transition-colors hover:bg-un"
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

      <div
        id="menu"
        ref={menu}
        role="dialog"
        aria-modal="true"
        aria-label="Chapters"
        className={`fixed inset-0 z-[110] flex flex-col bg-un text-white transition-[clip-path] duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          open ? '[clip-path:inset(0_0_0_0)]' : 'pointer-events-none [clip-path:inset(0_0_100%_0)]'
        }`}
      >
        <div className="wrap flex items-center justify-between py-5">
          <span className="kicker text-white">Chapters</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="min-h-11 rounded-full bg-white px-5 text-sm font-bold tracking-[0.2em] text-ink uppercase hover:bg-orange"
          >
            Close
          </button>
        </div>
        <nav className="wrap flex flex-1 flex-col justify-center overflow-y-auto pb-10">
          <ol className="grid gap-1 sm:grid-cols-2 sm:gap-x-16">
            {chapters.map((c, i) => (
              <li
                key={c.id}
                style={{ transitionDelay: open ? `${120 + i * 45}ms` : '0ms' }}
                className={`transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  open ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
              >
                <a
                  href={`#${c.id}`}
                  onClick={() => setOpen(false)}
                  className="group flex items-baseline gap-5 border-b border-white/20 py-3 font-display text-[clamp(1.8rem,4.5vw,3.4rem)] leading-tight transition-colors hover:text-sky"
                >
                  <span className="font-mono text-sm tracking-[0.2em] text-white/70">{String(i + 1).padStart(2, '0')}</span>
                  <span className="transition-transform duration-500 group-hover:translate-x-3">{c.label}</span>
                </a>
              </li>
            ))}
          </ol>
          <p className="mt-10 text-white">
            {org.email} · <a className="underline decoration-white/60 underline-offset-4 hover:decoration-white" href={org.instagram} target="_blank" rel="noopener">@{org.handle}</a>
          </p>
        </nav>
      </div>
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
      className="flex min-h-11 items-center gap-2 rounded-full bg-paper/90 px-4 text-sm font-bold text-ink shadow-[0_6px_24px_-12px_rgb(19_34_58/0.5)] backdrop-blur-md transition-colors hover:bg-orange"
    >
      <span aria-hidden className={`size-2.5 rounded-full ${on ? 'bg-orange-deep' : 'bg-ink-soft'}`} />
      <span className="hidden sm:inline">Motion {on ? 'on' : 'off'}</span>
      <span aria-hidden className="text-xs tracking-wide uppercase sm:hidden">{on ? 'On' : 'Off'}</span>
      <span className="sr-only sm:hidden">Motion</span>
    </button>
  )
}
