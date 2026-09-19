import gsap from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, DrawSVGPlugin)

export { gsap, ScrollTrigger }

const DESKTOP = '(min-width: 1024px)'
const FINE = '(pointer: fine)'
const q = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T & Element>(sel)) as T[]

/**
 * Runs the whole film. Everything is keyed off data attributes in the markup
 * so components stay declarative. Returns a cleanup that reverts it all.
 */
export function startCinema() {
  // phones: the address bar showing and hiding must not re-measure the pins
  ScrollTrigger.config({ ignoreMobileResize: true })
  const ctx = gsap.context(() => {
    const mm = gsap.matchMedia()

    // ---- Smooth scrolling with parallax effects (desktop pointers) ----
    mm.add(`${DESKTOP} and ${FINE}`, () => {
      const smoother = ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 1.15,
        effects: true,
        normalizeScroll: false,
      })
      return () => smoother.kill()
    })

    heroIntro()
    heroDepth()
    heroScroll()
    progress()
    cursor()
  })

  // The rest of the film is built in the next idle moment, so the hero's
  // first frames never wait on it. Order matters: pins before what follows.
  let cancelled = false
  const rest = () => {
    if (cancelled) return
    ctx.add(() => {
      splitReveals()
      manifesto()
      world()
      themeChapter()
      counters()
      committees()
      speaker()
      gallery()
      // pinned sections must be created in page order: the reel sits after
      // the committees pin and before the recognition pin
      reel()
      recognition()
      marquees()
      wordmark()
      reveals()
      maskedImages()
      chapters()
      magnets()
      tilts()
      numbersFlip()
      ScrollTrigger.refresh()
    })
  }
  const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 120))
  idle(rest, { timeout: 900 })

  return () => {
    cancelled = true
    ctx.revert()
  }
}

// ---------------------------------------------------------------- hero

function heroIntro() {
  const hero = document.querySelector<HTMLElement>('[data-hero]')
  if (!hero) return
  const title = hero.querySelector<HTMLElement>('[data-hero-title]')
  const split = title ? SplitText.create(title, { type: 'chars,words', mask: 'words', wordsClass: 'split-word' }) : null
  const slides = q('.kb', hero)

  const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
  tl.from(slides[0] ?? [], { scale: 1.35, duration: 2.6, ease: 'power3.out' }, 0)
    .from(split?.chars ?? [], { yPercent: 120, rotate: 8, duration: 1.3, stagger: 0.028, onComplete: () => split?.revert() }, 0.25)
    .from('[data-hero-fade]', { autoAlpha: 0, y: 30, duration: 1.1, stagger: 0.09 }, 0.8)
    .from('[data-hero-rule]', { scaleX: 0, transformOrigin: 'left center', duration: 1.4, ease: 'expo.inOut' }, 0.7)

  // Play when the letterbox opens (or straight away if the intro is gone).
  const html = document.documentElement
  if (html.classList.contains('intro-out') || html.classList.contains('intro-gone')) tl.play()
  else window.addEventListener('intro:out', () => tl.play(), { once: true })

  // Ken Burns crossfade between real conference photos.
  if (slides.length > 1) {
    const loop = gsap.timeline({ repeat: -1, delay: 3 })
    slides.forEach((slide, i) => {
      const next = slides[(i + 1) % slides.length]
      loop
        .set(next, { zIndex: 2 })
        .set(slide, { zIndex: 1 })
        .fromTo(next, { autoAlpha: 0, scale: 1.18 }, { autoAlpha: 1, scale: 1.04, duration: 2.2, ease: 'power2.inOut' })
        .to(next, { scale: 1, duration: 4, ease: 'none' })
    })
  }
}

function heroScroll() {
  const hero = document.querySelector<HTMLElement>('[data-hero]')
  if (!hero) return
  const media = hero.querySelector('[data-hero-media]')
  const tl = gsap.timeline({
    scrollTrigger: { trigger: hero, start: 'top top', end: '+=80%', scrub: 0.8, pin: true },
  })
  // The frame closes into a letterbox while the title pushes towards camera.
  tl.to(media, { clipPath: 'inset(10% 4% 10% 4% round 24px)', scale: 0.94, ease: 'none' }, 0)
    .to('[data-hero-title]', { scale: 1.35, yPercent: -18, autoAlpha: 0, filter: 'blur(10px)', ease: 'power1.in' }, 0)
    .to('[data-hero-fade]', { autoAlpha: 0, y: -40, stagger: 0.02, ease: 'none' }, 0)
    .to('[data-hero-shade]', { opacity: 0.85, ease: 'none' }, 0)
}

