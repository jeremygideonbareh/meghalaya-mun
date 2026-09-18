import { useEffect, useState } from 'react'
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
import { Arrow, Chamber, Crown, Laurel, Picture, Press } from './ui'

/* ------------------------------------------------------------ 02 Manifesto */

export function Manifesto() {
  return (
    <section id="manifesto" data-chapter="Who we are" className="relative bg-paper py-28 sm:py-40">
      <div className="wrap grid gap-12 lg:grid-cols-[0.8fr_2fr]">
        <div>
          <p className="kicker text-orange-deep" data-reveal>
            Who we are
          </p>
          <div className="mt-8 hidden lg:block" data-speed="0.85">
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
          <Picture name={w.image} alt="" sizes="100vw" className="h-full w-full object-cover" />
          {/* UN-blue duotone wash keeps it bright and legible */}
          <div className="absolute inset-0 bg-un mix-blend-multiply opacity-80" />
          <div className="absolute inset-0 bg-ink/25" />
        </div>
      ))}

      <div className="wrap pointer-events-none absolute inset-x-0 top-24 z-10 flex items-center justify-between">
        <h2 id="theme-title" className="kicker text-white">
          Theme of the 7th edition
        </h2>
        <p className="hidden font-mono text-xs tracking-[0.2em] text-white/80 uppercase sm:block">Renewal · Rebirth · A whole new era</p>
      </div>

      {theme.words.map((w, i) => (
        <div key={w.word} data-theme-panel className="absolute inset-0 z-10 grid place-items-center px-5 text-center">
          <div>
            <p data-theme-rest className="font-mono text-sm tracking-[0.3em] text-white uppercase opacity-0">
              {String(i + 1).padStart(2, '0')} · {w.meaning}
            </p>
            <p data-theme-word className="mt-4 font-display text-[clamp(3.6rem,15vw,15rem)] leading-none font-medium tracking-[-0.04em] opacity-0">
              {w.word}
            </p>
            <p data-theme-rest className="mx-auto mt-6 max-w-xl text-lg opacity-0 sm:text-xl">
              {w.body}
            </p>
          </div>
        </div>
      ))}

      <p className="absolute inset-x-0 bottom-8 z-10 text-center font-display text-lg italic sm:text-2xl">“{theme.motto}”</p>
    </section>
  )
}

/* ------------------------------------------------------------ 04 Numbers */

