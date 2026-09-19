import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { contacts, councils, team, type Council, type Member } from '../data/content'
import { Arrow, Crown, Picture } from './ui'

/*
 * Meet the team, as a wall of delegate nameplates. Every member sits behind a
 * desk placard; photos wait in the berry duotone and bloom into colour as they
 * cross the middle of the screen (or under the pointer). Filter by council or
 * search by name or role, and the wall rearranges itself.
 */

type Filter = Council | 'all'
type FlipKit = {
  gsap: typeof import('gsap').gsap
  Flip: typeof import('gsap/Flip').Flip
  ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger
}

const tone: Record<Council, { band: string; tag: string; short: string; color: string; on: string }> = {
  executive: { band: 'bg-un', tag: 'bg-un text-paper', short: 'Executive', color: 'var(--color-un)', on: 'var(--color-paper)' },
  secretariat: { band: 'bg-orange', tag: 'bg-orange text-ink', short: 'Secretariat', color: 'var(--color-orange-deep)', on: 'var(--color-ink)' },
  advisory: { band: 'bg-pine', tag: 'bg-pine text-white', short: 'Advisory', color: 'var(--color-pine)', on: 'var(--color-paper)' },
}

const initials = (name: string) =>
  name
    .replace(/^Md\.\s*/, '')
    .split(/\s+/)
    .filter((w) => /^[A-Z]/.test(w) && !/\.$/.test(w))
    .map((w) => w[0])
    .filter((_, i, a) => i === 0 || i === a.length - 1)
    .join('')

const firstName = (name: string) => name.replace(/^Md\.\s*/, '').split(' ')[0]

const motionOn = () => typeof document !== 'undefined' && document.documentElement.dataset.motion !== 'off'