// ---------------------------------------------------------------- text

function splitReveals() {
  q('[data-split]').forEach((el) => {
    const type = el.dataset.split === 'chars' ? 'chars,words,lines' : 'words,lines'
    const split = SplitText.create(el, { type, mask: 'lines', linesClass: 'split-line' })
    const targets = el.dataset.split === 'chars' ? split.chars : split.words
    gsap.from(targets, {
      yPercent: 115,
      rotate: el.dataset.split === 'chars' ? 6 : 2,
      duration: 1.15,
      ease: 'expo.out',
      stagger: el.dataset.split === 'chars' ? 0.018 : 0.035,
      scrollTrigger: { trigger: el, start: 'top 86%', once: true },
      // Unwrap once the line has landed so nothing stays clipped
      onComplete: () => split.revert(),
    })
  })
}

function manifesto() {
  const el = document.querySelector<HTMLElement>('[data-scrub-words]')
  if (!el) return
  const split = SplitText.create(el, { type: 'words' })
  gsap.fromTo(
    split.words,
    { opacity: 0.12, filter: 'blur(3px)' },
    {
      opacity: 1,
      filter: 'blur(0px)',
      ease: 'none',
      stagger: 0.08,
      scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 45%', scrub: 0.6 },
    },
  )
}

// ---------------------------------------------------------------- theme

function themeChapter() {
  const section = document.querySelector<HTMLElement>('[data-theme-pin]')
  if (!section) return
  const panels = q('[data-theme-panel]', section)
  const images = q('[data-theme-image]', section)
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: `+=${(panels.length - 1) * 120 + 40}%`,
      pin: true,
      scrub: 0.8,
    },
  })
  const first = images[0]
  const firstPanel = panels[0]
  gsap
    .timeline({ scrollTrigger: { trigger: section, start: 'top 85%', end: 'top top', scrub: 0.6 } })
    .fromTo(first, { clipPath: 'circle(8% at 50% 55%)' }, { clipPath: 'circle(75% at 50% 55%)', ease: 'power2.inOut' }, 0)
    .fromTo(first.querySelector('img'), { scale: 1.3 }, { scale: 1.05, ease: 'none' }, 0)
    .fromTo(
      firstPanel.querySelector('[data-theme-word]'),
      { autoAlpha: 0, yPercent: 40, letterSpacing: '0.35em', filter: 'blur(14px)' },
      { autoAlpha: 1, yPercent: 0, letterSpacing: '-0.04em', filter: 'blur(0px)', ease: 'power3.out' },
      0.35,
    )
    .fromTo(firstPanel.querySelectorAll('[data-theme-rest]'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, stagger: 0.1 }, 0.6)

  panels.forEach((panel, i) => {
    const word = panel.querySelector('[data-theme-word]')
    const rest = panel.querySelectorAll('[data-theme-rest]')
    const img = images[i]
    const at = i * 1.2 - 1.2
    if (i === 0) {
      tl.to({}, { duration: 0.35 }, 0)
      tl.to(word, { autoAlpha: 0, yPercent: -40, filter: 'blur(10px)', duration: 0.45, ease: 'power2.in' }, 0.35).to(
        rest,
        { autoAlpha: 0, y: -20, duration: 0.3 },
        0.35,
      )
      return
    }
    // Each photo opens as a growing circle from the centre of the screen.
    tl.fromTo(img, { clipPath: 'circle(0% at 50% 55%)' }, { clipPath: 'circle(75% at 50% 55%)', duration: 1, ease: 'power2.inOut' }, at)
      .fromTo(img.querySelector('img'), { scale: 1.3 }, { scale: 1, duration: 1.2, ease: 'none' }, at)
      .fromTo(
        word,
        { autoAlpha: 0, yPercent: 40, letterSpacing: '0.35em', filter: 'blur(14px)' },
        { autoAlpha: 1, yPercent: 0, letterSpacing: '-0.02em', filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' },
        at + 0.15,
      )
      .fromTo(rest, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.05 }, at + 0.25)
    if (i < panels.length - 1) {
      tl.to(word, { autoAlpha: 0, yPercent: -40, filter: 'blur(10px)', duration: 0.45, ease: 'power2.in' }, at + 1.05).to(
        rest,
        { autoAlpha: 0, y: -20, duration: 0.3 },
        at + 1.05,
      )
    }
  })
}

