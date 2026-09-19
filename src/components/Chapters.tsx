import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  awards,
  committees,
  contacts,
  gallery,
  manifesto,
  org,
  partners,
  recognitions,
  registration,
  speaker,
  stats,
  theme,
} from '../data/content'
import { CrownStage } from './CrownStage'
import { Arrow, Chamber, Crown, Laurel, Picture, Press } from './ui'


/* ------------------------------------------------------------ 02 Manifesto */

export function Manifesto() {
  return (
    <section id="manifesto" data-chapter="Who we are" className="relative bg-paper py-20 sm:py-28">
      <div className="wrap grid gap-12 lg:grid-cols-[0.8fr_2fr]">
        <div>
          <p className="kicker relative z-10 text-orange-deep" data-reveal>
            Who we are
          </p>
          <div className="mt-14 hidden lg:block" data-speed="0.92">
            <div data-mask-img className="overflow-hidden rounded-[1.5rem]">
              <Picture name="delegate-bw" alt="A delegate leans in to speak during a session" sizes="22rem" className="aspect-[4/5] w-full object-cover" />
            </div>
          </div>
        </div>
        <div>
          <p data-scrub-words className="font-display text-[clamp(1.9rem,4.2vw,4.1rem)] leading-[1.1] tracking-[-0.03em]">
            {manifesto}
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              ['Non-profit', 'Run wholly by young people from diverse backgrounds.'],
              ['SDG focus', 'The UN Sustainable Development Goals, with a special focus on youth.'],
              ['Since inception', 'Applications from across India and a few neighbouring countries.'],
            ].map(([t, b]) => (
              <div key={t} data-reveal className="border-t-2 border-ink pt-5">
                <p className="font-display text-2xl text-un">{t}</p>
                <p className="mt-2 text-ink-soft">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ 03 Theme */

export function Theme() {
  return (
    <section id="theme" data-chapter="The theme" data-theme-pin className="relative h-[100svh] overflow-hidden bg-un text-white" aria-labelledby="theme-title">
      {theme.words.map((w, i) => (
        <div key={w.word} data-theme-image className="absolute inset-0 [clip-path:circle(0%_at_50%_55%)]" style={{ zIndex: i + 1 }}>
          <Picture name={w.image} alt="" sizes="100vw" className="h-full w-full object-cover contrast-125 grayscale" />
          {/* A deliberate UN-blue duotone: bright, legible, and kind to soft crops */}
          <div className="absolute inset-0 bg-un mix-blend-multiply opacity-80" />
          <div className="absolute inset-0 bg-ink/25" />
        </div>
      ))}

      <div className="wrap pointer-events-none absolute inset-x-0 top-24 z-10 flex items-center justify-between">
        <h2 id="theme-title" className="kicker text-white">
          Theme of the 7th edition
        </h2>
        <p className="hidden rounded-full bg-ink/55 px-4 py-2 font-mono text-xs tracking-[0.2em] text-white uppercase backdrop-blur-sm sm:block">Renewal · Rebirth · A whole new era</p>
      </div>

      {theme.words.map((w, i) => (
        <div key={w.word} data-theme-panel className="absolute inset-0 z-10 grid place-items-center px-5 text-center">
          <div>
            <p data-theme-rest className="inline-block rounded-full bg-ink/55 px-4 py-1.5 font-mono text-sm tracking-[0.3em] text-white uppercase opacity-0 backdrop-blur-sm">
              {String(i + 1).padStart(2, '0')} · {w.meaning}
            </p>
            <p data-theme-word className="mt-4 font-display text-[clamp(3.2rem,13vw,15rem)] leading-[1.05] font-medium tracking-[-0.04em] opacity-0">
              {w.word}
            </p>
            <p data-theme-rest className="mx-auto mt-6 max-w-xl text-lg opacity-0 [text-shadow:0_1px_14px_rgb(19_34_58/0.8)] sm:text-xl">
              {w.body}
            </p>
          </div>
        </div>
      ))}

      <p className="absolute inset-x-0 bottom-8 z-10 px-5 text-center font-display text-lg italic sm:text-2xl">“{theme.motto}”</p>
    </section>
  )
}

/* ------------------------------------------------------------ 04 Numbers */

export function Numbers() {
  return (
    <section id="numbers" data-chapter="In numbers" className="relative overflow-hidden bg-orange py-20 sm:py-28">
      <Crown aria-hidden className="pointer-events-none absolute -top-16 -right-24 w-[34rem] text-ink/[0.07]" data-speed="0.8" />
      <div className="wrap relative">
        <p className="kicker" data-reveal>
          In numbers
        </p>
        <h2 data-split="words" className="mt-5 max-w-3xl text-[clamp(2.4rem,6vw,5.6rem)]">
          One of the largest MUNs in the Northeast.
        </h2>
        <div className="mt-16 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} data-flip className="border-t-2 border-ink pt-6">
              <p className="font-display text-[clamp(4rem,9vw,7.5rem)] leading-none font-medium tracking-[-0.04em]">
                <span data-count={s.value}>{s.value}</span>
                <span className="align-top text-[0.45em] text-ink">{s.suffix}</span>
              </p>
              <p className="mt-3 max-w-xs font-medium text-ink">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ 05 Committees */

const emblem = { un: Laurel, india: Chamber, press: Press }


export function Committees() {
  const [flipped, setFlipped] = useState<Set<string>>(new Set())
  const toggle = (code: string) =>
    setFlipped((prev) => {
      const next = new Set(prev)
      if (next.has(code)) next.delete(code)
      else next.add(code)
      return next
    })
  return (
    <section id="committees" data-chapter="Committees" data-hscroll className="relative h-[100svh] overflow-hidden bg-un text-white" aria-labelledby="committees-title">
      <div className="wrap flex h-full flex-col justify-center gap-8 lg:gap-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="kicker text-white">Eight committees</p>
            <h2 id="committees-title" className="mt-4 text-[clamp(2.2rem,5.5vw,5rem)]">
              Three days. Eight rooms. <em className="whitespace-nowrap text-white underline decoration-orange decoration-4 underline-offset-8">One world.</em>
            </h2>
          </div>
        </div>

        <div className="[perspective:1400px]">
          <div data-htrack className="-mx-5 flex w-max gap-[4vw] px-[8vw] [transform-style:preserve-3d] sm:mx-0 sm:gap-7 sm:px-0 sm:pr-[10vw]">
            {committees.map((c, i) => {
              const Icon = emblem[c.kind]
              const isFlipped = flipped.has(c.code)
              return (
                <article
                  key={c.code}
                  data-hcard
                  className="relative h-[min(50svh,25rem)] w-[84vw] shrink-0 sm:h-[min(60svh,30rem)] [transform-style:preserve-3d] sm:w-[min(82vw,24rem)]"
                >
                  <button
                    type="button"
                    onClick={() => toggle(c.code)}
                    aria-pressed={isFlipped}
                    data-cursor={isFlipped ? 'Back' : 'Flip'}
                    className={`relative block size-full text-left transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d] ${
                      isFlipped ? '[transform:rotateY(180deg)]' : ''
                    }`}
                  >
                    {/* Front */}
                    <span
                      className={`absolute inset-0 flex flex-col justify-between overflow-hidden rounded-[1.75rem] p-7 shadow-[0_30px_60px_-30px_rgb(19_34_58/0.6)] [backface-visibility:hidden] sm:p-8 ${c.tint}`}
                    >
                      <Crown aria-hidden className="pointer-events-none absolute -top-6 -right-8 w-44 opacity-[0.09]" />
                      <span className="relative flex items-start justify-between">
                        <Icon className="size-16" />
                        <span className="font-mono text-sm opacity-70">
                          {String(i + 1).padStart(2, '0')} / {String(committees.length).padStart(2, '0')}
                        </span>
                      </span>
                      <span>
                        <span className="block font-display text-[clamp(3.2rem,7vw,5rem)] leading-none font-medium tracking-[-0.04em]">{c.code}</span>
                        <span className="mt-3 block text-lg font-bold">{c.name}</span>
                        <span className="mt-5 inline-flex items-center gap-2 font-mono text-xs tracking-[0.18em] uppercase opacity-80">
                          <span aria-hidden className="grid size-7 place-items-center rounded-full border-2 border-current">↻</span>
                          <span className="pointer-coarse:hidden">Click to turn over</span>
                          <span className="hidden pointer-coarse:inline">Tap to turn over</span>
                        </span>
                      </span>
                    </span>
                    {/* Back */}
                    <span className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-[1.75rem] bg-ink p-7 text-white shadow-[0_30px_60px_-30px_rgb(19_34_58/0.6)] [backface-visibility:hidden] [transform:rotateY(180deg)] sm:p-8">
                      <span className="flex items-center justify-between">
                        <span className="font-display text-4xl">{c.code}</span>
                        <Icon className="size-10 text-orange" />
                      </span>
                      <span className="text-lg">{c.body}</span>
                      <span className="font-mono text-xs tracking-[0.18em] text-white/80 uppercase">
                        {c.kind === 'un' ? 'United Nations body' : c.kind === 'india' ? 'Indian parliamentary body' : 'Press corps'}
                      </span>
                    </span>
                  </button>
                </article>
              )
            })}
          </div>
        </div>

        <div className="h-[3px] w-full rounded-full bg-white/25">
          <div data-hbar className="h-[3px] origin-left scale-x-0 rounded-full bg-orange" />
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ 06 Speaker */

export function Speaker() {
  return (
    <section id="speaker" data-chapter="Guest speaker" data-spotlight className="relative overflow-hidden bg-paper pt-16 pb-20 sm:pt-20 sm:pb-24">
      <div
        data-spot-light
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 size-[38rem] rounded-full max-lg:hidden bg-[radial-gradient(circle,rgb(207_226_245/0.95)_0%,transparent_65%)]"
      />
      <div className="wrap relative grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div data-spot-frame className="relative overflow-hidden rounded-[1.75rem]" data-cursor="UNODC">
          <Picture name={speaker.image} alt={`${speaker.name} speaking`} sizes="(min-width: 1024px) 40vw, 90vw" className="aspect-[4/5] w-full object-cover lg:aspect-[5/6]" />
          <span className="absolute top-5 left-5 rounded-full bg-un px-4 py-2 font-mono text-xs tracking-[0.18em] text-white uppercase">{speaker.role}</span>
        </div>
        <div>
          <p className="kicker text-orange-deep" data-reveal>
            Expert guest speaker
          </p>
          <h2 data-split="chars" className="mt-5 text-[clamp(2.6rem,6vw,5.4rem)]">
            {speaker.name}
          </h2>
          <p className="mt-3 font-display text-2xl text-un italic" data-reveal>
            {speaker.honorific}
          </p>
          <ul className="mt-10 grid gap-6">
            {speaker.lines.map((line, i) => (
              <li key={line} data-reveal className="flex gap-5 border-t-2 border-ink/15 pt-5">
                <span className="font-mono text-sm text-orange-deep">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-lg">{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ 07 In frames */

export function Frames() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="frames" data-chapter="In frames" className="relative overflow-hidden bg-sky pt-20 sm:pt-28" aria-labelledby="frames-title">
      <div className="wrap">
        <p className="kicker text-un-deep" data-reveal>
          The 7th edition, in frames
        </p>
        <h2 id="frames-title" data-split="words" className="mt-5 max-w-4xl text-[clamp(2.4rem,6.5vw,6rem)]">
          Three days, told in the moments between the motions.
        </h2>
      </div>

      {/* A 3D reel of every photo: scroll turns it, drag spins it, tap opens one */}
      <div data-reel className="reel relative mt-6 h-[62svh] min-h-[26rem] sm:mt-10 sm:h-[70svh] sm:min-h-[30rem] touch-pan-y select-none">
        <div className="reel-stage absolute inset-0 [perspective:1300px]">
          <div data-reel-ring className="reel-ring absolute top-1/2 left-1/2 [transform-style:preserve-3d]">
            {gallery.map((g, i) => (
              <button
                key={g.image}
                type="button"
                data-reel-item
                onClick={(e) => {
                  if ((e.currentTarget.closest('[data-reel]') as HTMLElement)?.dataset.dragged === '1') return
                  setOpen(i)
                }}
                data-cursor="View"
                className="reel-item absolute top-0 left-0 block w-[58vw] overflow-hidden rounded-[1.25rem] bg-ink text-left shadow-[0_30px_60px_-30px_rgb(19_34_58/0.6)] [backface-visibility:visible] sm:w-[19rem] lg:w-[21rem]"
              >
                <Picture name={g.image} alt={g.caption} sizes="(min-width: 1024px) 21rem, 58vw" className="aspect-[3/4] w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
        <p className="reel-caption pointer-events-none absolute inset-x-0 bottom-6 z-10 text-center" aria-live="polite">
          <span data-reel-caption className="inline-block rounded-full bg-ink px-5 py-2 font-mono text-sm tracking-[0.16em] text-white uppercase">
            {gallery[0].caption}
          </span>
        </p>
        <p className="wrap pointer-events-none absolute inset-x-0 top-2 text-right font-mono text-xs tracking-[0.18em] text-ink uppercase">
          Scroll or drag to turn
        </p>
      </div>

      {/* The three words every MUN runs on, racing sideways with the scroll */}
      <div className="mt-16 overflow-hidden bg-orange py-4 text-ink sm:mt-20" aria-hidden>
        <div data-marquee="left" className="marquee">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="flex items-center gap-8 pr-8 font-display text-[clamp(2.4rem,6vw,5rem)] font-medium tracking-[-0.03em] whitespace-nowrap">
              Diplomacy <Crown className="h-7 w-9 shrink-0" /> Dialogue <Crown className="h-7 w-9 shrink-0" /> Debate
              <Crown className="h-7 w-9 shrink-0" />
            </span>
          ))}
        </div>
      </div>

      <Lightbox index={open} onClose={() => setOpen(null)} onMove={(d) => setOpen((i) => (i === null ? i : (i + d + gallery.length) % gallery.length))} />
    </section>
  )
}

function Lightbox({ index, onClose, onMove }: { index: number | null; onClose: () => void; onMove: (d: number) => void }) {
  useEffect(() => {
    if (index === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onMove(1)
      if (e.key === 'ArrowLeft') onMove(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, onClose, onMove])

  if (index === null) return null
  const g = gallery[index]
  // Rendered at the page root: inside the pinned, transformed section a
  // fixed overlay would be positioned against the section, not the screen.
  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={g.caption} className="fixed inset-0 z-[130] grid place-items-center bg-un/95 p-5 text-white" onClick={onClose}>
      <figure className="max-h-full max-w-5xl animate-[lightbox_0.5s_cubic-bezier(0.22,1,0.36,1)]" onClick={(e) => e.stopPropagation()}>
        <Picture name={g.image} alt={g.caption} sizes="90vw" eager className="max-h-[78svh] w-auto rounded-2xl object-contain" />
        <figcaption className="mt-4 flex items-center justify-between gap-4">
          <span className="font-display text-2xl">{g.caption}</span>
          <span className="flex gap-2">
            <button type="button" onClick={() => onMove(-1)} className="btn btn-line min-h-11 px-4" aria-label="Previous photo">
              <Arrow className="size-4 rotate-180" />
            </button>
            <button type="button" onClick={() => onMove(1)} className="btn btn-line min-h-11 px-4" aria-label="Next photo">
              <Arrow className="size-4" />
            </button>
            <button type="button" onClick={onClose} className="btn btn-orange min-h-11 px-5">
              Close
            </button>
          </span>
        </figcaption>
      </figure>
    </div>
    ,
    document.body,
  )
}

/* ------------------------------------------------------------ 08 Recognition */

const stackTints = ['bg-un text-white', 'bg-card text-ink', 'bg-orange text-ink', 'bg-pine text-white', 'bg-ink text-white', 'bg-card text-ink']

export function Recognition() {
  return (
    <section id="recognition" data-chapter="Recognition" data-stack className="relative overflow-hidden bg-sky py-28 lg:h-[100svh] lg:py-0" aria-labelledby="recognition-title">
      <div className="wrap grid h-full gap-10 lg:grid-cols-[1fr_1.25fr] lg:items-center lg:gap-16">
        <div>
          <p className="kicker text-un-deep" data-reveal>
            Recognition
          </p>
          <h2 id="recognition-title" data-split="words" className="mt-5 text-[clamp(2.4rem,5.4vw,5.2rem)]">
            Backed by the institutions that shape public life.
          </h2>
          <p className="mt-6 hidden items-center gap-4 font-mono text-sm tracking-[0.18em] uppercase lg:flex" aria-hidden>
            <span data-stack-count className="text-un-deep">
              01
            </span>
            <span className="h-[2px] w-16 bg-ink/20">
              <span data-stack-bar className="block h-[2px] origin-left scale-x-0 bg-un-deep" />
            </span>
            <span>0{recognitions.length}</span>
          </p>
        </div>

        <ol data-stack-deck className="relative grid gap-5 lg:block lg:h-[min(62svh,30rem)]">
          {recognitions.map((r, i) => (
            <li
              key={r.title}
              data-stack-card
              className={`flex flex-col justify-between gap-8 rounded-[1.75rem] p-7 shadow-[0_40px_70px_-35px_rgb(19_34_58/0.55)] sm:p-9 lg:absolute lg:inset-0 ${stackTints[i % stackTints.length]}`}
              style={{ zIndex: i + 1 }}
            >
              <div className="flex items-start justify-between gap-6">
                <span className="font-mono text-sm tracking-[0.18em] uppercase">Recognition · 0{i + 1}</span>
                <Crown className="h-8 w-11 shrink-0 opacity-80" />
              </div>
              <div>
                <h3 className="text-[clamp(2rem,4vw,3.4rem)]">{r.title}</h3>
                <p className="mt-4 max-w-xl text-lg">{r.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ 09 Partners */

export function Partners() {
  const all = partners.flatMap((p) => p.names.map((n) => ({ name: n, group: p.group })))
  const half = Math.ceil(all.length / 2)
  const rows = [all.slice(0, half), all.slice(half)]
  return (
    <section id="partners" data-chapter="Partners" className="relative overflow-hidden bg-paper py-20 sm:py-28" aria-labelledby="partners-title">
      <div className="wrap">
        <p className="kicker text-orange-deep" data-reveal>
          Partners of the 7th edition
        </p>
        <h2 id="partners-title" data-split="words" className="mt-5 max-w-3xl text-[clamp(2.4rem,6vw,5.2rem)]">
          It took a whole state.
        </h2>
      </div>

      {/* Screen readers get the plain list; the marquees are decoration */}
      <ul className="sr-only">
        {all.map((p) => (
          <li key={p.name}>
            {p.name}, {p.group}
          </li>
        ))}
      </ul>
      <div className="mt-14 grid" aria-hidden>
        {rows.map((row, r) => (
          <div key={r} className={`overflow-hidden py-6 ${r ? 'bg-un text-white' : 'border-y-2 border-ink'}`}>
            <div data-marquee={r ? 'right' : 'left'} className="marquee">
              {[...row, ...row].map((p, i) => (
                <span key={i} className="flex items-center gap-6 pr-10 whitespace-nowrap">
                  <span className="font-display text-[clamp(2rem,5vw,4.4rem)] font-medium tracking-[-0.03em]">{p.name}</span>
                  <span className={`rounded-full px-3 py-1 font-mono text-xs tracking-[0.16em] uppercase ${r ? 'bg-white/15' : 'bg-ink text-paper'}`}>
                    {p.group}
                  </span>
                  <Crown className="h-6 w-8 shrink-0 text-orange" />
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ 10 Join */

export function Join() {
  return (
    <section id="join" data-chapter="Join" className="relative overflow-hidden bg-pine pb-20 text-white sm:pb-28" aria-labelledby="join-title">
      <CrownStage />
      <div className="wrap relative grid gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
        <div>
          <p className="kicker text-white" data-reveal>
            The 8th edition
          </p>
          <h2 id="join-title" data-split="words" className="mt-5 text-[clamp(2.8rem,7vw,6.6rem)]">
            Take your seat in the chamber.
          </h2>
          <p className="mt-6 max-w-lg text-lg text-white/85" data-reveal>
            {registration.nextEdition} Join to hear first about dates, committees and campus ambassador calls.
          </p>
          <div className="mt-10 flex flex-wrap gap-3" data-reveal>
            <a href={org.whatsappCommunity} target="_blank" rel="noopener" className="btn btn-orange" data-magnet data-cursor="Join">
              Join the WhatsApp community <Arrow className="size-4" />
            </a>
            <a href={`mailto:${org.email}`} className="btn btn-line" data-magnet>
              {org.email}
            </a>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2">
            {contacts.map((c) => (
              <a key={c.name} href={`tel:${c.tel}`} data-reveal data-cursor="Call" className="group rounded-[1.25rem] border-2 border-white/30 p-6 transition-colors hover:border-white hover:bg-white hover:text-ink">
                <p className="font-mono text-xs tracking-[0.2em] text-white/80 uppercase group-hover:text-orange-deep">{c.role}</p>
                <p className="mt-2 font-display text-2xl">{c.name}</p>
                <p className="mt-1 text-white/80 group-hover:text-ink-soft">{c.phone}</p>
              </a>
            ))}
          </div>
        </div>

        <div className="grid gap-6">
          <div data-reveal className="rounded-[1.75rem] bg-orange p-8 text-ink sm:p-10">
            <p className="font-mono text-xs tracking-[0.2em] uppercase">Last edition’s delegate fee</p>
            <p className="mt-3 font-display text-[clamp(4rem,9vw,6.5rem)] leading-none font-medium tracking-[-0.04em]">₹{registration.fee.toLocaleString('en-IN')}</p>
            <p className="mt-2 font-semibold">{registration.note}</p>
            <ul className="mt-6 grid gap-2">
              {registration.covers.map((c) => (
                <li key={c} className="flex gap-3">
                  <span aria-hidden className="text-orange-deep">✦</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <ul data-reveal className="grid gap-2 border-t-2 border-white/30 pt-5">
            {registration.extras.map((x) => (
              <li key={x} className="flex gap-3">
                <span aria-hidden className="text-orange">✦</span>
                {x}
              </li>
            ))}
          </ul>
          <div data-reveal className="border-t-2 border-white/30 pt-5">
            <p className="font-mono text-xs tracking-[0.2em] text-white uppercase">Awards</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {awards.map((a) => (
                <div key={a.group}>
                  <p className="font-display text-xl">{a.group}</p>
                  <ul className="mt-1 text-sm text-white/85">
                    {a.names.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