export function Team() {
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const grid = useRef<HTMLUListElement>(null)
  const tabs = useRef<HTMLDivElement>(null)
  const pill = useRef<HTMLSpanElement>(null)
  const flipState = useRef<unknown>(null)

  const q = query.trim().toLowerCase()
  const shown = useMemo(
    () =>
      new Set(
        team
          .filter((m) => (filter === 'all' || m.council === filter) && (!q || `${m.name} ${m.role} ${m.also ?? ''}`.toLowerCase().includes(q)))
          .map((m) => m.name),
      ),
    [filter, q],
  )

  // GSAP Flip, loaded once the section is on its way, so filtering stays instant
  const flip = useRef<FlipKit | null>(null)
  useEffect(() => {
    if (!motionOn()) return
    Promise.all([import('gsap'), import('gsap/Flip'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { Flip }, { ScrollTrigger }]) => {
      gsap.registerPlugin(Flip)
      flip.current = { gsap, Flip, ScrollTrigger }
    })
  }, [])

  // Capture where every card is before React moves them, then glide them to
  // their new places.
  const change = (next: () => void) => {
    if (flip.current && grid.current) flipState.current = flip.current.Flip.getState(grid.current.querySelectorAll('[data-member]'))
    next()
  }

  useLayoutEffect(() => {
    const state = flipState.current
    const kit = flip.current
    if (!state || !kit) return
    flipState.current = null
    const { gsap, Flip, ScrollTrigger } = kit
    {
      Flip.from(state as Parameters<typeof Flip.from>[0], {
        duration: 0.75,
        ease: 'power3.inOut',
        stagger: 0.015,
        absolute: true,
        nested: true,
        onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.85 }, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'power3.out', stagger: 0.03 }),
        onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.7, duration: 0.35, ease: 'power2.in' }),
        onComplete: () => ScrollTrigger.refresh(),
      })
    }
  }, [shown])

  // The sliding highlight behind the active council tab
  useLayoutEffect(() => {
    const box = tabs.current
    const p = pill.current
    const active = box?.querySelector<HTMLElement>('[aria-pressed="true"]')
    if (!box || !p || !active) return
    p.style.width = `${active.offsetWidth}px`
    p.style.transform = `translateX(${active.offsetLeft}px)`
  }, [filter])

  // Cards open as they arrive (see .member-frame in index.css), and their
  // photos bloom into colour while they cross the middle of the screen.
  useEffect(() => {
    const root = grid.current
    if (!root) return
    const cards = [...root.querySelectorAll<HTMLElement>('[data-member]')]
    if (!motionOn()) {
      cards.forEach((c) => c.classList.add('is-in'))
      return
    }
    const rise = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const el = e.target as HTMLElement
          const col = Number(el.dataset.col ?? 0)
          el.style.setProperty('--delay', `${col * 50}ms`)
          el.classList.add('is-in')
          rise.unobserve(el)
        }),
      { rootMargin: '0px 0px 15% 0px' },
    )
    const lit = new IntersectionObserver((entries) => entries.forEach((e) => e.target.classList.toggle('is-lit', e.isIntersecting)), {
      rootMargin: '-38% 0px -38% 0px',
    })
    // anything already scrolled past (a jump from the menu) arrives at once
    cards.forEach((c) => {
      if (c.getBoundingClientRect().bottom < 0) c.classList.add('is-in')
      else rise.observe(c)
      lit.observe(c)
    })
    return () => {
      rise.disconnect()
      lit.disconnect()
    }
  }, [])

  // Remember each card's column so a row opens left to right
  useEffect(() => {
    const root = grid.current
    if (!root) return
    const mark = () => {
      const cards = [...root.querySelectorAll<HTMLElement>('[data-member]:not([hidden])')]
      const top0 = cards[0]?.offsetTop
      let col = 0
      let rowTop = top0
      cards.forEach((c) => {
        if (c.offsetTop !== rowTop) {
          rowTop = c.offsetTop
          col = 0
        }
        c.dataset.col = String(col++)
      })
    }
    mark()
    window.addEventListener('resize', mark)
    return () => window.removeEventListener('resize', mark)
  }, [shown])

  const count = (f: Filter) => (f === 'all' ? team.length : team.filter((m) => m.council === f).length)

  return (
    <section id="team" data-chapter="The team" className="relative overflow-hidden bg-paper pb-20 sm:pb-28" aria-labelledby="team-title">
      {/* A roll call of every name, running the width of the page */}
      <div className="overflow-hidden bg-un py-4 text-paper" aria-hidden>
        <div data-marquee="left" className="marquee">
          {[...team, ...team].map((m, i) => (
            <span key={i} className="flex items-center gap-6 pr-6 font-display text-[clamp(1.6rem,3.4vw,2.8rem)] font-medium tracking-[-0.02em] whitespace-nowrap">
              {m.name}
              <span className="size-2.5 shrink-0 rounded-full bg-orange" />
            </span>
          ))}
        </div>
      </div>

      <div className="wrap pt-16 sm:pt-24">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div>
            <p className="kicker text-orange-deep" data-reveal>
              Meet the team
            </p>
            <h2 id="team-title" data-split="words" className="mt-5 text-[clamp(2.4rem,6vw,5.6rem)]">
              Thirty-eight people. One secretariat.
            </h2>
          </div>
          <p className="max-w-lg text-lg text-ink-soft lg:justify-self-end" data-reveal>
            MMUN is a non-profit run wholly by young people. The Executive Council runs the conference and its regions, the
            Secretariat looks after every delegate, and the Advisory Council keeps the founders close.
          </p>
        </div>

        {/* Controls: council tabs with a sliding highlight, and a search */}
        <div className="mt-12 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between" data-reveal>
          <div className="-mx-5 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0">
            <div ref={tabs} role="group" aria-label="Filter by council" className="relative flex w-max gap-1 rounded-full border-2 border-ink bg-card p-1 shadow-[4px_4px_0_var(--color-ink)]">
              <span ref={pill} aria-hidden className="absolute top-1 bottom-1 left-0 rounded-full bg-ink transition-[transform,width] duration-500 ease-[cubic-bezier(0.34,1.4,0.64,1)]" />
              {(['all', 'executive', 'secretariat', 'advisory'] as Filter[]).map((f) => {
                const active = filter === f
                return (
                  <button
                    key={f}
                    type="button"
                    aria-pressed={active}
                    onClick={() => change(() => setFilter(f))}
                    className={`relative z-10 flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-bold whitespace-nowrap transition-colors duration-300 sm:px-5 ${active ? 'text-paper' : 'text-ink hover:text-un'}`}
                  >
                    {f === 'all' ? 'Everyone' : councils.find((c) => c.id === f)!.label}
                    <span className={`rounded-full px-2 py-0.5 font-mono text-[0.7rem] ${active ? 'bg-orange text-ink' : 'bg-ink/10'}`}>{count(f)}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <label className="relative flex min-h-12 w-full items-center rounded-full border-2 border-ink bg-card shadow-[4px_4px_0_var(--color-ink)] lg:w-[22rem]">
            <span className="sr-only">Search the team</span>
            <svg aria-hidden viewBox="0 0 24 24" className="ml-4 size-5 shrink-0 text-ink-soft" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => {
                const v = e.target.value
                change(() => setQuery(v))
              }}
              placeholder="Search a name or a role"
              className="min-w-0 flex-1 bg-transparent px-3 py-3 font-medium outline-none placeholder:text-ink-soft/80"
            />
          </label>
        </div>

        <p className="mt-5 font-mono text-xs tracking-[0.18em] text-ink-soft uppercase" aria-live="polite">
          {shown.size === team.length ? `All ${team.length} members` : `Showing ${shown.size} of ${team.length}`}
        </p>

        <ul ref={grid} className="mt-8 grid grid-flow-dense grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-5">
          {team.map((m) => (
            <MemberCard key={m.name} m={m} hidden={!shown.has(m.name)} />
          ))}
        </ul>

        {shown.size === 0 && (
          <div className="mt-6 rounded-3xl border-2 border-dashed border-ink/40 p-10 text-center">
            <p className="font-display text-3xl">No one by that name yet.</p>
            <p className="mt-2 text-ink-soft">Try a role instead, like “marketing” or “delegate affairs”.</p>
            <button type="button" onClick={() => change(() => (setQuery(''), setFilter('all')))} className="btn btn-blue mt-6">
              Show everyone
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

function MemberCard({ m, hidden }: { m: Member; hidden: boolean }) {
  const t = tone[m.council]
  const contact = contacts.find((c) => c.name === m.name)
  const wide = !!contact
  const card = useRef<HTMLDivElement>(null)

  // A gentle 3D lean towards the pointer
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !card.current) return
    const r = card.current.getBoundingClientRect()
    card.current.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 14}deg`)
    card.current.style.setProperty('--rx', `${-((e.clientY - r.top) / r.height - 0.5) * 10}deg`)
  }
  const onLeave = () => {
    card.current?.style.setProperty('--ry', '0deg')
    card.current?.style.setProperty('--rx', '0deg')
  }

  return (
    <li data-member hidden={hidden} className={`member ${wide ? 'col-span-2' : ''}`} data-cursor={`Hi, ${firstName(m.name)}`}>
      <div>
        <div ref={card} onPointerMove={onMove} onPointerLeave={onLeave} className="member-card group relative">
          <div className={`member-frame relative overflow-hidden rounded-[1.4rem] border-2 border-ink ${wide ? 'aspect-[8/5]' : 'aspect-[4/5]'} ${m.photo ? 'bg-ink' : 'member-tile'}`} style={{ '--tone': t.color, '--on': t.on } as React.CSSProperties}>
            {m.photo ? (
              <>
                <Picture
                  name={m.photo}
                  alt={`${m.name}, ${m.role}`}
                  sizes={wide ? '(min-width: 1024px) 40vw, 100vw' : '(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 48vw'}
                  className={`member-photo h-full w-full object-cover ${wide ? 'object-[50%_18%]' : ''}`}
                />
                <span aria-hidden className="member-duo absolute inset-0 bg-un mix-blend-multiply" />
                <span aria-hidden className="member-glow absolute inset-0 bg-orange mix-blend-screen" />
              </>
            ) : (
              <span aria-hidden className="member-mono absolute inset-0 grid place-items-center">
                <Crown className="absolute -right-6 -bottom-4 w-[85%] opacity-15" />
                <span className="font-display text-[clamp(3.5rem,8vw,6rem)] leading-none font-medium tracking-[-0.06em]">{initials(m.name)}</span>
              </span>
            )}
            <span aria-hidden className={`member-shutter absolute inset-0 z-10 ${m.photo ? t.band : 'bg-ink'}`} />
            <span className={`absolute top-3 left-3 z-20 rounded-full border-2 border-ink px-2.5 py-1 font-mono text-[0.62rem] font-semibold tracking-[0.16em] uppercase ${t.tag}`}>
              {t.short}
            </span>
          </div>

          {/* The desk nameplate */}
          <div className="member-plate relative mx-2 -mt-7 rounded-xl border-2 border-ink bg-card shadow-[0_4px_0_var(--color-ink)]">
            <span aria-hidden className={`block h-1.5 rounded-t-[0.6rem] ${t.band}`} />
            <div className="px-3 pt-2 pb-3 sm:px-4">
              <p className="font-display text-[clamp(0.95rem,1.3vw,1.1rem)] leading-[1.1] font-semibold tracking-[-0.01em] [overflow-wrap:anywhere] uppercase">{m.name}</p>
              <p className="mt-1 line-clamp-2 min-h-[2.5em] font-mono text-[0.72rem] leading-[1.25] tracking-[0.04em] text-ink-soft uppercase" title={m.also ? `${m.role} · ${m.also}` : m.role}>
                {m.role}
                {m.also && <span className="sr-only"> · {m.also}</span>}
              </p>
            </div>
          </div>
        </div>
        {contact && (
          <a href={`tel:${contact.tel}`} className="member-cta btn btn-line mt-4 w-full" data-magnet>
            Call {firstName(m.name)} · {contact.phone} <Arrow className="size-4" />
          </a>
        )}
      </div>
    </li>
  )
}