// ---------------------------------------------------------------- numbers

function counters() {
  q('[data-count]').forEach((el) => {
    const end = Number(el.dataset.count)
    const obj = { v: 0 }
    el.textContent = '0'
    gsap.to(obj, {
      v: end,
      duration: 2.2,
      ease: 'power3.out',
      onUpdate: () => {
        el.textContent = Math.round(obj.v).toLocaleString('en-IN')
      },
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    })
  })
}

// ---------------------------------------------------------------- committees

function committees() {
  const section = document.querySelector<HTMLElement>('[data-hscroll]')
  const track = section?.querySelector<HTMLElement>('[data-htrack]')
  if (!section || !track) return
  const cards = q('[data-hcard]', track)
  const bar = section.querySelector('[data-hbar]')
  const phone = window.matchMedia('(max-width: 639px)').matches
  const distance = () => track.scrollWidth - window.innerWidth + (phone ? 0 : 48)

  const tween = gsap.to(track, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => `+=${distance()}`,
      pin: true,
      scrub: 0.7,
      invalidateOnRefresh: true,
      // on phones, settle on one whole card at a time
      snap: phone ? { snapTo: 1 / (cards.length - 1), duration: { min: 0.2, max: 0.5 }, ease: 'power2.inOut' } : undefined,
    },
  })
  if (bar) gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: section, start: 'top top', end: () => `+=${distance()}`, scrub: true } })

  // Cards swing in 3D as they cross the screen.
  cards.forEach((card) => {
    gsap.fromTo(
      card,
      { rotationY: -28, z: -160, opacity: 0.35 },
      {
        rotationY: 0,
        z: 0,
        opacity: 1,
        ease: 'power2.out',
        scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 95%', end: 'left 45%', scrub: true },
      },
    )
    gsap.to(card, {
      rotationY: 22,
      z: -120,
      opacity: 0.4,
      ease: 'power2.in',
      scrollTrigger: { trigger: card, containerAnimation: tween, start: 'right 40%', end: 'right -5%', scrub: true },
    })
  })
}

// ---------------------------------------------------------------- speaker

function speaker() {
  const section = document.querySelector<HTMLElement>('[data-spotlight]')
  if (!section) return
  const frame = section.querySelector('[data-spot-frame]')
  gsap.fromTo(
    frame,
    { clipPath: 'inset(50% 50% 50% 50% round 999px)' },
    {
      clipPath: 'inset(0% 0% 0% 0% round 28px)',
      duration: 1.6,
      ease: 'expo.inOut',
      scrollTrigger: { trigger: section, start: 'top 70%', once: true },
    },
  )
  gsap.fromTo(
    section.querySelector('[data-spot-frame] img'),
    { scale: 1.25 },
    { scale: 1, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true } },
  )
  // A soft spotlight follows the pointer across the section.
  const light = section.querySelector<HTMLElement>('[data-spot-light]')
  if (light && window.matchMedia(FINE).matches) {
    const x = gsap.quickTo(light, 'x', { duration: 0.8, ease: 'power3.out' })
    const y = gsap.quickTo(light, 'y', { duration: 0.8, ease: 'power3.out' })
    section.addEventListener('pointermove', (e) => {
      const r = section.getBoundingClientRect()
      x(e.clientX - r.left - light.offsetWidth / 2)
      y(e.clientY - r.top - light.offsetHeight / 2)
    })
  }
}

// ---------------------------------------------------------------- gallery

