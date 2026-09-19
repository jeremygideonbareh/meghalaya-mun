import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { contacts, guides, newsletter, org } from '../data/content'

/*
 * The navigation drawer. Three bands of colour wipe in from the right, the
 * drawer lands on top of them, and its rows deal in one after another. Each
 * group opens like an accordion; the chapter you are reading is marked.
 */

type Item = { label: string; icon: IconName; href: string; external?: boolean }
type Group = { id: string; title: string; items: Item[] }

const guideIcon: Record<string, IconName> = {
  'first-mun-guide': 'spark',
  'una-usa-rules-of-procedure': 'globe',
  'aippm-rules-of-procedure': 'landmark',
  'international-press-guide': 'news',
}

const groups: Group[] = [
  {
    id: 'guides',
    title: 'MUN guides',
    items: [
      { label: 'All delegate resources', icon: 'book', href: '#guides' },
      ...guides.map((g) => ({ label: g.short, icon: guideIcon[g.slug], href: g.href, external: true })),
      { label: 'The MMUN newsletter', icon: 'file', href: newsletter, external: true },
    ],
  },
  {
    id: 'conference',
    title: 'The conference',
    items: [
      { label: 'Who we are', icon: 'book', href: '#manifesto' },
      { label: 'One world', icon: 'globe', href: '#world' },
      { label: 'The theme', icon: 'spark', href: '#theme' },
      { label: 'In numbers', icon: 'chart', href: '#numbers' },
      { label: 'Committees', icon: 'landmark', href: '#committees' },
      { label: 'Guest speaker', icon: 'mic', href: '#speaker' },
    ],
  },
  {
    id: 'people',
    title: 'People & moments',
    items: [
      { label: 'Meet the team', icon: 'users', href: '#team' },
      { label: 'In frames', icon: 'image', href: '#frames' },
      { label: 'Recognition', icon: 'award', href: '#recognition' },
      { label: 'Partners', icon: 'hand', href: '#partners' },
    ],
  },
  {
    id: 'delegates',
    title: 'For delegates',
    items: [
      { label: 'Raise your placard', icon: 'flag', href: '#placard' },
      { label: 'Join the 8th edition', icon: 'ticket', href: '#join' },
      { label: 'MMUN ’26 brochure', icon: 'file', href: org.brochure, external: true },
      { label: '2026 itinerary', icon: 'calendar', href: org.itinerary, external: true },
    ],
  },
]

type Kit = { gsap: typeof import('gsap').gsap }
const motionOn = () => document.documentElement.dataset.motion !== 'off'

