import { useEffect, useMemo, useRef, useState } from 'react'
import { committees, contacts, org, team } from '../data/content'
import type { GlobeApi } from '../lib/globe'
import { Arrow, Crown, Laurel } from './ui'

const motionOn = () => typeof document !== 'undefined' && document.documentElement.dataset.motion !== 'off'

/* ------------------------------------------------------------ One world (3D globe) */

export function World() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const api = useRef<GlobeApi | null>(null)

  useEffect(() => {
    const el = canvas.current
    if (!el) return
    let cancelled = false
    // Load the globe only as it approaches the screen
    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || api.current) return
        io.disconnect()
        const { createGlobe } = await import('../lib/globe')
        if (cancelled) return
        api.current = createGlobe(el, { animate: motionOn() })
        ;(window as Window & { __mmunGlobe?: GlobeApi }).__mmunGlobe = api.current
        window.dispatchEvent(new CustomEvent('globe:ready', { detail: api.current }))
      },
      { rootMargin: '600px' },
    )
    io.observe(el)
    return () => {
      cancelled = true
      io.disconnect()
      api.current?.destroy()
    }
  }, [])

  return (
    <section id="world" data-chapter="One world" data-world className="relative overflow-hidden bg-un py-16 text-white sm:py-24" aria-labelledby="world-title">
      <div className="wrap grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-6">
        <div className="relative z-10">
          <p className="kicker text-white" data-reveal>
            One world, one room
          </p>
          <h2 id="world-title" data-split="words" className="mt-5 text-[clamp(2.6rem,6vw,5.8rem)]">
            From Shillong, young delegates take on the world’s agenda.
          </h2>
          <p className="mt-6 max-w-lg text-lg text-white" data-reveal>
            Applications arrive from across India and neighbouring countries. For three days, a college in the hills of
            Meghalaya becomes the United Nations.
          </p>
          <p className="mt-8 border-t-2 border-white/30 pt-6 font-display text-2xl sm:text-3xl" data-reveal>
            Delegates from <span className="underline decoration-orange decoration-4 underline-offset-8">3+ nations</span>, in the heart of the Khasi Hills.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <p className="flex items-center gap-3 font-mono text-xs tracking-[0.18em] text-white uppercase">
              <span aria-hidden className="grid size-8 place-items-center rounded-full border-2 border-white/60">↔</span>
              Drag the globe to spin it
            </p>
            <button
              type="button"
              onClick={() => api.current?.home()}
              className="rounded-full bg-orange px-5 py-2.5 font-mono text-xs font-semibold tracking-[0.18em] text-ink uppercase transition-transform hover:-translate-y-0.5"
              data-magnet
            >
              Fly to Shillong
            </button>
          </div>
        </div>

        <div data-world-stage className="relative mx-auto aspect-square w-full max-w-[40rem] [perspective:1200px]">
          <div aria-hidden className="absolute inset-[6%] rounded-full bg-orange/30 blur-3xl" />
          <canvas
            ref={canvas}
            data-cursor="Drag"
            className="relative size-full touch-pan-y"
            aria-label="A spinning globe of dots with a beacon over Shillong, Meghalaya. Drag to rotate."
            role="img"
          />
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ Team */

export function Team() {
  const [flipped, setFlipped] = useState<string | null>(null)
  return (
    <section id="team" data-chapter="The team" className="relative overflow-hidden bg-paper pt-6 pb-20 sm:pt-10 sm:pb-28" aria-labelledby="team-title">
      <div className="wrap">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <p className="kicker text-orange-deep" data-reveal>
              Meet the team
            </p>
            <h2 id="team-title" data-split="words" className="mt-5 text-[clamp(2.4rem,6vw,5.6rem)]">
              Run by young people, for young people.
            </h2>
          </div>
          <p className="max-w-lg text-lg text-ink-soft lg:justify-self-end" data-reveal>
            MMUN is a non-profit made up wholly of youth from diverse backgrounds. The secretariat plans every committee,
            speaker and night of the conference. Turn a card over to meet them.
          </p>
        </div>

        <ul className="mt-16 grid gap-6 [perspective:1600px] md:grid-cols-2 lg:grid-cols-3">
          {team.map((m, i) => {
            const isFlipped = flipped === m.name
            const contact = contacts.find((c) => c.name === m.name)
            return (
              <li key={m.name} data-team-card className="grid gap-3" style={{ transitionDelay: `${i * 60}ms` }}>
                <button
                  type="button"
                  onClick={() => setFlipped(isFlipped ? null : m.name)}
                  aria-pressed={isFlipped}
                  data-cursor="Flip"
                  data-tilt
                  className="group relative block h-[19rem] w-full text-left [transform-style:preserve-3d] sm:h-[23rem]"
                >
                  <span
                    className={`relative block size-full rounded-[1.75rem] transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d] ${
                      isFlipped ? '[transform:rotateY(180deg)]' : ''
                    }`}
                  >
                    {/* Front */}
                    <span className={`absolute inset-0 flex flex-col justify-between overflow-hidden rounded-[1.75rem] p-8 [backface-visibility:hidden] ${m.tint}`}>
                      <span className="flex items-start justify-between">
                        <span className="font-mono text-xs tracking-[0.2em] uppercase opacity-80">{m.group}</span>
                        <Crown className="h-7 w-9 opacity-70" />
                      </span>
                      <span aria-hidden className="font-display text-[5.5rem] leading-none font-medium tracking-[-0.06em] opacity-95 transition-transform duration-700 group-hover:-translate-y-2 sm:text-[7rem]">
                        {m.initials}
                      </span>
                      <span>
                        <span className="block font-display text-3xl">{m.name}</span>
                        <span className="mt-1 block font-mono text-xs tracking-[0.18em] uppercase opacity-80">{m.role}</span>
                        <span className="mt-4 inline-flex items-center gap-2 font-mono text-xs tracking-[0.18em] uppercase opacity-80">
                          <span aria-hidden className="grid size-7 place-items-center rounded-full border-2 border-current">↻</span>
                          <span className="pointer-coarse:hidden">Click to turn over</span>
                          <span className="hidden pointer-coarse:inline">Tap to turn over</span>
                        </span>
                      </span>
                    </span>
                    {/* Back */}
                    <span className="absolute inset-0 flex flex-col justify-between rounded-[1.75rem] bg-ink p-8 text-white [backface-visibility:hidden] [transform:rotateY(180deg)]">
                      <span className="font-mono text-xs tracking-[0.2em] uppercase opacity-80">{m.role}</span>
                      <span className="text-lg">{m.about}</span>
                      <span className="text-white/85">{org.email}</span>
                    </span>
                  </span>
                </button>
                {contact ? (
                  <a href={`tel:${contact.tel}`} className="btn btn-line w-full">
                    Call {m.name.replace(/^Md\.\s*/, '').split(' ')[0]} · {contact.phone} <Arrow className="size-4" />
                  </a>
                ) : (
                  <a href={org.whatsappCommunity} target="_blank" rel="noopener" className="btn btn-line w-full">
                    Ask about becoming one <Arrow className="size-4" />
                  </a>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ Raise your placard (3D) */

const COUNTRIES = [
  'Afghanistan', 'Argentina', 'Australia', 'Bangladesh', 'Bhutan', 'Brazil', 'Canada', 'China', 'Egypt', 'Ethiopia',
  'France', 'Germany', 'Ghana', 'India', 'Indonesia', 'Iran', 'Israel', 'Italy', 'Japan', 'Kenya', 'Kingdom of Thailand',
  'Malaysia', 'Maldives', 'Mexico', 'Myanmar', 'Nepal', 'Netherlands', 'New Zealand', 'Nigeria', 'Norway', 'Pakistan',
  'Palestine', 'Philippines', 'Qatar', 'Republic of Korea', 'Russian Federation', 'Saudi Arabia', 'Singapore',
  'South Africa', 'Spain', 'Sri Lanka', 'Sweden', 'Switzerland', 'Türkiye', 'Ukraine', 'United Arab Emirates',
  'United Kingdom', 'United States of America', 'Viet Nam',
]

export function Placard() {
  const [country, setCountry] = useState('Kingdom of Thailand')
  const [committee, setCommittee] = useState('UNHRC')
  const [raised, setRaised] = useState(false)
  const card = useRef<HTMLDivElement>(null)
  const flipKey = useMemo(() => `${country}-${committee}`, [country, committee])
  const tint = committees.find((c) => c.code === committee)?.tint ?? 'bg-pine text-white'

  // Pointer tilt on the placard (desktop pointers)
  useEffect(() => {
    const el = card.current
    if (!el || !motionOn() || !window.matchMedia('(pointer: fine)').matches) return
    const stage = el.parentElement!
    const move = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      el.style.setProperty('--ry', `${x * 30}deg`)
      el.style.setProperty('--rx', `${-y * 22}deg`)
    }
    const leave = () => {
      el.style.setProperty('--ry', '0deg')
      el.style.setProperty('--rx', '0deg')
    }
    stage.addEventListener('pointermove', move)
    stage.addEventListener('pointerleave', leave)
    return () => {
      stage.removeEventListener('pointermove', move)
      stage.removeEventListener('pointerleave', leave)
    }
  }, [])

  const share = `https://wa.me/?text=${encodeURIComponent(
    `I'm ready to represent ${country} in ${committee} at Meghalaya MUN's next edition. Join the community: ${org.whatsappCommunity}`,
  )}`

  return (
    <section id="placard" data-chapter="Your placard" className="relative overflow-hidden bg-sky py-20 sm:py-28" aria-labelledby="placard-title">
      <div className="wrap grid grid-cols-[minmax(0,1fr)] items-center gap-x-20 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:grid-rows-[auto_auto] lg:gap-y-0">
        <div className="min-w-0 lg:self-end">
          <p className="kicker text-un-deep" data-reveal>
            Try it on
          </p>
          <h2 id="placard-title" data-split="words" className="mt-5 text-[clamp(2.4rem,6vw,5.6rem)]">
            Raise your placard.
          </h2>
          <p className="mt-6 max-w-md text-lg text-ink" data-reveal>
            In committee, you speak only when your placard goes up. Pick a nation and a committee, and see yours.
          </p>
        </div>

        <div className="order-last min-w-0 lg:order-none lg:col-start-1 lg:row-start-2 lg:self-start">
          <div className="grid lg:mt-10 grid-cols-[minmax(0,1fr)] gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]" data-reveal>
            <label className="grid min-w-0 gap-2">
              <span className="font-mono text-xs tracking-[0.18em] uppercase">Your nation</span>
              <select
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value)
                  setRaised(false)
                }}
                className="min-h-12 rounded-full bg-card px-5 font-semibold ring-2 ring-ink/15 focus:ring-un"
              >
                {COUNTRIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="grid min-w-0 gap-2">
              <span className="font-mono text-xs tracking-[0.18em] uppercase">Committee</span>
              <select
                value={committee}
                onChange={(e) => {
                  setCommittee(e.target.value)
                  setRaised(false)
                }}
                className="min-h-12 rounded-full bg-card px-5 font-semibold ring-2 ring-ink/15 focus:ring-un"
              >
                {committees.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-3" data-reveal>
            <button type="button" onClick={() => setRaised((r) => !r)} className="btn btn-blue" data-magnet aria-pressed={raised}>
              {raised ? 'Lower placard' : 'Raise placard'}
            </button>
            <a href={share} target="_blank" rel="noopener" className="btn btn-line" data-magnet>
              Share on WhatsApp <Arrow className="size-4" />
            </a>
          </div>
        </div>

        <div className="relative grid h-[15rem] min-w-0 place-items-center [perspective:1100px] sm:h-[24rem] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:h-[30rem]" aria-live="polite">
          <div
            ref={card}
            className={`placard relative w-full max-w-[34rem] transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d] ${raised ? 'is-raised' : ''}`}
          >
            <div key={flipKey} className={`placard-face animate-[placard-in_0.8s_cubic-bezier(0.22,1,0.36,1)] overflow-hidden rounded-2xl shadow-[0_50px_80px_-40px_rgb(19_34_58/0.7)] ${tint}`}>
              <div className="flex items-center justify-between gap-4 bg-card px-5 py-3 text-ink">
                <span className="font-mono text-[0.7rem] tracking-[0.2em] uppercase">Meghalaya Model United Nations</span>
                <Crown className="h-5 w-7 text-un" />
              </div>
              <div className="flex items-center gap-5 px-6 py-8 sm:px-8 sm:py-10">
                <div className="min-w-0 flex-1">
                  <p className="font-display text-[clamp(1.6rem,4.4vw,3.2rem)] leading-[1.02] font-medium tracking-[-0.03em] break-words uppercase">
                    {country}
                  </p>
                  <p className="mt-3 font-mono text-sm tracking-[0.18em] uppercase opacity-85">Delegate · {committee}</p>
                </div>
                <Laurel className="size-16 shrink-0 opacity-90 sm:size-24" />
              </div>
            </div>
            {/* the tent-card fold, seen from the side */}
            <div aria-hidden className="mx-auto h-4 w-[92%] rounded-b-2xl bg-ink/25 blur-md" />
          </div>
        </div>
      </div>
    </section>
  )
}