export function Numbers() {
  return (
    <section id="numbers" data-chapter="In numbers" className="relative overflow-hidden bg-orange py-28 sm:py-40">
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
            <div key={s.label} data-reveal className="border-t-2 border-ink pt-6">
              <p className="font-display text-[clamp(4rem,9vw,7.5rem)] leading-none font-medium tracking-[-0.04em]">
                <span data-count={s.value}>{s.value}</span>
                <span className="align-top text-[0.45em] text-paper">{s.suffix}</span>
              </p>
              <p className="mt-3 max-w-xs font-medium text-ink/80">{s.label}</p>
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
  return (
    <section id="committees" data-chapter="Committees" data-hscroll className="relative h-[100svh] overflow-hidden bg-un text-white" aria-labelledby="committees-title">
      <div className="wrap flex h-full flex-col justify-center gap-8 lg:gap-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="kicker text-white">Eight committees</p>
            <h2 id="committees-title" className="mt-4 text-[clamp(2.2rem,5.5vw,5rem)]">
              Three days. Eight rooms. <em className="text-white underline decoration-orange decoration-4 underline-offset-8">One world.</em>
            </h2>
          </div>
          <p className="hidden max-w-xs text-white lg:block">Keep scrolling: the committees file past like delegations entering the hall.</p>
        </div>

        <div className="[perspective:1400px]">
          <div data-htrack className="flex w-max gap-5 pr-[10vw] [transform-style:preserve-3d] sm:gap-7">
            {committees.map((c, i) => {
              const Icon = emblem[c.kind]
              return (
                <article
                  key={c.code}
                  data-hcard
                  data-cursor="Debate"
                  className="relative flex h-[min(62svh,30rem)] w-[min(82vw,24rem)] shrink-0 flex-col justify-between overflow-hidden rounded-[1.75rem] bg-card p-7 text-ink shadow-[0_30px_60px_-30px_rgb(19_34_58/0.6)] [transform-style:preserve-3d] sm:p-8"
                >
                  <div className="flex items-start justify-between">
                    <Icon className={`size-16 ${c.kind === 'un' ? 'text-un' : c.kind === 'india' ? 'text-orange-deep' : 'text-pine'}`} />
                    <span className="font-mono text-sm text-ink-soft">
                      {String(i + 1).padStart(2, '0')} / {String(committees.length).padStart(2, '0')}
                    </span>
                  </div>
                  <div>
                    <p className="font-display text-[clamp(3.2rem,7vw,5rem)] leading-none font-medium tracking-[-0.04em] text-un">{c.code}</p>
                    <h3 className="mt-3 font-sans text-lg font-bold tracking-normal">{c.name}</h3>
                    <p className="mt-3 text-[0.98rem] text-ink-soft">{c.body}</p>
                  </div>
                  <Crown aria-hidden className="pointer-events-none absolute -right-10 -bottom-8 w-48 text-orange/15" />
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
    <section id="speaker" data-chapter="Guest speaker" data-spotlight className="relative overflow-hidden bg-paper py-28 sm:py-40">
      <div
        data-spot-light
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 size-[38rem] rounded-full bg-[radial-gradient(circle,rgb(207_226_245/0.95)_0%,transparent_65%)]"
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
  const cols = [gallery.slice(0, 6), gallery.slice(6, 12), gallery.slice(12, 18)]
  const speeds = [18, -24, 14]

  return (
    <section id="frames" data-chapter="In frames" className="relative overflow-hidden bg-card py-28 sm:py-40" aria-labelledby="frames-title">
      <div className="wrap">
        <p className="kicker text-orange-deep" data-reveal>
          The 7th edition, in frames
        </p>
        <h2 id="frames-title" data-split="words" className="mt-5 max-w-4xl text-[clamp(2.4rem,6.5vw,6rem)]">
          Three days, told in the moments between the motions.
        </h2>
      </div>

      <div className="wrap mt-16 grid grid-cols-2 gap-3 overflow-hidden sm:gap-5 lg:grid-cols-3">
        {cols.map((col, c) => (
          <div key={c} data-col-speed={speeds[c]} className={`grid content-start gap-3 sm:gap-5 ${c === 2 ? 'hidden lg:grid' : ''}`}>
            {col.map((g) => {
              const index = gallery.indexOf(g)
              return (
                <button key={g.image} type="button" onClick={() => setOpen(index)} data-cursor="View" className="group relative block overflow-hidden rounded-[1.25rem] text-left">
                  <Picture
                    name={g.image}
                    alt={g.caption}
                    sizes="(min-width: 1024px) 30vw, 46vw"
                    className="w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
                  />
                  <span className="absolute bottom-3 left-3 translate-y-2 rounded-full bg-paper px-3 py-1.5 text-sm font-bold opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    {g.caption}
                  </span>
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {/* A film strip that runs sideways as you scroll */}
      <div className="mt-20 overflow-hidden bg-orange-deep py-5" aria-hidden>
        <div data-film="left" className="flex w-max gap-4">
          {[...gallery, ...gallery].map((g, i) => (
            <div key={i} className="relative h-40 w-60 shrink-0 overflow-hidden rounded-lg ring-4 ring-paper sm:h-48 sm:w-72">
              <Picture name={g.image} alt="" sizes="18rem" className="h-full w-full object-cover" />
            </div>
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
  return (
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
  )
}

/* ------------------------------------------------------------ 08 Recognition */

export function Recognition() {
  return (
    <section id="recognition" data-chapter="Recognition" data-recognition className="relative bg-sky py-28 sm:py-40" aria-labelledby="recognition-title">
      <div className="wrap">
        <p className="kicker text-un-deep" data-reveal>
          Recognition
        </p>
        <h2 id="recognition-title" data-split="words" className="mt-5 max-w-4xl text-[clamp(2.4rem,6vw,5.6rem)]">
          Backed by the institutions that shape public life.
        </h2>

        <div className="relative mt-20">
          <svg aria-hidden className="absolute top-0 left-4 h-full w-8 lg:left-1/2 lg:-translate-x-1/2" viewBox="0 0 20 1000" preserveAspectRatio="none">
            <path data-draw-line d="M10 0 C 18 160, 2 330, 10 500 S 18 840, 10 1000" stroke="#2e77d0" strokeWidth="3" fill="none" vectorEffect="non-scaling-stroke" />
          </svg>
          <ol className="grid gap-10 lg:gap-16">
            {recognitions.map((r, i) => (
              <li key={r.title} data-pop={i % 2 ? 'right' : 'left'} className={`relative pl-14 lg:w-1/2 lg:pl-0 ${i % 2 ? 'lg:ml-auto lg:pl-16' : 'lg:pr-16 lg:text-right'}`}>
                <span aria-hidden className={`absolute top-2 left-[0.55rem] size-4 rounded-full bg-orange-deep ring-4 ring-sky lg:top-3 ${i % 2 ? 'lg:-left-2' : 'lg:right-[-0.5rem] lg:left-auto'}`} />
                <h3 className="text-[clamp(1.6rem,3vw,2.4rem)]">{r.title}</h3>
                <p className="mt-3 text-lg text-ink/80">{r.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ 09 Partners */

export function Partners() {
  const all = partners.flatMap((p) => p.names)
  const half = Math.ceil(all.length / 2)
  const rows = [all.slice(0, half), all.slice(half)]
  return (
    <section id="partners" data-chapter="Partners" className="relative overflow-hidden bg-paper py-28 sm:py-36" aria-labelledby="partners-title">
      <div className="wrap">
        <p className="kicker text-orange-deep" data-reveal>
          Partners of the 7th edition
        </p>
        <h2 id="partners-title" data-split="words" className="mt-5 max-w-3xl text-[clamp(2.4rem,6vw,5.2rem)]">
          It took a whole state.
        </h2>
      </div>

      <div className="mt-16 grid">
        {rows.map((row, r) => (
          <div key={r} className={`overflow-hidden py-6 ${r ? 'bg-un text-white' : 'border-y-2 border-ink'}`}>
            <div data-marquee={r ? 'right' : 'left'} className="marquee">
              {[...row, ...row].map((n, i) => (
                <span key={i} className="flex items-center gap-8 pr-8 font-display text-[clamp(2rem,5vw,4.4rem)] font-medium tracking-[-0.03em] whitespace-nowrap">
                  {n}
                  <Crown className="h-6 w-8 shrink-0 text-orange" />
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="wrap mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {partners.map((p) => (
          <div key={p.group} data-reveal className="border-t-2 border-ink pt-5">
            <p className="font-mono text-xs tracking-[0.2em] text-orange-deep uppercase">{p.group}</p>
            <ul className="mt-3 grid gap-1">
              {p.names.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ 10 Join */

export function Join() {
  return (
    <section id="join" data-chapter="Join" className="relative overflow-hidden bg-pine py-28 text-white sm:py-40" aria-labelledby="join-title">
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
              <a key={c.name} href={`tel:${c.tel}`} data-reveal data-cursor="Call" className="group rounded-[1.25rem] bg-white/10 p-6 ring-1 ring-white/20 transition-colors hover:bg-white hover:text-ink">
                <p className="font-mono text-xs tracking-[0.2em] text-white/80 uppercase group-hover:text-orange-deep">{c.role}</p>
                <p className="mt-2 font-display text-2xl">{c.name}</p>
                <p className="mt-1 text-white/80 group-hover:text-ink-soft">{c.phone}</p>
              </a>
            ))}
          </div>
        </div>

        <div className="grid gap-6">
          <div data-reveal className="rounded-[1.75rem] bg-orange p-8 text-ink sm:p-10">
            <p className="font-mono text-xs tracking-[0.2em] uppercase">7th edition delegate fee</p>
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
          <ul data-reveal className="grid gap-2 rounded-[1.5rem] bg-white/10 p-6 ring-1 ring-white/20">
            {registration.extras.map((x) => (
              <li key={x} className="flex gap-3">
                <span aria-hidden className="text-orange">✦</span>
                {x}
              </li>
            ))}
          </ul>
          <div data-reveal className="rounded-[1.5rem] bg-white p-6 text-ink">
            <p className="font-mono text-xs tracking-[0.2em] text-orange-deep uppercase">Awards</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {awards.map((a) => (
                <div key={a.group}>
                  <p className="font-display text-xl text-un">{a.group}</p>
                  <ul className="mt-1 text-sm text-ink-soft">
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