export function Menu({ open, onClose, opener }: { open: boolean; onClose: () => void; opener: React.RefObject<HTMLButtonElement | null> }) {
  const root = useRef<HTMLDivElement>(null)
  const kit = useRef<Kit | null>(null)
  const [shown, setShown] = useState(false)
  const [expanded, setExpanded] = useState<string>('conference')
  const [here, setHere] = useState<string>('')

  // gsap arrives with the rest of the film; load it here too for an early click
  const load = useCallback(async () => {
    if (!kit.current) kit.current = { gsap: (await import('gsap')).gsap }
    return kit.current
  }, [])
  useEffect(() => {
    const warm = () => void load()
    opener.current?.addEventListener('pointerenter', warm, { once: true })
    opener.current?.addEventListener('focus', warm, { once: true })
  }, [load, opener])

  // Open: find the chapter in view, show the drawer and play it in
  useEffect(() => {
    const el = root.current
    if (!el) return
    if (open) {
      const mid = window.innerHeight / 2
      const current = [...document.querySelectorAll<HTMLElement>('main section[id], section[id]')].find((s) => {
        const r = s.getBoundingClientRect()
        return r.top <= mid && r.bottom >= mid
      })
      const id = current ? `#${current.id}` : ''
      setHere(id)
      const g = groups.find((gr) => gr.items.some((i) => i.href === id))
      if (g) setExpanded(g.id)
      setShown(true)
      document.documentElement.classList.add('menu-open')
    }
  }, [open])

  useEffect(() => {
    const el = root.current
    if (!el || !shown) return
    let cancelled = false
    const run = async () => {
      if (!motionOn()) {
        if (open) el.setAttribute('data-live', '')
        else finish()
        return
      }
      const { gsap } = await load()
      if (cancelled) return
      const q = (s: string) => el.querySelectorAll(s)
      gsap.killTweensOf(el.querySelectorAll('*'))
      if (open) {
        // the open group's rows deal in on CSS, after the drawer lands
        el.style.setProperty('--base', '620ms')
        setTimeout(() => el.style.setProperty('--base', '80ms'), 1200)
        gsap
          .timeline({ onStart: () => el.setAttribute('data-live', '') })
          .fromTo(q('[data-m-backdrop]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: 'power2.out' }, 0)
          .fromTo(q('[data-m-band]'), { xPercent: 101 }, { xPercent: 0, duration: 0.75, ease: 'expo.inOut', stagger: 0.07 }, 0)
          .fromTo(q('[data-m-panel]'), { xPercent: 101 }, { xPercent: 0, duration: 0.8, ease: 'expo.out' }, 0.22)
          .fromTo(q('[data-m-char]'), { yPercent: 115, rotate: 8 }, { yPercent: 0, rotate: 0, duration: 0.7, ease: 'expo.out', stagger: 0.025 }, 0.42)
          .fromTo(q('[data-m-kicker]'), { autoAlpha: 0, x: 20 }, { autoAlpha: 1, x: 0, duration: 0.5 }, 0.45)
          .fromTo(q('[data-m-close]'), { rotate: -135, scale: 0.4 }, { rotate: 0, scale: 1, duration: 0.8, ease: 'back.out(2)' }, 0.45)
          .fromTo(q('[data-m-row]'), { x: 70, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.7, ease: 'expo.out', stagger: 0.06 }, 0.5)
          .fromTo(q('[data-m-foot]'), { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: 'expo.out' }, 0.7)
          .fromTo(q('[data-m-wa]'), { scale: 0, rotate: -90 }, { scale: 1, rotate: 0, duration: 0.8, ease: 'back.out(2.2)' }, 0.85)
      } else {
        gsap
          .timeline({ onComplete: finish })
          .to(q('[data-m-row], [data-m-foot]'), { x: 40, autoAlpha: 0, duration: 0.25, ease: 'power2.in', stagger: 0.02 }, 0)
          .to(q('[data-m-panel]'), { xPercent: 101, duration: 0.55, ease: 'expo.in' }, 0.1)
          .to([...q('[data-m-band]')].reverse(), { xPercent: 101, duration: 0.5, ease: 'expo.in', stagger: 0.05 }, 0.2)
          .to(q('[data-m-backdrop]'), { autoAlpha: 0, duration: 0.4 }, 0.35)
      }
    }
    const finish = () => {
      el.removeAttribute('data-live')
      setShown(false)
      document.documentElement.classList.remove('menu-open')
      opener.current?.focus()
    }
    run()
    return () => {
      cancelled = true
    }
  }, [open, shown, load, opener])

  // Keyboard: Escape closes, Tab stays inside the drawer
  useEffect(() => {
    if (!open) return
    const el = root.current
    el?.querySelector<HTMLElement>('[data-m-close]')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key !== 'Tab' || !el) return
      const f = [...el.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')].filter((n) => n.offsetParent !== null)
      if (!f.length) return
      if (e.shiftKey && document.activeElement === f[0]) {
        e.preventDefault()
        f[f.length - 1].focus()
      } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
        e.preventDefault()
        f[0].focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Accordion: one group open at a time; the height eases on CSS grid rows
  const toggle = (id: string) => setExpanded((cur) => (cur === id ? '' : id))

  // In-page links close the drawer, then glide to the chapter behind it
  const go = (e: React.MouseEvent, item: Item) => {
    if (item.external) return
    e.preventDefault()
    onClose()
    const target = document.querySelector<HTMLElement>(item.href)
    if (!target) return
    const smoother = (window as Window & { __mmunSmoother?: { scrollTo: (t: Element, s: boolean, p?: string) => void } }).__mmunSmoother
    setTimeout(() => {
      if (smoother) smoother.scrollTo(target, true, 'top top')
      else target.scrollIntoView({ behavior: motionOn() ? 'smooth' : 'auto' })
      history.replaceState(null, '', item.href)
    }, 350)
  }

  const title = 'Navigation'

  return (
    <div ref={root} id="menu" role="dialog" aria-modal="true" aria-label="Site navigation" hidden={!shown} className="fixed inset-0 z-[110]">
      <div data-m-backdrop onClick={onClose} className="absolute inset-0 bg-ink/60 backdrop-blur-[3px]" />

      <div className="absolute inset-y-0 right-0 w-[min(34rem,calc(100vw-3.25rem))]">
        {/* the colour bands that wipe in ahead of the drawer */}
        <span data-m-band aria-hidden className="absolute inset-0 -translate-x-3 bg-orange" />
        <span data-m-band aria-hidden className="absolute inset-0 -translate-x-1.5 bg-pine" />
        <span data-m-band aria-hidden className="absolute inset-0 bg-un" />

        <div data-m-panel className="absolute inset-0 flex flex-col overflow-hidden border-l-4 border-ink bg-paper">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b-4 border-ink bg-un px-6 pt-6 pb-5 text-paper sm:px-8">
            <div>
              <p data-m-kicker className="font-mono text-xs font-semibold tracking-[0.35em] text-orange uppercase">
                MMUN 2026
              </p>
              <p className="mt-2 overflow-hidden font-display text-[clamp(2rem,6vw,2.8rem)] leading-none font-semibold tracking-[-0.02em] uppercase" aria-hidden>
                {[...title].map((c, i) => (
                  <span key={i} data-m-char className="inline-block">
                    {c}
                  </span>
                ))}
              </p>
            </div>
            <button
              type="button"
              data-m-close
              onClick={onClose}
              aria-label="Close the menu"
              className="grid size-12 shrink-0 place-items-center rounded-lg border-2 border-paper/70 text-paper transition-colors hover:bg-orange hover:text-ink"
            >
              <Icon name="x" className="size-6" />
            </button>
          </div>

          {/* Groups */}
          <nav className="flex-1 overflow-y-auto overscroll-contain" aria-label="Chapters">
            {groups.map((g) => {
              const isOpen = expanded === g.id
              return (
                <div key={g.id} data-m-row className="border-b-2 border-ink/15">
                  <button
                    type="button"
                    onClick={() => toggle(g.id)}
                    aria-expanded={isOpen}
                    aria-controls={`m-${g.id}`}
                    className="group flex min-h-16 w-full items-center justify-between bg-card px-6 text-left sm:px-8"
                  >
                    <span className="font-display text-xl font-bold tracking-[0.04em] uppercase transition-transform duration-300 group-hover:translate-x-1.5">{g.title}</span>
                    <span className={`grid size-9 place-items-center rounded-full border-2 border-ink transition-[transform,background-color] duration-500 ${isOpen ? 'rotate-180 bg-orange' : 'group-hover:bg-sky'}`}>
                      <Icon name="chevron" className="size-4" />
                    </span>
                  </button>
                  <div id={`m-${g.id}`} {...(isOpen ? { 'data-m-open': '' } : {})} className="m-fold bg-peach">
                    <ul className="min-h-0 overflow-hidden">
                      {g.items.map((item, i) => {
                        const current = here === item.href
                        return (
                          <li key={item.href} data-m-item style={{ '--i': i } as React.CSSProperties} className="border-t border-ink/10">
                            <a
                              href={item.href}
                              onClick={(e) => go(e, item)}
                              target={item.external ? '_blank' : undefined}
                              rel={item.external ? 'noopener' : undefined}
                              aria-current={current ? 'location' : undefined}
                              className="m-link group relative flex min-h-14 items-center gap-4 px-6 sm:px-10"
                            >
                              <span data-m-icon className="relative z-10 grid size-9 shrink-0 place-items-center rounded-lg bg-card text-pine ring-2 ring-ink/80">
                                <Icon name={item.icon} className="size-5" />
                              </span>
                              <span className="relative z-10 font-bold tracking-[0.06em] uppercase transition-transform duration-300 group-hover:translate-x-1.5">{item.label}</span>
                              {current && (
                                <span className="relative z-10 ml-auto flex items-center gap-2 font-mono text-[0.65rem] tracking-[0.16em] text-un uppercase">
                                  <span className="size-2 animate-ping rounded-full bg-un" /> You are here
                                </span>
                              )}
                              {item.external && <Icon name="external" className="relative z-10 ml-auto size-4 opacity-60" />}
                            </a>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
              )
            })}

            <div data-m-row className="border-b-2 border-ink/15">
              <button
                type="button"
                onClick={() => toggle('contact')}
                aria-expanded={expanded === 'contact'}
                aria-controls="m-contact"
                className="group flex min-h-16 w-full items-center justify-between bg-card px-6 text-left sm:px-8"
              >
                <span className="font-display text-xl font-bold tracking-[0.04em] uppercase transition-transform duration-300 group-hover:translate-x-1.5">Contact</span>
                <span className={`grid size-9 place-items-center rounded-full border-2 border-ink transition-[transform,background-color] duration-500 ${expanded === 'contact' ? 'rotate-180 bg-orange' : 'group-hover:bg-sky'}`}>
                  <Icon name="chevron" className="size-4" />
                </span>
              </button>
              <div id="m-contact" {...(expanded === 'contact' ? { 'data-m-open': '' } : {})} className="m-fold bg-peach">
                <ul className="min-h-0 overflow-hidden">
                  <ContactRow i={0} icon="mail" href={`mailto:${org.email}`} label={org.email} />
                  {contacts.map((c, i) => (
                    <ContactRow key={c.tel} i={i + 1} icon="phone" href={`tel:${c.tel}`} label={`${c.phone}`} note={c.role} />
                  ))}
                  <ContactRow i={3} icon="insta" href={org.instagram} label={`@${org.handle}`} external />
                </ul>
              </div>
            </div>
          </nav>

          {/* Footer: registration status and the WhatsApp community */}
          <div data-m-foot className="border-t-4 border-ink bg-un px-6 py-5 sm:px-8">
            <div className="flex items-center gap-4">
              <div className="flex flex-1 items-center gap-3 rounded-xl border-2 border-paper/40 bg-paper/10 px-4 py-3 text-paper">
                <Icon name="lock" className="size-6 shrink-0 text-orange" />
                <p className="leading-tight">
                  <span className="block font-display text-lg font-bold tracking-[0.04em] uppercase">8th edition</span>
                  <span className="block font-mono text-[0.68rem] tracking-[0.14em] text-paper/85 uppercase">Registrations open soon</span>
                </p>
              </div>
              <a
                data-m-wa
                href={org.whatsappCommunity}
                target="_blank"
                rel="noopener"
                aria-label="Join the MMUN WhatsApp community"
                className="grid size-16 shrink-0 place-items-center rounded-full border-2 border-ink bg-whatsapp text-white shadow-[4px_4px_0_var(--color-ink)] transition-transform hover:-translate-y-1 hover:rotate-6"
              >
                <Icon name="whatsapp" className="size-8" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ContactRow({ i, icon, href, label, note, external }: { i: number; icon: IconName; href: string; label: string; note?: string; external?: boolean }) {
  return (
    <li data-m-item style={{ '--i': i } as React.CSSProperties} className="border-t border-ink/10">
      <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener' : undefined} className="m-link group relative flex min-h-14 items-center gap-4 px-6 sm:px-10">
        <span data-m-icon className="relative z-10 grid size-9 shrink-0 place-items-center rounded-lg bg-card text-pine ring-2 ring-ink/80">
          <Icon name={icon} className="size-5" />
        </span>
        <span className="relative z-10 font-bold tracking-[0.02em] whitespace-nowrap">{label}</span>
        {note && <span className="relative z-10 ml-auto font-mono text-[0.65rem] tracking-[0.14em] text-ink-soft uppercase">{note}</span>}
      </a>
    </li>
  )
}

/* ------------------------------------------------------------ icons */

type IconName =
  | 'book' | 'globe' | 'spark' | 'chart' | 'landmark' | 'mic' | 'users' | 'image' | 'award' | 'hand' | 'flag' | 'ticket'
  | 'file' | 'calendar' | 'mail' | 'phone' | 'insta' | 'lock' | 'chevron' | 'x' | 'external' | 'whatsapp' | 'news'

const paths: Record<IconName, ReactNode> = {
  book: <path d="M3 5.5C5.5 4 8.5 4 12 6c3.5-2 6.5-2 9-.5V19c-2.5-1.5-5.5-1.5-9 .5-3.5-2-6.5-2-9-.5ZM12 6v13.5" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18" />
    </>
  ),
  spark: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />,
  chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  landmark: <path d="M3 10 12 4l9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18" />,
  mic: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5M16 4.8a3.4 3.4 0 0 1 0 6.4M18.5 14.8c1.6.8 2.7 2.5 3 5.2" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <circle cx="9" cy="10" r="1.8" />
      <path d="m3.5 18 5.5-5 4 3.5 3-2.5 4.5 4" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="9" r="5.5" />
      <path d="m8.8 13.5-1.8 7.5 5-2.8 5 2.8-1.8-7.5" />
    </>
  ),
  hand: <path d="M7 11V6.5a1.5 1.5 0 0 1 3 0V11M10 10V4.5a1.5 1.5 0 0 1 3 0V10M13 10V5.5a1.5 1.5 0 0 1 3 0V12M16 9.5a1.5 1.5 0 0 1 3 0V14c0 4-2.7 7-6.5 7S6 19 4.8 16.4L3.3 13a1.5 1.5 0 0 1 2.6-1.5L7 13.5" />,
  flag: <path d="M5 21V4M5 4h11l-2 4 2 4H5" />,
  ticket: <path d="M3 8a2 2 0 0 0 0 4v0a2 2 0 0 1 0 4v2h18v-2a2 2 0 0 1 0-4 2 2 0 0 0 0-4V6H3ZM14 6v2M14 11v2M14 16v2" />,
  file: <path d="M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8ZM14 3v5h5M9 13h6M9 17h6" />,
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4M8 14h2M14 14h2M8 17h2" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 7 8.5-7" />
    </>
  ),
  phone: <path d="M5 3.5h3.5l1.8 4.7-2.3 1.4a11 11 0 0 0 6.4 6.4l1.4-2.3 4.7 1.8V19a2 2 0 0 1-2 2A17 17 0 0 1 3 5.5a2 2 0 0 1 2-2Z" />,
  insta: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r=".6" fill="currentColor" />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="10.5" width="15" height="10.5" rx="2" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3M12 14.5v3" />
    </>
  ),
  chevron: <path d="m6 9 6 6 6-6" />,
  news: <path d="M4 5h13v14H6a2 2 0 0 1-2-2ZM17 9h3v8a2 2 0 0 1-2 2M7.5 9h6M7.5 12.5h6M7.5 16h4" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  external: <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />,
  whatsapp: (
    <path
      fill="currentColor"
      stroke="none"
      d="M12 2.2A9.7 9.7 0 0 0 3.6 16.9L2.3 21.7l4.9-1.3A9.7 9.7 0 1 0 12 2.2Zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1 1 12 19.9Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8c1.6.7 2.2.7 3 .6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.5-.2Z"
    />
  ),
}

function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      {paths[name]}
    </svg>
  )
}