function gallery() {
  const cols = q('[data-col-speed]')
  if (cols.length) {
    const skews = cols.map((c) => gsap.quickTo(c, 'skewY', { duration: 0.5, ease: 'power3.out' }))
    let settle = 0
    ScrollTrigger.create({
      trigger: cols[0].parentElement,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const k = gsap.utils.clamp(-5, 5, self.getVelocity() / -400)
        skews.forEach((set, i) => set(i % 2 ? -k : k))
        clearTimeout(settle)
        settle = window.setTimeout(() => skews.forEach((set) => set(0)), 160)
      },
    })
  }
  q('[data-col-speed]').forEach((col) => {
    const speed = Number(col.dataset.colSpeed)
    gsap.fromTo(
      col,
      { yPercent: speed > 0 ? -speed : 0 },
      {
        yPercent: speed > 0 ? 0 : speed,
        ease: 'none',
        scrollTrigger: { trigger: col.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
      },
    )
  })
  q('[data-film]').forEach((strip) => {
    const dir = strip.dataset.film === 'left' ? -1 : 1
    gsap.fromTo(
      strip,
      { xPercent: dir > 0 ? -30 : 0 },
      {
        xPercent: dir > 0 ? 0 : -30,
        ease: 'none',
        scrollTrigger: { trigger: strip, start: 'top bottom', end: 'bottom top', scrub: 0.5 },
      },
    )
  })
}

// ---------------------------------------------------------------- recognition

function recognition() {
  const section = document.querySelector<HTMLElement>('[data-stack]')
  if (!section) return
  const cards = q('[data-stack-card]', section)
  const count = section.querySelector<HTMLElement>('[data-stack-count]')
  const bar = section.querySelector('[data-stack-bar]')
  const mm = gsap.matchMedia()

  // Desktop: the section pins and the cards deal onto the pile one by one,
  // each new card sliding up as the one beneath it sinks and tilts away.
  mm.add(DESKTOP, () => {
    gsap.set(cards.slice(1), { yPercent: 150, rotate: 6, autoAlpha: 0 })
    const BEAT = 1.7 // one second of motion, then a rest while the card is read
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: `+=${cards.length * 55}%`,
        pin: true,
        scrub: 0.7,
        onUpdate: (self) => {
          const n = Math.min(cards.length, Math.floor((self.progress * tl.duration() + 0.9) / BEAT) + 1)
          if (count) count.textContent = String(n).padStart(2, '0')
        },
      },
    })
    cards.forEach((card, i) => {
      if (i === 0) return
      const at = (i - 1) * BEAT + 0.4
      tl.set(card, { autoAlpha: 1 }, at).to(card, { yPercent: 0, rotate: 0, duration: 1, ease: 'power2.out' }, at).to(
        cards[i - 1],
        { scale: 0.9, yPercent: -6, rotate: i % 2 ? 3 : -3, duration: 1, ease: 'power2.out' },
        at,
      )
    })
    // hold on the last card before the pin lets go
    tl.to({}, { duration: 0.7 })
    if (bar) tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: tl.duration(), ease: 'none' }, 0)
  })

  // Phones: the cards deal in from alternating sides as they arrive.
  mm.add('(max-width: 1023px)', () => {
    cards.forEach((card, i) => {
      gsap.from(card, {
        autoAlpha: 0,
        x: i % 2 ? 70 : -70,
        rotate: i % 2 ? 4 : -4,
        duration: 0.9,
        ease: 'expo.out',
        scrollTrigger: { trigger: card, start: 'top 88%', once: true },
      })
    })
  })
}

// ---------------------------------------------------------------- partners

function marquees() {
  q('[data-marquee]').forEach((track) => {
    const dir = track.dataset.marquee === 'right' ? 1 : -1
    const half = track.scrollWidth / 2
    gsap.set(track, { x: dir > 0 ? -half : 0 })
    const loop = gsap.to(track, { x: dir > 0 ? 0 : -half, duration: 38, ease: 'none', repeat: -1 })
    const speed = gsap.quickTo(loop, 'timeScale', { duration: 0.5, ease: 'power2.out' })
    const skew = gsap.quickTo(track, 'skewX', { duration: 0.5, ease: 'power3.out' })
    let settle = 0
    ScrollTrigger.create({
      trigger: track,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const v = self.getVelocity()
        speed(1 + Math.min(4, Math.abs(v) / 300))
        skew(gsap.utils.clamp(-12, 12, v / -180))
        clearTimeout(settle)
        settle = window.setTimeout(() => {
          speed(1)
          skew(0)
        }, 180)
      },
    })
  })
}

