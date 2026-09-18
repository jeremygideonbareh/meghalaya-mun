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
    heroScroll()
    splitReveals()
    manifesto()
    themeChapter()
    counters()
    committees()
    speaker()
    gallery()
    recognition()
    marquees()
    wordmark()
    reveals()
    maskedImages()
    chapters()
    progress()
    cursor()
    magnets()
  })
  return () => ctx.revert()
}

// ---------------------------------------------------------------- hero

function heroIntro() {
  const hero = document.querySelector<HTMLElement>('[data-hero]')
  if (!hero) return
  const title = hero.querySelector<HTMLElement>('[data-hero-title]')
  const split = title ? SplitText.create(title, { type: 'chars,words', mask: 'words' }) : null
  const slides = q('.kb', hero)

  const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
  tl.from(slides[0] ?? [], { scale: 1.35, duration: 2.6, ease: 'power3.out' }, 0)
    .from(split?.chars ?? [], { yPercent: 120, rotate: 8, duration: 1.3, stagger: 0.028 }, 0.25)
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
    scrollTrigger: { trigger: hero, start: 'top top', end: '+=120%', scrub: 0.8, pin: true },
  })
  // The frame closes into a letterbox while the title pushes towards camera.
  tl.to(media, { clipPath: 'inset(18% 6% 18% 6% round 24px)', scale: 0.9, ease: 'none' }, 0)
    .to('[data-hero-title]', { scale: 1.35, yPercent: -18, autoAlpha: 0, filter: 'blur(10px)', ease: 'power1.in' }, 0)
    .to('[data-hero-fade]', { autoAlpha: 0, y: -40, stagger: 0.02, ease: 'none' }, 0)
    .to('[data-hero-shade]', { opacity: 0.85, ease: 'none' }, 0)
}

// ---------------------------------------------------------------- text

function splitReveals() {
  q('[data-split]').forEach((el) => {
    const type = el.dataset.split === 'chars' ? 'chars,words,lines' : 'words,lines'
    const split = SplitText.create(el, { type, mask: 'lines' })
    const targets = el.dataset.split === 'chars' ? split.chars : split.words
    gsap.from(targets, {
      yPercent: 115,
      rotate: el.dataset.split === 'chars' ? 6 : 2,
      duration: 1.15,
      ease: 'expo.out',
      stagger: el.dataset.split === 'chars' ? 0.018 : 0.035,
      scrollTrigger: { trigger: el, start: 'top 86%', once: true },
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
      end: `+=${panels.length * 110}%`,
      pin: true,
      scrub: 0.8,
    },
  })
  panels.forEach((panel, i) => {
    const word = panel.querySelector('[data-theme-word]')
    const rest = panel.querySelectorAll('[data-theme-rest]')
    const img = images[i]
    const at = i * 1.2
    // Each photo opens as a growing circle from the centre of the screen.
    tl.fromTo(img, { clipPath: 'circle(0% at 50% 55%)' }, { clipPath: 'circle(75% at 50% 55%)', duration: 1, ease: 'power2.inOut' }, at)
      .fromTo(img.querySelector('img'), { scale: 1.3 }, { scale: 1, duration: 1.2, ease: 'none' }, at)
      .fromTo(
        word,
        { autoAlpha: 0, yPercent: 40, letterSpacing: '0.35em', filter: 'blur(14px)' },
        { autoAlpha: 1, yPercent: 0, letterSpacing: '-0.02em', filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' },
        at + 0.15,
      )
      .fromTo(rest, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.1 }, at + 0.45)
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
  const distance = () => track.scrollWidth - window.innerWidth + 48

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
  const line = document.querySelector<SVGPathElement>('[data-draw-line]')
  if (line) {
    gsap.fromTo(
      line,
      { drawSVG: '0%' },
      {
        drawSVG: '100%',
        ease: 'none',
        scrollTrigger: { trigger: '[data-recognition]', start: 'top 70%', end: 'bottom 70%', scrub: 0.5 },
      },
    )
  }
  q('[data-pop]').forEach((el) => {
    gsap.from(el, {
      autoAlpha: 0,
      x: el.dataset.pop === 'left' ? -80 : 80,
      rotate: el.dataset.pop === 'left' ? -3 : 3,
      duration: 1,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
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
  gsap.set([dot, ring], { xPercent: -50, yPercent: -50, autoAlpha: 1 })
  window.addEventListener('pointermove', (e) => {
    dx(e.clientX)
    dy(e.clientY)
    rx(e.clientX)
    ry(e.clientY)
  })
  document.addEventListener('pointerover', (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor], a, button')
    const label = t?.dataset.cursor ?? ''
    gsap.to(ring, { scale: t ? (label ? 2.6 : 1.7) : 1, backgroundColor: label ? 'rgba(46,119,208,0.95)' : 'rgba(46,119,208,0)', duration: 0.35 })
    gsap.to(dot, { scale: t ? 0 : 1, duration: 0.2 })
    text.textContent = label
    gsap.to(text, { autoAlpha: label ? 1 : 0, duration: 0.2 })
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
