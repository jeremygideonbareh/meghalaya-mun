import { edition, heroSlides, org, theme } from '../data/content'
import { Arrow, Picture } from './ui'

export function Hero() {
  return (
    <section id="top" data-hero data-chapter="Prologue" aria-labelledby="hero-title" className="relative h-[100svh] min-h-[38rem] overflow-hidden bg-un text-white">
      <div data-hero-media className="absolute inset-0 overflow-hidden will-change-transform">
        {heroSlides.map((s, i) => (
          <div key={s.image} className="kb">
            <Picture name={s.image} alt={i === 0 ? s.alt : ''} sizes="100vw" eager={i === 0} />
          </div>
        ))}
        {/* A UN-blue wash keeps the photos bright; the lower half deepens so the title always reads */}
        <div data-hero-shade className="absolute inset-0 bg-un mix-blend-multiply opacity-25 sm:opacity-50" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(19_34_58/0.45)_0%,rgb(19_34_58/0)_22%,rgb(19_34_58/0.2)_42%,rgb(19_34_58/0.94)_72%)] sm:bg-[linear-gradient(180deg,rgb(19_34_58/0.6)_0%,rgb(19_34_58/0)_28%,rgb(19_34_58/0.35)_50%,rgb(19_34_58/0.94)_82%)]" />
      </div>

      <div className="wrap relative flex h-full flex-col justify-end pb-10 sm:pb-14">
        <p data-hero-fade className="kicker text-white">
          {edition.title} · relived
        </p>

        <h1
          id="hero-title"
          data-hero-title
          className="mt-5 max-w-[15ch] origin-bottom-left text-[clamp(3rem,10.5vw,10.5rem)] leading-[0.92] font-medium"
        >
          Meghalaya Model <em className="text-orange">United</em> Nations
        </h1>

        <div data-hero-rule data-hero-fade className="mt-8 h-[2px] w-full bg-white/60 sm:mt-10" />

        <div className="mt-6 grid gap-6 sm:mt-8 lg:grid-cols-[1.2fr_1fr_auto] lg:items-end lg:gap-10">
          <p data-hero-fade className="flex flex-wrap gap-x-3 font-display text-xl sm:text-3xl">
            {theme.words.map((w, i) => (
              <span key={w.word} className="whitespace-nowrap">
                <em>{w.word}</em>
                {i < theme.words.length - 1 && <span className="ml-3 text-orange">·</span>}
              </span>
            ))}
          </p>
          <dl data-hero-fade className="grid grid-cols-2 gap-x-8 gap-y-1 text-[0.95rem]">
            <dt className="text-white/75">Held</dt>
            <dt className="text-white/75">Venue</dt>
            <dd className="font-bold">{edition.dates}</dd>
            <dd className="font-bold">{edition.venue}</dd>
          </dl>
          <div data-hero-fade className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
            <a href="#join" className="btn btn-orange px-4 sm:px-7" data-magnet data-cursor="8th">
              Join the 8th <Arrow className="size-4" />
            </a>
            <a href="#frames" className="btn btn-line px-4 sm:px-7" data-magnet>
              Relive the 7th
            </a>
          </div>
        </div>

        <p data-hero-fade className="mt-8 flex items-center justify-between text-[0.8rem] font-semibold tracking-[0.22em] text-white/80 uppercase">
          <span>{org.registered}</span>
          <span className="hidden items-center gap-3 sm:flex">
            Scroll
            <span className="relative block h-10 w-[2px] overflow-hidden bg-white/25">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_ease-in-out_infinite] bg-orange" />
            </span>
          </span>
        </p>
      </div>
    </section>
  )
}