function wordmark() {
  const el = document.querySelector<HTMLElement>('[data-wordmark]')
  if (!el) return
  const split = SplitText.create(el, { type: 'chars' })
  gsap.fromTo(
    split.chars,
    { yPercent: 100, rotate: (i: number) => (i % 2 ? 10 : -10) },
    {
      yPercent: 0,
      rotate: 0,
      ease: 'none',
      stagger: 0.06,
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom 85%', scrub: 0.6 },
    },
  )
  const crown = document.querySelector('[data-footer-crown]')
  if (crown)
    gsap.fromTo(crown, { rotate: -25, scale: 0.6 }, { rotate: 0, scale: 1, ease: 'none', scrollTrigger: { trigger: crown, start: 'top bottom', end: 'top 50%', scrub: true } })
}

// ---------------------------------------------------------------- generic

function reveals() {
  ScrollTrigger.batch(q('[data-reveal]'), {
    start: 'top 88%',
    once: true,
    onEnter: (batch) =>
      gsap.from(batch, { autoAlpha: 0, y: 60, duration: 1.1, ease: 'expo.out', stagger: 0.08, overwrite: true }),
  })
}

function maskedImages() {
  q('[data-mask-img]').forEach((el) => {
    const dir = el.dataset.maskImg
    const from =
      dir === 'left' ? 'inset(0% 100% 0% 0%)' : dir === 'right' ? 'inset(0% 0% 0% 100%)' : 'inset(100% 0% 0% 0%)'
    gsap.fromTo(
      el,
      { clipPath: from },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 85%', once: true } },
    )
    const img = el.querySelector('img')
    if (img) gsap.fromTo(img, { scale: 1.3 }, { scale: 1, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } })
  })
}

function chapters() {
  const label = document.querySelector<HTMLElement>('[data-chapter-label]')
  const num = document.querySelector<HTMLElement>('[data-chapter-num]')
  if (!label || !num) return
  q('[data-chapter]').forEach((section, i) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (self) => {
        if (!self.isActive) return
        gsap.to([label, num], {
          yPercent: -100,
          autoAlpha: 0,
          duration: 0.2,
          onComplete: () => {
            label.textContent = section.dataset.chapter ?? ''
            num.textContent = String(i + 1).padStart(2, '0')
            gsap.fromTo([label, num], { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.35 })
          },
        })
      },
    })
  })
}

function progress() {
  const bar = document.querySelector('[data-progress]')
  if (bar) gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } })
}

function cursor() {
  if (!window.matchMedia(FINE).matches) return
  const dot = document.querySelector<HTMLElement>('[data-cursor-dot]')
  const ring = document.querySelector<HTMLElement>('[data-cursor-ring]')
  const text = document.querySelector<HTMLElement>('[data-cursor-text]')
  if (!dot || !ring || !text) return
  const dx = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' })
  const dy = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' })
  const rx = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3' })
  const ry = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3' })
  const tx = gsap.quickTo(text, 'x', { duration: 0.35, ease: 'power3' })
  const ty = gsap.quickTo(text, 'y', { duration: 0.35, ease: 'power3' })
  gsap.set([dot, ring], { xPercent: -50, yPercent: -50, autoAlpha: 0 })
  let shown = false
  window.addEventListener('pointermove', (e) => {
    if (!shown) {
      // jump to the pointer first, so the cursor never flies in from a corner
      shown = true
      gsap.set([dot, ring], { x: e.clientX, y: e.clientY })
      gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3 })
    }
    dx(e.clientX)
    dy(e.clientY)
    rx(e.clientX)
    ry(e.clientY)
    tx(e.clientX + 22)
    ty(e.clientY + 22)
  })
  document.addEventListener('pointerover', (e) => {
    const el = e.target as HTMLElement
    const t = el.closest<HTMLElement>('[data-cursor], a, button')
    // no label over the header, where it would sit on the menu
    const label = el.closest('header') ? '' : (t?.dataset.cursor ?? '')
    gsap.to(ring, { scale: t ? 1.6 : 1, duration: 0.35 })
    gsap.to(dot, { scale: t ? 0.6 : 1, duration: 0.2 })
    text.textContent = label
    gsap.to(text, { autoAlpha: label ? 1 : 0, scale: label ? 1 : 0.6, duration: 0.25 })
  })
}

