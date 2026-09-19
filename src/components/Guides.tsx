import { useState } from 'react'
import { guides, newsletter, type Guide } from '../data/content'
import { Arrow, Crown, Picture } from './ui'

/*
 * MUN guides: every guide is a booklet. Its cover swings open on hover (or a
 * tap) to show the real first page behind it, and the booklets fan out of a
 * single stack as the section scrolls in (see guides() in cinema.ts).
 */
export function Guides() {
  return (
    <section id="guides" data-chapter="MUN guides" data-guides className="relative overflow-hidden bg-paper py-20 sm:py-28" aria-labelledby="guides-title">
      <div className="wrap">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <p className="kicker text-orange-deep" data-reveal>
              MUN guides
            </p>
            <h2 id="guides-title" data-split="words" className="mt-5 text-[clamp(2.4rem,6vw,5.6rem)]">
              Everything to read before the gavel falls.
            </h2>
          </div>
          <p className="max-w-lg text-lg text-ink-soft lg:justify-self-end" data-reveal>
            The secretariat’s own guides to procedure and the press, free to read and keep. Open a booklet to look inside,
            then read it here or save it for later.
          </p>
        </div>

        <ul className="mt-16 grid grid-cols-1 gap-x-6 gap-y-12 [perspective:1600px] sm:grid-cols-2 lg:grid-cols-4">
          {guides.map((g, i) => (
            <Booklet key={g.slug} g={g} n={i + 1} />
          ))}
        </ul>

        {/* The newsletter, as a wide ribbon under the shelf */}
        <a
          href={newsletter}
          target="_blank"
          rel="noopener"
          data-reveal
          className="group mt-16 flex flex-col gap-6 overflow-hidden rounded-[1.75rem] border-2 border-ink bg-un p-7 text-paper shadow-[6px_6px_0_var(--color-ink)] transition-transform duration-500 hover:-translate-y-1 sm:flex-row sm:items-center sm:justify-between sm:p-10"
        >
          <span className="flex items-center gap-6">
            <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-orange text-ink transition-transform duration-700 group-hover:rotate-[-8deg]">
              <Crown className="h-8 w-10" />
            </span>
            <span>
              <span className="block font-mono text-xs tracking-[0.2em] text-orange uppercase">Read the newsletter</span>
              <span className="mt-1 block font-display text-[clamp(1.8rem,4vw,3rem)] leading-none">The MMUN Newsletter</span>
            </span>
          </span>
          <span className="btn btn-orange self-start sm:self-auto">
            Open it <Arrow className="size-4" />
          </span>
        </a>
      </div>
    </section>
  )
}

function Booklet({ g, n }: { g: Guide; n: number }) {
  const [open, setOpen] = useState(false)
  return (
    <li data-guide className="grid gap-5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-pressed={open}
        aria-label={`${open ? 'Close' : 'Open'} the ${g.short}`}
        data-cursor={open ? 'Close' : 'Open'}
        className={`booklet group relative block aspect-[3/4] w-full text-left [transform-style:preserve-3d] ${open ? 'is-open' : ''}`}
      >
        {/* the first page, waiting behind the cover */}
        <span className="absolute inset-0 overflow-hidden rounded-r-2xl rounded-l-md border-2 border-ink bg-card shadow-[6px_6px_0_var(--color-ink)]">
          <Picture name={`guide-${g.slug}`} alt="" sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw" className="h-full w-full object-cover object-top" />
          <span className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-card to-transparent" />
        </span>

        {/* the cover */}
        <span className={`booklet-cover absolute inset-0 flex flex-col justify-between overflow-hidden rounded-r-2xl rounded-l-md border-2 border-ink p-6 ${g.tone}`}>
          <span aria-hidden className="absolute inset-y-0 left-3 w-px bg-current opacity-30" />
          <span className="flex items-start justify-between pl-3">
            <span className="font-mono text-xs tracking-[0.2em] uppercase opacity-80">Guide {String(n).padStart(2, '0')}</span>
            <span className="rounded-full border-2 border-current px-2.5 py-0.5 font-mono text-[0.65rem] tracking-[0.14em] uppercase">{g.audience}</span>
          </span>
          <Crown aria-hidden className="absolute -right-8 bottom-24 w-[80%] opacity-[0.12] transition-transform duration-700 group-hover:rotate-[-6deg]" />
          <span className="relative pl-3">
            <span className="block font-display text-[clamp(1.9rem,3vw,2.5rem)] leading-[0.98] font-semibold tracking-[-0.02em]">{g.title}</span>
            <span className="mt-3 flex items-center gap-2 font-mono text-xs tracking-[0.16em] uppercase opacity-85">
              <span aria-hidden className="grid size-6 place-items-center rounded-full border-2 border-current text-[0.7rem] transition-transform duration-500 group-hover:rotate-180">↻</span>
              {g.pages} pages · <span className="pointer-coarse:hidden">hover to open</span>
              <span className="hidden pointer-coarse:inline">tap to open</span>
            </span>
          </span>
        </span>
      </button>

      <div>
        <p className="text-ink-soft">{g.about}</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <a href={g.href} target="_blank" rel="noopener" className="btn btn-blue px-4" data-magnet>
            Read
          </a>
          <a href={g.href} download className="btn btn-line px-4" data-magnet>
            Download
          </a>
        </div>
      </div>
    </li>
  )
}