function magnets() {
  if (!window.matchMedia(FINE).matches) return
  q('[data-magnet]').forEach((el) => {
    const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })
    const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect()
      x((e.clientX - r.left - r.width / 2) * 0.35)
      y((e.clientY - r.top - r.height / 2) * 0.45)
    })
    el.addEventListener('pointerleave', () => {
      x(0)
      y(0)
    })
  })
}

// ---------------------------------------------------------------- one world

/** The globe drifts in from deep space and turns to face Shillong as you scroll. */
function world() {
  const section = document.querySelector<HTMLElement>('[data-world]')
  const stage = section?.querySelector<HTMLElement>('[data-world-stage]')
  if (!section || !stage) return
  gsap.fromTo(
    stage,
    { scale: 0.55, rotateY: -35, rotateX: 18, autoAlpha: 0 },
    {
      scale: 1,
      rotateY: 0,
      rotateX: 0,
      autoAlpha: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: section, start: 'top 85%', end: 'top 20%', scrub: 0.8 },
    },
  )
  let steer: ((n: number) => void) | null = null
  let pending = 0
  const onReady = (e: Event) => {
    steer = (e as CustomEvent).detail.steer
    steer?.(pending)
  }
  window.addEventListener('globe:ready', onReady)
  // the globe may already be up if the visitor arrived near it
  const existing = (window as Window & { __mmunGlobe?: { steer: (n: number) => void } }).__mmunGlobe
  if (existing) steer = existing.steer
  ScrollTrigger.create({
    trigger: section,
    start: 'top 75%',
    end: 'center 55%',
    scrub: true,
    onUpdate: (self) => {
      pending = gsap.parseEase('power2.inOut')(self.progress)
      steer?.(pending)
    },
  })
}

// ---------------------------------------------------------------- numbers

/** Each figure flips up into place like a scoreboard tile. */
function numbersFlip() {
  const section = document.getElementById('numbers')
  if (!section) return
  const tiles = q('[data-flip]', section)
  gsap.set(tiles, { transformPerspective: 900, transformOrigin: '50% 100%' })
  ScrollTrigger.batch(tiles, {
    start: 'top 88%',
    once: true,
    onEnter: (batch) => gsap.fromTo(batch, { rotateX: -80, autoAlpha: 0 }, { rotateX: 0, autoAlpha: 1, duration: 1.2, ease: 'expo.out', stagger: 0.1, overwrite: true }),
  })
}

// ---------------------------------------------------------------- 3D tilt

/** Cards and gallery tiles lean towards the pointer in 3D. */
function tilts() {
  if (!window.matchMedia(FINE).matches) return
  const targets = [...q('[data-tilt]'), ...q('[data-spot-frame]')]
  targets.forEach((el) => {
    gsap.set(el, { transformPerspective: 900 })
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3.out' })
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3.out' })
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect()
      ry(((e.clientX - r.left) / r.width - 0.5) * 16)
      rx(-((e.clientY - r.top) / r.height - 0.5) * 16)
    })
    el.addEventListener('pointerleave', () => {
      rx(0)
      ry(0)
    })
  })
}

// ---------------------------------------------------------------- hero depth

/** The hero separates into layers that tilt apart as the pointer moves. */
function heroDepth() {
  if (!window.matchMedia(`${DESKTOP} and ${FINE}`).matches) return
  const hero = document.querySelector<HTMLElement>('[data-hero]')
  if (!hero) return
  const media = hero.querySelector<HTMLElement>('[data-hero-media]')
  const title = hero.querySelector<HTMLElement>('[data-hero-title]')
  if (!media || !title) return
  gsap.set(hero, { perspective: 1400 })
  const mx = gsap.quickTo(media, 'x', { duration: 1.2, ease: 'power3.out' })
  const my = gsap.quickTo(media, 'y', { duration: 1.2, ease: 'power3.out' })
  const mr = gsap.quickTo(media, 'rotationY', { duration: 1.2, ease: 'power3.out' })
  const tx = gsap.quickTo(title, 'x', { duration: 0.9, ease: 'power3.out' })
  const ty = gsap.quickTo(title, 'y', { duration: 0.9, ease: 'power3.out' })
  const tr = gsap.quickTo(title, 'rotationX', { duration: 0.9, ease: 'power3.out' })
  gsap.set(media, { scale: 1.06 })
  hero.addEventListener('pointermove', (e) => {
    const px = e.clientX / window.innerWidth - 0.5
    const py = e.clientY / window.innerHeight - 0.5
    mx(px * -40)
    my(py * -26)
    mr(px * 4)
    tx(px * 30)
    ty(py * 18)
    tr(py * -8)
  })
}

// ---------------------------------------------------------------- 3D reel

/** Every photo on a turning cylinder: scroll turns it, drag spins it. */
function reel() {
  const box = document.querySelector<HTMLElement>('[data-reel]')
  const ring = box?.querySelector<HTMLElement>('[data-reel-ring]')
  const caption = box?.querySelector<HTMLElement>('[data-reel-caption]')
  if (!box || !ring) return
  const items = q('[data-reel-item]', ring)
  const n = items.length
  const step = 360 / n
  let radius = 0
  let scrollAngle = 0
  let dragAngle = 0
  let front = -1

  const layout = () => {
    const w = items[0].offsetWidth
    radius = Math.round(w / 2 / Math.tan(Math.PI / n)) + 24
    items.forEach((it, i) => {
      it.style.transform = `translate(-50%, -50%) rotateY(${i * step}deg) translateZ(${radius}px)`
    })
    apply()
  }

  const apply = () => {
    const angle = scrollAngle + dragAngle
    ring.style.transform = `translateZ(${-radius}px) rotateX(-6deg) rotateY(${angle}deg)`
    // light the photos facing us, dim the ones turning away
    let best = 0
    let bestI = 0
    items.forEach((it, i) => {
      const a = ((i * step + angle) * Math.PI) / 180
      const facing = Math.cos(a)
      it.style.opacity = String(0.18 + 0.82 * Math.max(0, facing))
      it.style.filter = facing > 0.92 ? 'none' : `saturate(${0.4 + 0.6 * Math.max(0, facing)})`
      if (facing > best) {
        best = facing
        bestI = i
      }
    })
    if (caption && bestI !== front) {
      front = bestI
      caption.textContent = (items[bestI].querySelector('img')?.getAttribute('alt') ?? '').trim()
    }
  }

  layout()
  window.addEventListener('resize', layout)

  // Scroll: pin the reel and turn it once round
  ScrollTrigger.create({
    trigger: box,
    start: 'center center',
    end: '+=160%',
    pin: true,
    scrub: 0.6,
    onUpdate: (self) => {
      scrollAngle = -self.progress * (360 - step)
      apply()
    },
  })

  // Drag: spin with inertia on top of the scroll angle
  let dragging = false
  let lastX = 0
  let startX = 0
  let v = 0
  let raf = 0
  const coast = () => {
    v *= 0.94
    dragAngle += v
    apply()
    if (Math.abs(v) > 0.05) raf = requestAnimationFrame(coast)
  }
  box.addEventListener('pointerdown', (e) => {
    dragging = true
    startX = lastX = e.clientX
    v = 0
    box.dataset.dragged = '0'
    cancelAnimationFrame(raf)
  })
  window.addEventListener('pointermove', (e) => {
    if (!dragging) return
    const dx = e.clientX - lastX
    lastX = e.clientX
    v = dx * 0.25
    dragAngle += v
    if (Math.abs(e.clientX - startX) > 6) box.dataset.dragged = '1'
    apply()
  })
  window.addEventListener('pointerup', () => {
    if (!dragging) return
    dragging = false
    raf = requestAnimationFrame(coast)
    // let the click handler see the drag flag, then clear it
    setTimeout(() => (box.dataset.dragged = '0'), 50)
  })

  // A slow idle turn so it's alive before anyone touches it (only while on screen)
  let onScreen = false
  ScrollTrigger.create({ trigger: box, start: 'top bottom', end: 'bottom top', onToggle: (self) => (onScreen = self.isActive) })
  gsap.ticker.add(() => {
    if (onScreen && !dragging && Math.abs(v) < 0.05) {
      dragAngle -= 0.05
      apply()
    }
  })
}
